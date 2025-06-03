const express = require("express");
const router = express.Router();
const medicalStaffController = require("../controllers/medicalStaffController");
const { verifyToken } = require('../authMiddleware');
const checkPermission = require("../checkPermission");


router.get("/", verifyToken, checkPermission("medical_staff.read"), medicalStaffController.getMedicalStaff);
router.get("/:id", verifyToken, checkPermission("medical_staff.read"), medicalStaffController.getOneMedicalStaff);
router.post("/", verifyToken, checkPermission("medical_staff.create"), medicalStaffController.addMedicalStaff);
router.put("/:id", verifyToken, checkPermission("medical_staff.edit"), medicalStaffController.updateMedicalStaff);
router.delete("/:id", verifyToken, checkPermission("medical_staff.delete"), medicalStaffController.deleteMedicalStaff);

module.exports = router;
