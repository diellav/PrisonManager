const express = require("express");
const router = express.Router();
const vehiclesController = require("./vehiclesController");

router.get("/", vehiclesController.getVehicles);
router.get("/:id", vehiclesController.getVehicle);
router.post("/", vehiclesController.createVehicle);
router.put("/:id", vehiclesController.updateVehicle);
router.delete("/:id", vehiclesController.deleteVehicle);

module.exports = router;
