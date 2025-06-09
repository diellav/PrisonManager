const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const checkPermission = require("../checkPermission");


router.get("/", checkPermission("appointments.read"), appointmentsController.getAllAppointments);
router.get("/:id", checkPermission("appointments.read"), appointmentsController.getAppointmentById);
router.post("/", checkPermission("appointments.create"), appointmentsController.createAppointment);
router.put("/:id", checkPermission("appointments.edit"), appointmentsController.updateAppointment);
router.delete("/:id", checkPermission("appointments.delete"), appointmentsController.deleteAppointment);
module.exports = router;
