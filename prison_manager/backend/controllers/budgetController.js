const budgetModel = require("../models/budgetModel");

const getBudgets = async (req, res) => {
  try {
    const budget = await budgetModel.getAllBudgets();
    res.json(budget);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getBudget = async (req, res) => {
  try {
    const budget = await budgetModel.getBudgetById(req.params.id);
    if (!budget) return res.status(404).send("Budget not found");
    res.json(budget);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addBudget = async (req, res) => {
  try {
    const { year_, allocated_funds, used_funds, last_updated ,description_} = req.body;
     if (used_funds > allocated_funds) {
      return res.status(400).send("Used funds cannot be greater than allocated funds.");
    }
    const remaining_funds = allocated_funds - used_funds;
    await budgetModel.createBudget(year_, allocated_funds, used_funds, remaining_funds, last_updated,description_);
    res.status(201).send("Budget created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateBudget = async (req, res) => {
  try {
    const { year_, allocated_funds, used_funds, last_updated, description_ } = req.body;
    if (used_funds > allocated_funds) {
      return res.status(400).send("Used funds cannot be greater than allocated funds.");
    }
    const remaining_funds = allocated_funds - used_funds;
    await budgetModel.updateBudget(req.params.id, year_, allocated_funds, used_funds, remaining_funds, last_updated,description_);
    res.send("Budget updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteBudget = async (req, res) => {
  try {
    await budgetModel.deleteBudget(req.params.id);
    res.send("Budget deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getBudgets,
  getBudget,
  addBudget,
  updateBudget,
  deleteBudget
};
