const blockModel = require("../models/blockModel");

const getBlocks = async (req, res) => {
  try {
    const blocks = await blockModel.getAllBlocks();
    res.json(blocks);
  } catch (err) {
    console.error("Error fetching blocks:", err);
    res.status(500).send(err.message);
  }
};

const getBlock = async (req, res) => {
  try {
    const block = await blockModel.getBlockById(req.params.id);
    if (!block) return res.status(404).send("Block not found");
    res.json(block);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addBlock = async (req, res) => {
  try {
    const { block_name, category } = req.body;
    await blockModel.createBlock(block_name, category);
    res.status(201).send("Block created");
  } catch (err) {
    console.error("Error adding block:", err);
    res.status(500).send(err.message);
  }
};

const updateBlock = async (req, res) => {
  try {
    const { block_name, category } = req.body;
    await blockModel.updateBlock(req.params.id, block_name, category);
    res.send("Block updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteBlock = async (req, res) => {
  try {
    await blockModel.deleteBlock(req.params.id);
    res.send("Block deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getBlocks,
  getBlock,
  addBlock,
  updateBlock,
  deleteBlock
};
