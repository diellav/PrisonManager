const paroleModel = require("../models/paroleModel");

const getAllParoles = async (req, res) => {
  try {
    const paroles = await paroleModel.getAllParoles();
    res.json(paroles);
  } catch (err) {
    console.error("Error getting paroles:", err);
    res.status(500).json({ error: "Failed to fetch paroles" });
  }
};

const getParoleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parole = await paroleModel.getParoleById(id);

    if (!parole) return res.status(404).json({ error: "Parole not found" });

    res.json(parole);
  } catch (err) {
    console.error("Error getting parole:", err);
    res.status(500).json({ error: "Failed to fetch parole" });
  }
};

const addParole = async (req, res) => {
  try {
    const paroleData = req.body;

    const result = await paroleModel.createParole(paroleData);
    res.status(201).json({ message: "Parole request created", id: result.parole_ID });
  } catch (err) {
    console.error("Error adding parole:", err);
    res.status(400).json({ error: err.message });
  }
};

const updateParole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const paroleData = req.body;

    const updated = await paroleModel.updateParole(id, paroleData);

    if (!updated) return res.status(404).json({ error: "Parole not found" });

    res.json({ message: "Parole updated successfully", id });
  } catch (err) {
    console.error("Error updating parole:", err);
    res.status(400).json({ error: err.message });
  }
};

const deleteParole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await paroleModel.deleteParole(id);
    res.json({ message: "Parole deleted successfully" });
  } catch (err) {
    console.error("Error deleting parole:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllParoles,
  getParoleById,
  addParole,
  updateParole,
  deleteParole,
};
