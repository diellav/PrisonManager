const express = require("express");
const router = express.Router();
const lawyerController = require("../controllers/lawyerController");

router.get("/", lawyerController.getLawyers);
router.get("/:id", lawyerController.getLawyer);
router.post("/", lawyerController.addLawyer);
router.put("/:id", lawyerController.updateLawyer);
router.delete("/:id", lawyerController.deleteLawyer);

module.exports = router;
