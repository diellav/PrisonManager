const Transaction = require('../models/transactionModel');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch {
    res.status(500).json({ error: 'Failed to get transaction' });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { prisonerID, reference_of_purchase, amount, type_, date_ } = req.body;
    const transaction = await Transaction.create({ prisonerID, reference_of_purchase, amount, type_, date_ });
    res.status(201).json(transaction);
  } catch {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    const { prisonerID, reference_of_purchase, amount, type_, date_ } = req.body;
    await transaction.update({ prisonerID, reference_of_purchase, amount, type_, date_ });
    res.json(transaction);
  } catch {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    await transaction.destroy();
    res.json({ message: 'Transaction deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
