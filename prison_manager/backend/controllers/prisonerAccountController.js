const prisonerAccountModel = require("../models/prisonerAccountModel");

const getPrisonerAccounts = async (req, res) => {
  try {
    const accounts = await prisonerAccountModel.getAllPrisonerAccounts();
    res.json(accounts);
  } catch (err) {
    console.error("Error fetching prisoner accounts:", err);
    res.status(500).send(err.message);
  }
};

const getPrisonerAccount = async (req, res) => {
  try {
    const account = await prisonerAccountModel.getPrisonerAccountById(req.params.id);
    if (!account) return res.status(404).send("Prisoner account not found");
    res.json(account);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addPrisonerAccount = async (req, res) => {
  try {
    const { prisonerID, balance, status_ } = req.body;
    await prisonerAccountModel.createPrisonerAccount(prisonerID, balance, status_);
    res.status(201).send("Prisoner account created");
  } catch (err) {
    console.error("Error adding prisoner account:", err);
    res.status(500).send(err.message);
  }
};

const updatePrisonerAccount = async (req, res) => {
  try {
    const { prisonerID, balance, status_ } = req.body;
    await prisonerAccountModel.updatePrisonerAccount(req.params.id, prisonerID, balance, status_);
    res.send("Prisoner account updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePrisonerAccount = async (req, res) => {
  try {
    await prisonerAccountModel.deletePrisonerAccount(req.params.id);
    res.send("Prisoner account deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPrisonerAccounts,
  getPrisonerAccount,
  addPrisonerAccount,
  updatePrisonerAccount,
  deletePrisonerAccount,
};
