const jwt = require('jsonwebtoken');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization') || req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = { verifyToken };
