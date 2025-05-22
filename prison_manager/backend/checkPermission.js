const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkPermission(requiredPermission) {
  return (req, res, next) => {
    console.log('Request Headers:', req.headers);

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Token is missing.' });
    }

    const token = authHeader.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const permissions = decoded.permissions || [];

      if (!permissions.includes(requiredPermission.toLowerCase())) {
        return res.status(403).json({ message: 'Access denied. Missing permission.' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error('JWT verification error:', err);
      return res.status(401).json({ message: 'Token invalid or expired.' });
    }
  };
}

module.exports = checkPermission;
