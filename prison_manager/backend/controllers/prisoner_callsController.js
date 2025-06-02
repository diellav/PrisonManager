const prisonerCallsModel = require("../models/prisoner_callModel");

const getAllPrisonerCalls = async (req, res) => {
  try {
    const calls = await prisonerCallsModel.getAllPrisonerCalls();
    res.json(calls);
  } catch (err) {
    console.error("Error getting prisoner calls:", err);
    res.status(500).json({ error: "Failed to fetch prisoner calls" });
  }
};

const getPrisonerCallById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const call = await prisonerCallsModel.getPrisonerCallById(id);

    if (!call) return res.status(404).json({ error: "Prisoner call not found" });

    res.json(call);
  } catch (err) {
    console.error("Error getting prisoner call:", err);
    res.status(500).json({ error: "Failed to fetch prisoner call" });
  }
};

const addPrisonerCall = async (req, res) => {
  try {
    const callData = req.body;
    const result = await prisonerCallsModel.createPrisonerCall(callData);
    res.status(201).json({ message: "Prisoner call created", id: result.prisoner_call_ID });
  } catch (err) {
    console.error("Error adding prisoner call:", err);
    res.status(400).json({ error: err.message });
  }
};

const updatePrisonerCall = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const callData = req.body;

    const updated = await prisonerCallsModel.updatePrisonerCall(id, callData);

    if (!updated) return res.status(404).json({ error: "Prisoner call not found" });

    res.json({ message: "Prisoner call updated successfully", id });
  } catch (err) {
    console.error("Error updating prisoner call:", err);
    res.status(400).json({ error: err.message });
  }
};

const deletePrisonerCall = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await prisonerCallsModel.deletePrisonerCall(id);

    if (!deleted) return res.status(404).json({ error: "Prisoner call not found" });

    res.json({ message: "Prisoner call deleted successfully" });
  } catch (err) {
    console.error("Error deleting prisoner call:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPrisonerCalls,
  getPrisonerCallById,
  addPrisonerCall,
  updatePrisonerCall,
  deletePrisonerCall,
};
