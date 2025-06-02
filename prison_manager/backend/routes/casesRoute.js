const express = require("express");
const router = express.Router();
const casesController = require("../controllers/casesController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("cases.read"), casesController.getAllCases);
router.get("/:id", checkPermission("cases.read"), casesController.getCaseById);
router.post("/", checkPermission("cases.create"), casesController.addCase);
router.put("/:id", checkPermission("cases.edit"), casesController.updateCase);
router.delete("/:id", checkPermission("cases.delete"), casesController.deleteCase);

module.exports = router;
