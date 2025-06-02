const incidentModel = require("../models/incidentsModel");

const getIncidents = async (req, res) => {
  try {
    const incidents = await incidentModel.getAllIncidents();
    res.json(incidents);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getIncident = async (req, res) => {
  try {
    const incidentID = req.params.id;
    const incident = await incidentModel.getIncidentById(incidentID);
    if (!incident) return res.status(404).send("Incident not found");

    incident.prisonerIDs = incident.prisoners.map(p => p.prisonerID);

    res.json(incident);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addIncident = async (req, res) => {
  try {
    const { date_reported, severity, resolved, follow_up_actions, prisonerIDs } = req.body;
    const result = await incidentModel.createIncidentWithPrisoners(
      date_reported,
      severity,
      resolved,
      follow_up_actions,
      prisonerIDs
    );
    res.status(201).json({ message: "Incident created", incident_ID: result.incident_ID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateIncident = async (req, res) => {
  try {
    const { date_reported, severity, resolved, follow_up_actions, prisonerIDs } = req.body;
    await incidentModel.updateIncident(
      req.params.id,
      date_reported,
      severity,
      resolved,
      follow_up_actions,
      prisonerIDs
    );
    res.send("Incident updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteIncident = async (req, res) => {
  try {
    await incidentModel.deleteIncident(req.params.id);
    res.send("Incident deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getIncidents,
  getIncident,
  addIncident,
  updateIncident,
  deleteIncident,
};
