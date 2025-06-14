const express = require('express')
const router = express.Router()
const { verifyToken } = require('../authMiddleware')
const authController = require('../controllers/authController')
const visitorController = require('../controllers/visitorController');


router.post('/login', authController.loginUser)
router.get('/validate', authController.validateToken)
router.get('/sidebar', authController.getSidebarMenu)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)
router.post('/reset-password-direct', verifyToken, authController.resetPasswordDirect)
router.post('/change-password', verifyToken, authController.changePassword);


router.post('/visitor-signup', visitorController.signUpVisitor);

module.exports = router
