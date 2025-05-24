const express = require("express");
const router = express.Router();
const emergencyContactController = require("../controllers/emergencyContactController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("emergency_contact.read"), emergencyContactController.getEmergencyContacts);
router.get("/:id", checkPermission("emergency_contact.read"), emergencyContactController.getEmergencyContact);
router.post("/", checkPermission("emergency_contact.create"), emergencyContactController.addEmergencyContact);
router.put("/:id", checkPermission("emergency_contact.edit"), emergencyContactController.updateEmergencyContact);
router.delete("/:id", checkPermission("emergency_contact.delete"), emergencyContactController.deleteEmergencyContact);

module.exports = router;
