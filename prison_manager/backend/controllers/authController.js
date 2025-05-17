const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool, poolConnect } = require('../database');
const JWT_SECRET = process.env.JWT_SECRET ;

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
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      {
        userID: user.userID,
        username: user.username, 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: ' Server error.' });
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

module.exports = {
  loginUser,
  validateToken,
};
