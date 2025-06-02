const express = require("express");
const router = express.Router();
const controller = require("../controllers/transport_staffController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("transport_staff.read"), controller.getTransportStaff);
router.get("/:id", checkPermission("transport_staff.read"), controller.getOneTransportStaff);
router.put("/:id", checkPermission("transport_staff.edit"), controller.updateTransportStaff);
router.delete("/:id", checkPermission("transport_staff.delete"), controller.deleteTransportStaff);

module.exports = router;
