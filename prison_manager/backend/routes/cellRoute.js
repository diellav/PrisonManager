const express = require("express");
const router = express.Router();
const cellController = require("../controllers/cellController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("cells.read"), cellController.getCells);
router.get("/:id", checkPermission("cells.read"), cellController.getCell);
router.post("/", checkPermission("cells.create"), cellController.addCell);
router.put("/:id", checkPermission("cells.edit"), cellController.updateCell);
router.delete("/:id", checkPermission("cells.delete"), cellController.deleteCell);

module.exports = router;
