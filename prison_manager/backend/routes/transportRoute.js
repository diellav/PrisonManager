const express = require("express");
const router = express.Router();
const transportController = require("../controllers/transportController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("transport_staff.read"), transportController.getTransport);
router.get("/:id", checkPermission("transport_staff.read"), transportController.getTransportById);
router.post("/", checkPermission("transport_staff.create"), transportController.createTransport);
router.put("/:id", checkPermission("transport_staff.edit"), transportController.updateTransport);
router.delete("/:id", checkPermission("transport_staff.delete"), transportController.deleteTransport);

module.exports = router;
