const express = require("express");
const router = express.Router();
const controller = require("../controllers/guardStaffController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("guard_staff.read"), controller.getGuardStaff);
router.get("/:id", checkPermission("guard_staff.read"), controller.getOneGuardStaff);
router.put("/:id", checkPermission("guard_staff.edit"), controller.updateGuardStaff);

module.exports = router;
