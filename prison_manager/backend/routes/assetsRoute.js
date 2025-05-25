const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetsController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require('../authMiddleware');

router.get("/", verifyToken, checkPermission("assets.read"), assetController.getAssets);
router.get("/:id", verifyToken, checkPermission("assets.read"), assetController.getAsset);
router.post("/", verifyToken, checkPermission("assets.create"), assetController.addAsset);
router.put("/:id", verifyToken, checkPermission("assets.edit"), assetController.updateAsset);
router.delete("/:id", verifyToken, checkPermission("assets.delete"), assetController.deleteAsset);

module.exports = router;
