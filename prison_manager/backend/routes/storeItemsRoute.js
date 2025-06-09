const express = require("express");
const router = express.Router();
const storeItemsController = require("../controllers/storeItemsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("store_items.read"), storeItemsController.getStoreItems);
router.get("/:id", checkPermission("store_items.read"), storeItemsController.getStoreItem);
router.post("/", checkPermission("store_items.create"), storeItemsController.addStoreItem);
router.put("/:id", checkPermission("store_items.edit"), storeItemsController.updateStoreItem);
router.delete("/:id", checkPermission("store_items.delete"), storeItemsController.deleteStoreItem);

module.exports = router;
