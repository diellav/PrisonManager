const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, poolConnect } = require('../database');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    await poolConnect;

    const result = await pool
      .request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'User does not exist.' });
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password_);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const roleID = user.roleID;
    const permissionResult = await pool
      .request()
      .input('roleID', roleID)
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
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      permissions,
    });
  } catch (error) {
    console.error('Login error:', error);
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
    console.error('Sidebar error:', err);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
module.exports = {
  loginUser,
  validateToken,
  getSidebarMenu,
};
