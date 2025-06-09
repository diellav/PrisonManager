const medicalStaffModel = require("../models/medicalStaffModel");

const getMedicalStaff = async (req, res) => {
  try {
    const staff = await medicalStaffModel.getAllMedicalStaff();
    res.json(staff);
  } catch (err) {
    console.error("Error fetching medical staff:", err);
    res.status(500).send(err.message);
  }
};

const getOneMedicalStaff = async (req, res) => {
  try {
    const staff = await medicalStaffModel.getMedicalStaffById(req.params.id);
    if (!staff) return res.status(404).send("Medical staff not found");
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addMedicalStaff = async (req, res) => {
  try {
    const { userID, specialty } = req.body;
    await medicalStaffModel.createMedicalStaff({ userID, specialty });
    res.status(201).send("Medical staff created");
  } catch (err) {
    console.error("Error adding medical staff:", err);
    res.status(500).send(err.message);
  }
};

const updateMedicalStaff = async (req, res) => {
  try {
    const { userID, specialty } = req.body;
    await medicalStaffModel.updateMedicalStaff(req.params.id, { userID, specialty });
    res.send("Medical staff updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteMedicalStaff = async (req, res) => {
  try {
    await medicalStaffModel.deleteMedicalStaff(req.params.id);
    res.send("Medical staff deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMedicalStaff,
  getOneMedicalStaff,
  addMedicalStaff,
  updateMedicalStaff,
  deleteMedicalStaff
};
