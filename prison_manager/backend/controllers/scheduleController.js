const staffScheduleModel = require("../models/scheduleModel");

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await staffScheduleModel.getAllSchedules();
    res.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).send(err.message);
  }
};

const getSchedule = async (req, res) => {
  try {
    const schedule = await staffScheduleModel.getScheduleById(req.params.id);
    if (!schedule) return res.status(404).send("Schedule not found");
    res.json(schedule);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getSchedulesByUserID = async (req, res) => {
  try {
    const { userID } = req.params;
    const requestingUserID = req.user.userID;

    if (parseInt(userID) === requestingUserID) {
      const schedules = await staffScheduleModel.getSchedulesByUserID(userID);
      return res.json(schedules);
    }

    if (!req.user.permissions.includes('staff_schedule.read')) {
      return res.status(403).json({ message: "You don't have permission to view others' schedules." });
    }
    const schedules = await staffScheduleModel.getSchedulesByUserID(userID);
    res.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules by user ID:", err);
    res.status(500).send(err.message);
  }
};


const addSchedule = async (req, res) => {
  try {
    const { userID, shift_type, shift_start, shift_end, date_, repeatWeekly, repeatWeeks } = req.body;

    if (repeatWeekly && repeatWeeks > 0) {
      await staffScheduleModel.createScheduleRepeat(userID, shift_type, shift_start, shift_end, date_, repeatWeeks);
      res.status(201).send("Repeated schedules created successfully.");
    } else {
      await staffScheduleModel.createSchedule(userID, shift_type, shift_start, shift_end, date_);
      res.status(201).send("Schedule created.");
    }
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).send(err.message);
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { userID, shift_type, shift_start, shift_end, date_, repeatWeekly, repeatWeeks } = req.body;

    if (repeatWeekly && repeatWeeks > 0) {
      await staffScheduleModel.deleteSchedule(req.params.id);
      await staffScheduleModel.createScheduleRepeat(userID, shift_type, shift_start, shift_end, date_, repeatWeeks);
      res.send("Schedule updated with repeated weeks.");
    } else {
      await staffScheduleModel.updateSchedule(req.params.id, userID, shift_type, shift_start, shift_end, date_);
      res.send("Schedule updated.");
    }
  } catch (err) {
    console.error("Error updating schedule:", err);
    res.status(500).send(err.message);
  }
};
const deleteSchedule = async (req, res) => {
  try {
    await staffScheduleModel.deleteSchedule(req.params.id);
    res.send("Schedule deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
  getAllSchedules,
  getSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByUserID,
};
