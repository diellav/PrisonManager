const express = require("express");
const router = express.Router();
const prisonerWorkController = require("../controllers/prisonerWorkController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("prisoner_work.read"), prisonerWorkController.getAllPrisonerWorks);
router.get("/:id", checkPermission("prisoner_work.read"), prisonerWorkController.getPrisonerWorkById);
router.post("/", checkPermission("prisoner_work.create"), prisonerWorkController.addPrisonerWork);
router.put("/:id", checkPermission("prisoner_work.edit"), prisonerWorkController.updatePrisonerWork);
router.delete("/:id", checkPermission("prisoner_work.delete"), prisonerWorkController.deletePrisonerWork);

module.exports = router;
