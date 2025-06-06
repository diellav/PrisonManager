const medicalRecordsModel = require("../models/medicalRecordsModel");

const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordsModel.getAllMedicalRecords();
    res.json(records);
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
};

const getMedicalRecordById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const record = await medicalRecordsModel.getMedicalRecordById(id);
    if (!record) {
      return res.status(404).json({ error: "Medical record not found" });
    }
    res.json(record);
  } catch (err) {
    console.error("Error fetching medical record:", err);
    res.status(500).json({ error: "Failed to fetch medical record" });
  }
};


const createMedicalRecord = async (req, res) => {
  try {
    const record = req.body;
    const result = await medicalRecordsModel.createMedicalRecord(record);
    res.status(201).json({ message: "Medical record created", ...result });
  } catch (err) {
    console.error("Error creating medical record:", err);
    res.status(500).json({ error: "Failed to create medical record" });
  }
};

const updateMedicalRecord = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const record = req.body;
    await medicalRecordsModel.updateMedicalRecord(id, record);
    res.json({ message: "Medical record updated" });
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ error: "Failed to update medical record" });
  }
};
const deleteMedicalRecord = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await medicalRecordsModel.deleteMedicalRecord(id);
    res.json({ message: "Medical record deleted" });
  } catch (err) {
    console.error("Error deleting medical record:", err);
    res.status(500).json({ error: "Failed to delete medical record" });
  }
};

module.exports = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
