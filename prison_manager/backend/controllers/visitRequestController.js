const visitorManager = require('../models/visitRequestModel');

const getPendingRequests = async (req, res) => {
  try {
    const requests = await visitorManager.fetchPendingRequests();
    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ error: 'Failed to fetch pending requests.' });
  }
};

const approveVisitRequest = async (req, res) => {
const requestId = parseInt(req.params.id);
  try {
    const request = await visitorManager.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found or already processed.' });
    }
    const { visitor_ID, prisonerID, visit_date, relationship } = request;

    await visitorManager.insertVisit({ visitor_ID, prisonerID, visit_date, relationship });
    await visitorManager.markRequestAsApproved(requestId);

    return res.json({ message: 'Visit request approved.' });
  } catch (err) {
    console.error('Error approving request:', err);
    res.status(500).json({ error: 'Approval failed.' });
  }
};

const requestVisit = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { visitor_ID, prisonerID, visit_date, relationship } = req.body;

    const exists = await visitorManager.prisonerExists(prisonerID);
    if (!exists) {
      return res.status(404).json({ error: "The prisoner ID you entered does not exist." });
    }

    await visitorManager.createPendingVisitRequest({ visitor_ID, prisonerID, visit_date, relationship });
    return res.json({ message: 'Visit request submitted.' });
  } catch (err) {
    console.error("Visit request error:", err);
    res.status(500).json({ error: "Failed to create visit request." });
  }
};


const rejectVisitRequest = async (req, res) => {
  const requestId = parseInt(req.params.id);

  try {
    const request = await visitorManager.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found or already processed.' });
    }

    await visitorManager.markRequestAsRejected(requestId);

    return res.json({ message: 'Visit request rejected.' });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ error: 'Rejection failed.' });
  }
};

module.exports = {
  getPendingRequests,
  approveVisitRequest,
  requestVisit,
  rejectVisitRequest,
};
