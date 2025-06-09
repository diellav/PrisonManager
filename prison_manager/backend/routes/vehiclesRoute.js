const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehiclesController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("vehicles.read"), vehiclesController.getAllVehicles);
router.get("/:id", checkPermission("vehicles.read"), vehiclesController.getVehicleById);
router.post("/", checkPermission("vehicles.create"), vehiclesController.addVehicle);
router.put("/:id", checkPermission("vehicles.edit"), vehiclesController.updateVehicle);
router.delete("/:id", checkPermission("vehicles.delete"), vehiclesController.deleteVehicle);

module.exports = router;
