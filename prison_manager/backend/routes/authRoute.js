const express = require('express');
const router = express.Router();
const { loginUser, validateToken ,getSidebarMenu,} = require('../controllers/authController');
const visitorController = require('../controllers/visitorController');


router.post('/login', loginUser);
router.get('/validate', validateToken);
router.get('/sidebar', getSidebarMenu);
router.post('/visitor-signup', visitorController.signUpVisitor);

module.exports = router;
