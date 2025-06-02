const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("budget.read"), budgetController.getBudgets);
router.get("/:id", checkPermission("budget.read"), budgetController.getBudget);
router.post("/", checkPermission("budget.create"), budgetController.addBudget);
router.put("/:id", checkPermission("budget.edit"), budgetController.updateBudget);
router.delete("/:id", checkPermission("budget.delete"), budgetController.deleteBudget);

module.exports = router;
