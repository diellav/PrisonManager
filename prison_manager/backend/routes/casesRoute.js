const express = require("express");
const router = express.Router();
const casesController = require("../controllers/casesController");
const checkPermission = require("../checkPermission");

// GET all cases
router.get("/", checkPermission("cases.read"), casesController.getAllCases);

// GET a single case by ID
router.get("/:id", checkPermission("cases.read"), casesController.getCaseById);

// POST a new case
router.post("/", checkPermission("cases.create"), casesController.addCase);

// PUT to update a case
router.put("/:id", checkPermission("cases.edit"), casesController.updateCase);

// DELETE a case
router.delete("/:id", checkPermission("cases.delete"), casesController.deleteCase);

module.exports = router;
