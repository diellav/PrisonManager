const express = require('express');
const router = express.Router();
const visitRequest = require('../controllers/visitRequestController');
const checkPermission=require('../checkPermission');


router.get('/pending', checkPermission("manage_visit_requests.read"),visitRequest.getPendingRequests);
router.put('/:id/approve',visitRequest.approveVisitRequest);  
router.put('/:id/reject', visitRequest.rejectVisitRequest);
router.post('/', visitRequest.requestVisit);

module.exports = router;
