const express = require("express");
const router = express.Router();
const operationalExpensesController = require("../controllers/operational_expenseController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("operational_expenses.read"), operationalExpensesController.getAllOperationalExpenses);
router.get("/:id", checkPermission("operational_expenses.read"), operationalExpensesController.getOperationalExpenseById);
router.post("/", checkPermission("operational_expenses.create"), operationalExpensesController.addOperationalExpense);
router.put("/:id", checkPermission("operational_expenses.edit"), operationalExpensesController.updateOperationalExpense);
router.delete("/:id", checkPermission("operational_expenses.delete"), operationalExpensesController.deleteOperationalExpense);

module.exports = router;
