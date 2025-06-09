const visitorManager = require('../models/visitRequestModel');
const {
  sendVisitApprovedEmail,
  sendVisitRejectedEmail
} = require('../utils/emailSender');

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
  try {
    const requestId = parseInt(req.params.id);
    console.log("Approving request with ID:", requestId);
    const request = await visitorManager.getRequestById(requestId);
    console.log("Fetched request:", request);
    if (!request) {
      return res.status(404).json({ error: 'Request not found or already processed.' });
    }

    const {
      visitor_ID,
      prisonerID,
      visit_date,
      relationship,
      email,
      first_name,
      last_name,
      prisoner_first_name,
      prisoner_last_name
    } = request;

    const fullName = `${first_name} ${last_name}`;
    const prisonerName = `${prisoner_first_name} ${prisoner_last_name}`;

    await visitorManager.insertVisit({ visitor_ID, prisonerID, visit_date, relationship });
    await visitorManager.markRequestAsApproved(requestId);

    try {
      await sendVisitApprovedEmail(email, fullName, prisonerName, visit_date);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.json({ message: 'Visit request approved.' });
  } catch (err) {
    console.error("Error during approval process:", err);
    res.status(500).json({ error: 'Approval failed.' });
  }
};

const rejectVisitRequest = async (req, res) => {
  const requestId = parseInt(req.params.id);
  try {
    const request = await visitorManager.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found or already processed.' });
    }

    const {
      email,
      first_name,
      last_name,
      visit_date,
      prisoner_first_name,
      prisoner_last_name
    } = request;

    const fullName = `${first_name} ${last_name}`;
    const prisonerName = `${prisoner_first_name} ${prisoner_last_name}`;

    await visitorManager.markRequestAsRejected(requestId);

    try {
      await sendVisitRejectedEmail(email, fullName, prisonerName, visit_date);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.json({ message: 'Visit request rejected.' });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ error: 'Rejection failed.' });
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

    res.json({ message: 'Visit request submitted.' });
  } catch (err) {
    console.error("Visit request error:", err);
    res.status(500).json({ error: "Failed to create visit request." });
  }
};

module.exports = {
  getPendingRequests,
  approveVisitRequest,
  requestVisit,
  rejectVisitRequest,
};
