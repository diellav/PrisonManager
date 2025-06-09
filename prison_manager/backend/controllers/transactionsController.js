const transactionsModel = require("../models/transactionsModel");

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionsModel.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getTransaction = async (req, res) => {
  try {
    const transaction = await transactionsModel.getTransactionById(req.params.id);
    if (!transaction) return res.status(404).send("Transaction not found");
    res.json(transaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addTransaction = async (req, res) => {
  try {
    const { prisonerID, reference_of_purchase, amount, type_, date_ } = req.body;
    await transactionsModel.createTransaction(prisonerID, reference_of_purchase, amount, type_, date_);
    res.status(201).send("Transaction created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { prisonerID, reference_of_purchase, amount, type_, date_ } = req.body;
    await transactionsModel.updateTransaction(req.params.id, prisonerID, reference_of_purchase, amount, type_, date_);
    res.send("Transaction updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionsModel.deleteTransaction(req.params.id);
    res.send("Transaction deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction
};
