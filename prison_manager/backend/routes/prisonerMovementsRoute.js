const express = require("express");
const router = express.Router();
const prisonerMovementController = require("../controllers/prisonerMovementController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("prisoner_movements.read"), prisonerMovementController.getPrisonerMovements);
router.get("/:id", checkPermission("prisoner_movements.read"), prisonerMovementController.getPrisonerMovement);
router.post("/", checkPermission("prisoner_movements.create"), prisonerMovementController.addPrisonerMovement);
router.put("/:id", checkPermission("prisoner_movements.edit"), prisonerMovementController.updatePrisonerMovement);
router.delete("/:id", checkPermission("prisoner_movements.delete"), prisonerMovementController.deletePrisonerMovement);

module.exports = router;
