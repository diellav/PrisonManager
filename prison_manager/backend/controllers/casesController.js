const caseModel = require("../models/caseModel");

const getAllCases = async (req, res) => {
  try {
    const cases = await caseModel.getAllCases();
    res.json(cases);
  } catch (err) {
    console.error("Error getting cases:", err);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
};

const getCaseById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const caseItem = await caseModel.getCaseById(id);

    if (!caseItem) return res.status(404).json({ error: "Case not found" });

    res.json(caseItem);
  } catch (err) {
    console.error("Error getting case:", err);
    res.status(500).json({ error: "Failed to fetch case" });
  }
};

const addCase = async (req, res) => {
  try {
    const caseData = req.body;
    const result = await caseModel.createCase(caseData);
    res.status(201).json({ message: "Case created", id: result.case_ID });
  } catch (err) {
    console.error("Error adding case:", err);
    res.status(400).json({ error: err.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const caseData = req.body;

    const updated = await caseModel.updateCase(id, caseData);

    if (!updated) return res.status(404).json({ error: "Case not found" });

    res.json({ message: "Case updated successfully", id });
  } catch (err) {
    console.error("Error updating case:", err);
    res.status(400).json({ error: err.message });
  }
};

const deleteCase = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await caseModel.deleteCase(id);
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Error deleting case:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCases,
  getCaseById,
  addCase,
  updateCase,
  deleteCase,
};
