const securityLogsModel = require("../models/securityLogsModel");

const getSecurityLogs = async (req, res) => {
  try {
    const logs = await securityLogsModel.getAllSecurityLogs();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching security logs:", err);
    res.status(500).send(err.message);
  }
};


const getSecurityLog = async (req, res) => {
  try {
    const log = await securityLogsModel.getSecurityLogById(req.params.id);
    if (!log) return res.status(404).send("Security log not found");
    res.json(log);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const addSecurityLog = async (req, res) => {
  try {
    const {
      event_type,
      description_,
      location_,
      action_taken,
      time_stamp,
      incident_ID,
      reporting_guard_ID
    } = req.body;

    await securityLogsModel.createSecurityLog(
      event_type,
      description_,
      location_,
      action_taken,
      time_stamp,
      incident_ID,
      reporting_guard_ID
    );

    res.status(201).send("Security log created");
  } catch (err) {
    console.error("Error adding security log:", err);
    res.status(500).send(err.message);
  }
};

const updateSecurityLog = async (req, res) => {
  try {
    const {
      event_type,
      description_,
      location_,
      action_taken,
      time_stamp,
      incident_ID,
      reporting_guard_ID
    } = req.body;

    await securityLogsModel.updateSecurityLog(
      req.params.id,
      event_type,
      description_,
      location_,
      action_taken,
      time_stamp,
      incident_ID,
      reporting_guard_ID
    );

    res.send("Security log updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteSecurityLog = async (req, res) => {
  try {
    await securityLogsModel.deleteSecurityLog(req.params.id);
    res.send("Security log deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getSecurityLogs,
  getSecurityLog,
  addSecurityLog,
  updateSecurityLog,
  deleteSecurityLog
};
