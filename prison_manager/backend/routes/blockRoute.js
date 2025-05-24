const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("blocks.read"), blockController.getBlocks);
router.get("/:id", checkPermission("blocks.read"), blockController.getBlock);
router.post("/", checkPermission("blocks.create"), blockController.addBlock);
router.put("/:id", checkPermission("blocks.edit"), blockController.updateBlock);
router.delete("/:id", checkPermission("blocks.delete"), blockController.deleteBlock);

module.exports = router;
