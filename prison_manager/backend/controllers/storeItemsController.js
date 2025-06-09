const storeItemsModel = require("../models/storeItemsModel");

const getStoreItems = async (req, res) => {
  try {
    const items = await storeItemsModel.getAllStoreItems();
    res.json(items);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getStoreItem = async (req, res) => {
  try {
    const itemID = req.params.id;
    const item = await storeItemsModel.getStoreItemById(itemID);
    if (!item) return res.status(404).send("Store item not found");
    res.json(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addStoreItem = async (req, res) => {
  try {
    const result = await storeItemsModel.createStoreItem(req.body);
    res.status(201).json({ message: "Store item created", store_item_ID: result.store_item_ID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateStoreItem = async (req, res) => {
  try {
    await storeItemsModel.updateStoreItem(req.params.id, req.body);
    res.send("Store item updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteStoreItem = async (req, res) => {
  try {
    await storeItemsModel.deleteStoreItem(req.params.id);
    res.send("Store item deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getStoreItems,
  getStoreItem,
  addStoreItem,
  updateStoreItem,
  deleteStoreItem,
};
