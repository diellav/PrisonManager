const express = require("express");
const router = express.Router();
const cellController = require("../controllers/cellController");

router.get("/", cellController.getCells);
router.get("/:id", cellController.getCell);
router.post("/", cellController.addCell);
router.put("/:id", cellController.updateCell);
router.delete("/:id", cellController.deleteCell);

module.exports = router;