const express = require("express");
const router = express.Router();
const transportController = require("../controllers/transportController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("transport.read"), transportController.getTransport);
router.get("/:id", checkPermission("transport.read"), transportController.getTransportById);
router.post("/", checkPermission("transport.create"), transportController.createTransport);
router.put("/:id", checkPermission("transport.edit"), transportController.updateTransport);
router.delete("/:id", checkPermission("transport.delete"), transportController.deleteTransport);

module.exports = router;