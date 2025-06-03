const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const { verifyToken } = require('../authMiddleware');

router.get("/", verifyToken,visitorController.getVisitors);
router.get("/:id", verifyToken,visitorController.getVisitor);
router.post("/", verifyToken,visitorController.addVisitor);
router.put("/:id", verifyToken,visitorController.updateVisitor);
router.delete("/:id", verifyToken,visitorController.deleteVisitor);


router.post("/signup", visitorController.signUpVisitor);

router.post("/login", visitorController.loginVisitor);

module.exports = router;
