const express = require("express");
const router = express.Router();
const staffScheduleController = require("../controllers/scheduleController");
const checkPermission = require("../checkPermission");
const { verifyToken } = require('../authMiddleware');

router.get("/users/:userID", verifyToken, staffScheduleController.getSchedulesByUserID);
router.get("/", checkPermission("staff_schedule.read"), staffScheduleController.getAllSchedules);
router.get("/:id", checkPermission("staff_schedule.read"), staffScheduleController.getSchedule);
router.post("/", checkPermission("staff_schedule.create"), staffScheduleController.addSchedule);
router.put("/:id", checkPermission("staff_schedule.edit"), staffScheduleController.updateSchedule);
router.delete("/:id", checkPermission("staff_schedule.delete"), staffScheduleController.deleteSchedule);

module.exports = router;
