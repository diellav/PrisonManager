const express = require("express");
const router = express.Router();
const prisonPurchasesController = require("../controllers/prisonPurchasesController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require("../authMiddleware");

router.get("/", checkPermission("prisonpurchases.read"), prisonPurchasesController.getPurchases);
router.get("/:id", checkPermission("prisonpurchases.read"), prisonPurchasesController.getPurchase);
router.post("/", checkPermission("prisonpurchases.create"), prisonPurchasesController.addPurchase);
router.put("/:id", checkPermission("prisonpurchases.edit"), prisonPurchasesController.updatePurchase);
router.delete("/:id", checkPermission("prisonpurchases.delete"), prisonPurchasesController.deletePurchase);

module.exports = router;
