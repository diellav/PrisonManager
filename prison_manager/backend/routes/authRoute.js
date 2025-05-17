const express = require('express');
const router = express.Router();
const { loginUser, validateToken } = require('../controllers/authController');

router.post('/login', loginUser);
router.get('/validate', validateToken);

module.exports = router;
