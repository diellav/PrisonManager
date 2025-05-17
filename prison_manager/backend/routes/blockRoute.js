const express = require("express");
const router = express.Router();
const blockController = require("../controllers/blockController");

router.get("/", blockController.getBlocks);
router.get("/:id", blockController.getBlock);
router.post("/", blockController.addBlock);
router.put("/:id", blockController.updateBlock);
router.delete("/:id", blockController.deleteBlock);

module.exports = router;
