
const transactionsModel = require("../models/transactionsModel");

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionsModel.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionsModel.getTransactionById(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const newTransaction = await transactionsModel.createTransaction(req.body);
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await transactionsModel.updateTransaction(req.params.id, req.body);
    if (!updatedTransaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionsModel.deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

