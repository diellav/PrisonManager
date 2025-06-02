const assetModel = require("../models/assetsModel");

const getAssets = async (req, res) => {
  try {
    const assets = await assetModel.getAllAssets();
    res.json(assets);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAsset = async (req, res) => {
  try {
    const asset = await assetModel.getAssetById(req.params.id);
    if (!asset) return res.status(404).send("Asset not found");
    res.json(asset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addAsset = async (req, res) => {
  try {
    const { name, category, purchase_date, status_, location_ } = req.body;
    await assetModel.createAsset(name, category, purchase_date, status_, location_);
    res.status(201).send("Asset created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateAsset = async (req, res) => {
  try {
    const { name, category, purchase_date, status_, location_ } = req.body;
    await assetModel.updateAsset(req.params.id, name, category, purchase_date, status_, location_);
    res.send("Asset updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteAsset = async (req, res) => {
  try {
    await assetModel.deleteAsset(req.params.id);
    res.send("Asset deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAssets,
  getAsset,
  addAsset,
  updateAsset,
  deleteAsset,
};
