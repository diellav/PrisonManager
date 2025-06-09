
const transportModel = require("../models/transportModel");

const getTransport = async (req, res) => {
  try {
    const transport = await transportModel.getAllTransport();
    res.json(transport);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transport records" });
  }
};

const getTransportById = async (req, res) => {
  try {
    const transport = await transportModel.getTransportById(req.params.id);
    if (!transport) return res.status(404).json({ error: "Transport not found" });
    res.json(transport);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transport record" });
  }
};

const createTransport = async (req, res) => {
  try {
    const newTransport = await transportModel.createTransport(req.body);
    res.status(201).json(newTransport);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transport record" });
  }
};

const updateTransport = async (req, res) => {
  try {
    const updatedTransport = await transportModel.updateTransport(req.params.id, req.body);
    if (!updatedTransport) return res.status(404).json({ error: "Transport not found" });
    res.json(updatedTransport);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transport record" });
  }
};

const deleteTransport = async (req, res) => {
  try {
    await transportModel.deleteTransport(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transport record" });
  }
};

module.exports = {
  getTransport,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
};
