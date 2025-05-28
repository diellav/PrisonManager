const express = require("express");
const router = express.Router();
const prisonerController = require("../controllers/prisonersController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("prisoners.read"), prisonerController.getPrisoners);
router.get("/:id", checkPermission("prisoners.read"), prisonerController.getPrisoner);
router.post("/", checkPermission("prisoners.create"), prisonerController.addPrisoner);
router.put("/:id", checkPermission("prisoners.edit"), prisonerController.updatePrisoner);
router.delete("/:id", checkPermission("prisoners.delete"), prisonerController.deletePrisoner);

module.exports = router;
