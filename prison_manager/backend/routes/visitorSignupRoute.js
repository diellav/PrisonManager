const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const { verifyToken } = require('../authMiddleware');

router.post("/signup", visitorController.signUpVisitor);

router.post("/login", visitorController.loginVisitor);

router.get("/profile", verifyToken, visitorController.getVisitorProfile);
router.get("/", verifyToken,visitorController.getVisitors);
router.get("/:id", verifyToken,visitorController.getVisitor);
router.post("/", verifyToken,visitorController.addVisitor);
router.put("/:id", verifyToken,visitorController.updateVisitor);
router.delete("/:id", verifyToken,visitorController.deleteVisitor);

module.exports = router;
