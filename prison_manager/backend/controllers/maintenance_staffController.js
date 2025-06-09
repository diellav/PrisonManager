const maintenanceModel = require("../models/maintenance_staffModel");

const getMaintenanceStaff = async (req, res) => {
  try {
    const staff = await maintenanceModel.getAllMaintenanceStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneMaintenanceStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await maintenanceModel.getMaintenanceStaffById(id);
    if (!staff) return res.status(404).send("Maintenance staff not found");
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateMaintenanceStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const { userID, maintenance_role } = req.body;
    await maintenanceModel.updateMaintenanceStaff(id, { userID, maintenance_role });
    res.send("Maintenance staff updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports = {
  getMaintenanceStaff,
  getOneMaintenanceStaff,
  updateMaintenanceStaff,
};
