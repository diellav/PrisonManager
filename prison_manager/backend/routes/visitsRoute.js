const express = require('express');
const router = express.Router();
const visitsController = require('../controllers/visitsController');
const { verifyToken } = require('../authMiddleware');

router.get('/approved', verifyToken, visitsController.getApprovedVisits);

module.exports = router;
