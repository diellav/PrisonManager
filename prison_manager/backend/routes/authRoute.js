const express = require('express');
const router = express.Router();
const { loginUser, validateToken ,getSidebarMenu,} = require('../controllers/authController');

router.post('/login', loginUser);
router.get('/validate', validateToken);
router.get('/sidebar', getSidebarMenu);
module.exports = router;
