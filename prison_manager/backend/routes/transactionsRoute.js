const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactionsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("transactions.read"), transactionsController.getAllTransactions);
router.get("/:id", checkPermission("transactions.read"), transactionsController.getTransactionById);
router.post("/", checkPermission("transactions.create"), transactionsController.createTransaction);
router.post("/from-purchase", checkPermission("transactions.create"), transactionsController.createTransactionFromPurchase);
router.put("/:id", checkPermission("transactions.edit"), transactionsController.updateTransaction);
router.delete("/:id", checkPermission("transactions.delete"), transactionsController.deleteTransaction);

module.exports = router;
