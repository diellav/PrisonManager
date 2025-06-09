const express = require("express");
const router = express.Router();
const prisonPurchasesController = require("../controllers/prisonPurchasesController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require("../authMiddleware");

router.get("/", checkPermission("prison_purchases.read"), prisonPurchasesController.getPurchases);
router.get("/:id", checkPermission("prison_purchases.read"), prisonPurchasesController.getPurchase);
router.post("/", checkPermission("prison_purchases.create"), prisonPurchasesController.addPurchase);
router.put("/:id", checkPermission("prison_purchases.edit"), prisonPurchasesController.updatePurchase);
router.delete("/:id", checkPermission("prison_purchases.delete"), prisonPurchasesController.deletePurchase);

module.exports = router;
