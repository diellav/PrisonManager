const cellModel = require("../models/cellModel");

const getCells = async (req, res) => {
  try {
    const cells = await cellModel.getAllCells();
    res.json(cells);
  } catch (err) {
    console.error("Error fetching cells:", err);
    res.status(500).send(err.message);
  }
};

const getCell = async (req, res) => {
  try {
    const cell = await cellModel.getCellById(req.params.id);
    if (!cell) return res.status(404).send("Cell not found");
    res.json(cell);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addCell = async (req, res) => {
  try {
    const { block_id, capacity, actual_capacity, category, cell_number } = req.body;
    await cellModel.createCell(block_id, capacity, actual_capacity, category, cell_number);
    res.status(201).send("Cell created");
  } catch (err) {
    console.error("Error adding cell:", err);
    res.status(500).send(err.message);
  }
};

const updateCell = async (req, res) => {
  try {
    const { block_id, capacity, actual_capacity, category, cell_number } = req.body;
    await cellModel.updateCell(req.params.id, block_id, capacity, actual_capacity, category, cell_number);
    res.send("Cell updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteCell = async (req, res) => {
  try {
    await cellModel.deleteCell(req.params.id);
    res.send("Cell deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getCells,
  getCell,
  addCell,
  updateCell,
  deleteCell
};
