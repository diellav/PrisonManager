const courtHearingModel = require("../models/court_hearingModel");

const getAllHearings = async (req, res) => {
  try {
    const hearings = await courtHearingModel.getAllHearings();
    res.json(hearings);
  } catch (err) {
    console.error("Error getting court hearings:", err);
    res.status(500).json({ error: "Failed to fetch court hearings" });
  }
};

const getHearingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hearing = await courtHearingModel.getHearingById(id);

    if (!hearing) return res.status(404).json({ error: "Court hearing not found" });

    res.json(hearing);
  } catch (err) {
    console.error("Error getting court hearing:", err);
    res.status(500).json({ error: "Failed to fetch court hearing" });
  }
};

const addHearing = async (req, res) => {
  try {
    const hearingData = req.body;
    const result = await courtHearingModel.createHearing(hearingData);
    res.status(201).json({ message: "Court hearing created", id: result.court_hearingID });
  } catch (err) {
    console.error("Error adding court hearing:", err);
    res.status(400).json({ error: err.message });
  }
};

const updateHearing = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hearingData = req.body;

    const updated = await courtHearingModel.updateHearing(id, hearingData);

    if (!updated) return res.status(404).json({ error: "Court hearing not found" });

    res.json({ message: "Court hearing updated successfully", id });
  } catch (err) {
    console.error("Error updating court hearing:", err);
    res.status(400).json({ error: err.message });
  }
};

const deleteHearing = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await courtHearingModel.deleteHearing(id);
    res.json({ message: "Court hearing deleted successfully" });
  } catch (err) {
    console.error("Error deleting court hearing:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllHearings,
  getHearingById,
  addHearing,
  updateHearing,
  deleteHearing,
};
