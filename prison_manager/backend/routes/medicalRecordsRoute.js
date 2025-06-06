const express = require("express");
const router = express.Router();
const medicalRecordsController = require("../controllers/medicalRecordsController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("medical_records.read"), medicalRecordsController.getAllMedicalRecords);
router.get("/:id", checkPermission("medical_records.read"), medicalRecordsController.getMedicalRecordById);
router.post("/", checkPermission("medical_records.create"), medicalRecordsController.createMedicalRecord);
router.put("/:id", checkPermission("medical_records.edit"), medicalRecordsController.updateMedicalRecord);
router.delete("/:id", checkPermission("medical_records.delete"), medicalRecordsController.deleteMedicalRecord);

module.exports = router;
