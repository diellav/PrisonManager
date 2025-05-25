// routes/judgeRoute.js
const express = require("express");
const router = express.Router();
const judgeController = require("../controllers/judgeController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require('../authMiddleware');

router.get("/", checkPermission("judges.read"), judgeController.getJudges);
router.get("/:id", checkPermission("judges.read"), judgeController.getJudge);
router.post("/", checkPermission("judges.create"), judgeController.addJudge);
router.put("/:id", checkPermission("judges.edit"), judgeController.updateJudge);
router.delete("/:id", checkPermission("judges.delete"), judgeController.deleteJudge);

module.exports = router;
