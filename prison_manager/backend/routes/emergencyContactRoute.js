const express = require("express");
const router = express.Router();
const emergencyContactController = require("../controllers/emergencyContactController");

router.get("/", emergencyContactController.getEmergencyContacts);
router.get("/:id", emergencyContactController.getEmergencyContact);
router.post("/", emergencyContactController.addEmergencyContact);
router.put("/:id", emergencyContactController.updateEmergencyContact);
router.delete("/:id", emergencyContactController.deleteEmergencyContact);

module.exports = router;
