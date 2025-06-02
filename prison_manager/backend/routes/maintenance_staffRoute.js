const express = require("express");
const router = express.Router();
const controller = require("../controllers/maintenance_staffController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("maintenance_staff.read"), controller.getMaintenanceStaff);
router.get("/:id", checkPermission("maintenance_staff.read"), controller.getOneMaintenanceStaff);
router.put("/:id", checkPermission("maintenance_staff.edit"), controller.updateMaintenanceStaff);
router.delete("/:id", checkPermission("maintenance_staff.delete"), controller.deleteMaintenanceStaff);

module.exports = router;
