const express = require("express");
const router = express.Router();
const lawyerController = require("../controllers/lawyerController");
const checkPermission = require("../checkPermission");

router.get("/", checkPermission("lawyers.read"), lawyerController.getLawyers);
router.get("/:id", checkPermission("lawyers.read"), lawyerController.getLawyer);
router.post("/", checkPermission("lawyers.create"), lawyerController.addLawyer);
router.put("/:id", checkPermission("lawyers.edit"), lawyerController.updateLawyer);
router.delete("/:id", checkPermission("lawyers.delete"), lawyerController.deleteLawyer);

module.exports = router;
