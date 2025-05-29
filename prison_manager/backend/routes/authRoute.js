const express = require('express');
const router = express.Router();
const { loginUser, validateToken, getSidebarMenu, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/login', loginUser);
router.get('/validate', validateToken);
router.get('/sidebar', getSidebarMenu);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
