const operationalExpensesModel = require("../models/operational_expenseController");

const getAllOperationalExpenses = async (req, res) => {
  try {
    const expenses = await operationalExpensesModel.getAllOperationalExpenses();
    res.json(expenses);
  } catch (err) {
    console.error("Error in getAllOperationalExpenses:", err);
    res.status(500).send(err.message);
  }
};

const getOperationalExpenseById = async (req, res) => {
  try {
    const expense = await operationalExpensesModel.getOperationalExpenseById(req.params.id);
    if (!expense) return res.status(404).send("Operational expense not found");
    res.json(expense);
  } catch (err) {
    console.error("Error in getOperationalExpenseById:", err);
    res.status(500).send(err.message);
  }
};

const addOperationalExpense = async (req, res) => {
  try {
    const newExpense = req.body;
    const result = await operationalExpensesModel.createOperationalExpense(newExpense);
    res.status(201).json({ message: "Operational expense created", id: result.operational_expense_ID });
  } catch (err) {
    console.error("Error in addOperationalExpense:", err);
    res.status(500).send(err.message);
  }
};

const updateOperationalExpense = async (req, res) => {
  try {
    const updatedExpense = req.body;
    await operationalExpensesModel.updateOperationalExpense(req.params.id, updatedExpense);
    res.json({ message: "Operational expense updated" });
  } catch (err) {
    console.error("Error in updateOperationalExpense:", err);
    res.status(500).send(err.message);
  }
};

const deleteOperationalExpense = async (req, res) => {
  try {
    await operationalExpensesModel.deleteOperationalExpense(req.params.id);
    res.json({ message: "Operational expense deleted" });
  } catch (err) {
    console.error("Error in deleteOperationalExpense:", err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllOperationalExpenses,
  getOperationalExpenseById,
  addOperationalExpense,
  updateOperationalExpense,
  deleteOperationalExpense
};
