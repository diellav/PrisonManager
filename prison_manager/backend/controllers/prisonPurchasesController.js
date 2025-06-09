const prisonPurchasesModel = require("../models/prisonPurchasesModel");

const getPurchases = async (req, res) => {
  try {
    const purchases = await prisonPurchasesModel.getAllPurchases();
    res.json(purchases);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPurchase = async (req, res) => {
  try {
    const purchase = await prisonPurchasesModel.getPurchaseById(req.params.id);
    if (!purchase) return res.status(404).send("Prison purchase not found");
    res.json(purchase);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addPurchase = async (req, res) => {
  try {
    const { store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by } = req.body;
    await prisonPurchasesModel.createPurchase(store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by);
    res.status(201).send("Prison purchase created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePurchase = async (req, res) => {
  try {
    const { store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by } = req.body;
    await prisonPurchasesModel.updatePurchase(req.params.id, store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by);
    res.send("Prison purchase updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePurchase = async (req, res) => {
  try {
    await prisonPurchasesModel.deletePurchase(req.params.id);
    res.send("Prison purchase deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPurchases,
  getPurchase,
  addPurchase,
  updatePurchase,
  deletePurchase
};
