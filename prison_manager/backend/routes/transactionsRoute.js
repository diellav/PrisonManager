const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("transactions.read"), transactionsController.getTransactions);
router.get("/:id", checkPermission("transactions.read"), transactionsController.getTransaction);
router.post("/", checkPermission("transactions.create"), transactionsController.addTransaction);
router.put("/:id", checkPermission("transactions.edit"), transactionsController.updateTransaction);
router.delete("/:id", checkPermission("transactions.delete"), transactionsController.deleteTransaction);

module.exports = router;
