const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../authMiddleware');

router.get('/', verifyToken, userController.getProfile);

module.exports = router;
