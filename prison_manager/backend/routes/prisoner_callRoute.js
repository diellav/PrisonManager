const express = require("express");
const router = express.Router();
const prisonerCallController = require("../controllers/prisoner_callsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("prisoner_calls.read"), prisonerCallController.getAllPrisonerCalls);
router.get("/:id", checkPermission("prisoner_calls.read"), prisonerCallController.getPrisonerCallById);
router.post("/", checkPermission("prisoner_calls.create"), prisonerCallController.addPrisonerCall);
router.put("/:id", checkPermission("prisoner_calls.edit"), prisonerCallController.updatePrisonerCall);
router.delete("/:id", checkPermission("prisoner_calls.delete"), prisonerCallController.deletePrisonerCall);

module.exports = router;
