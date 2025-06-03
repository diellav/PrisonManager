const guardModel = require("../models/guardStaffModel");

const getGuardStaff = async (req, res) => {
  try {
    const staff = await guardModel.getAllGuardStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneGuardStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await guardModel.getGuardStaffById(id);
    if (!staff) return res.status(404).send("Guard staff not found");
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateGuardStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const { userID, guard_position } = req.body;
    await guardModel.updateGuardStaff(id, { userID, guard_position });
    res.send("Guard staff updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports = {
  getGuardStaff,
  getOneGuardStaff,
  updateGuardStaff,
};
