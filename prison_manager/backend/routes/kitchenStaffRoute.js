const express = require("express");
const router = express.Router();
const controller = require("../controllers/kitchenStaffController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("kitchen_staff.read"), controller.getKitchenStaff);
router.get("/:id", checkPermission("kitchen_staff.read"), controller.getOneKitchenStaff);
router.put("/:id", checkPermission("kitchen_staff.edit"), controller.updateKitchenStaff);
router.delete("/:id", checkPermission("kitchen_staff.delete"), controller.deleteKitchenStaff);

module.exports = router;
