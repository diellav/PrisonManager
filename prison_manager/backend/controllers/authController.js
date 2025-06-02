const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, poolConnect } = require('../database');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');
const sql = require('mssql');
const sendResetEmail = require('../utils/emailSender');


const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    await poolConnect;

    
    const userResult = await pool
      .request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE username = @username');

    if (userResult.recordset.length > 0) {
      const user = userResult.recordset[0];

      const isMatch = await bcrypt.compare(password, user.password_);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password.' });
      }

  
      const permissionResult = await pool
        .request()
        .input('roleID', user.roleID)
        .query(`
          SELECT p.name
          FROM role_permissions rp
          JOIN permissions p ON rp.permissionID = p.permissionID
          WHERE rp.roleID = @roleID
        `);

      const permissions = permissionResult.recordset.map(p => p.name.toLowerCase());

      const token = jwt.sign(
        {
          userID: user.userID,
          username: user.username,
          roleID: user.roleID,
          permissions,
          photo: user.photo,
          type: 'user',
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        token,
        permissions,
        type: 'user',
      });
    }


    const visitorResult = await pool
      .request()
      .input('username', username)
      .query('SELECT * FROM Visitors WHERE username = @username');

    if (visitorResult.recordset.length === 0) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const visitor = visitorResult.recordset[0];

    const isMatchVisitor = await bcrypt.compare(password, visitor.password);
    if (!isMatchVisitor) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      {
        visitorID: visitor.visitor_ID,
        username: visitor.username,
        permissions: [], 
        type: 'visitor',
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
  token,
  permissions: [],
  type: 'visitor',
  user: {
    visitorID: visitor.visitor_ID,
    username: visitor.username,
    type: 'visitor',
  },
});

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const validateToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or has expired.' });
  }
};

const getSidebarMenu = async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

   
    if (decoded.type === 'visitor') {
      return res.json([]);
    }

    const roleID = decoded.roleID;

    await poolConnect;
    const result = await pool
      .request()
      .input('roleID', roleID)
      .query(`
        SELECT p.name, p.path, p.label, p.section, p.group_
        FROM role_permissions rp
        JOIN permissions p ON rp.permissionID = p.permissionID
        WHERE rp.roleID = @roleID AND p.name LIKE '%.read'
        ORDER BY p.group_, p.section, p.label
      `);

    const menuMap = {};
    result.recordset.forEach((perm) => {
      const group = perm.group_ || 'Other';
      const group = perm.group_ || 'Other';
      if (!menuMap[group]) {
        menuMap[group] = [];
      }
      menuMap[group].push({
        path: perm.path,
        label: perm.label,
      });
    });
    const menuSections = Object.entries(menuMap).map(([group, items]) => ({
      section: group,
      items,
    }));
    return res.json(menuSections);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await poolConnect;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT userID FROM users WHERE email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = uuidv4();
    const expires = new Date(Date.now() + 3600000);

    await pool.request()
      .input('userID', sql.Int, user.userID)
      .input('token', sql.VarChar, token)
      .input('expires', sql.DateTime, expires)
      .query('INSERT INTO PasswordResetTokens (userID, token, expires) VALUES (@userID, @token, @expires)');

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await sendResetEmail(email, resetLink);

    res.json({ message: 'Reset link sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    await poolConnect;

    const tokenResult = await pool.request()
      .input('token', sql.VarChar, token)
      .query('SELECT * FROM PasswordResetTokens WHERE token = @token');

    const tokenRecord = tokenResult.recordset[0];
    if (!tokenRecord || new Date(tokenRecord.expires) < new Date()) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('password_', sql.VarChar, hashedPassword)
      .input('userID', sql.Int, tokenRecord.userID)
      .query('UPDATE users SET password_ = @password_ WHERE userID = @userID');

    await pool.request()
      .input('token', sql.VarChar, token)
      .query('DELETE FROM PasswordResetTokens WHERE token = @token');

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPasswordDirect = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { password } = req.body;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);

    await poolConnect;
    await pool.request()
      .input('userID', sql.Int, decoded.userID)
      .input('password_', sql.VarChar, hashed)
      .query('UPDATE users SET password_ = @password_ WHERE userID = @userID');

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password' });
  }
};

const changePassword = async (req, res) => {
  
  const userID = req.user.userID;
  const { currentPassword, newPassword } = req.body;
  try {
    await poolConnect;
    const userResult = await pool.request()
      .input('userID', sql.Int, userID)
      .query('SELECT password_ FROM users WHERE userID = @userID');
    
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('userID', sql.Int, userID)
      .input('password_', sql.VarChar, hashed)
      .query('UPDATE users SET password_ = @password_ WHERE userID = @userID');

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
};




module.exports = {
  loginUser,
  validateToken,
  getSidebarMenu,
  forgotPassword,
  resetPassword,
  resetPasswordDirect,
  changePassword
};
