const staffModel = require("../models/staffSalaryModel");

const getAllSalaries = async (req, res) => {
  try {
    const salaries = await staffModel.getAllStaffSalaries();
    res.json(salaries);
  } catch (err) {
    console.error("Error getting salaries:", err);
    res.status(500).json({ error: "Failed to fetch salaries" });
  }
};

const getSalaryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const salary = await staffModel.getStaffSalaryById(id);

    if (!salary) return res.status(404).json({ error: "Salary not found" });

    res.json(salary);
  } catch (err) {
    console.error("Error getting salary:", err);
    res.status(500).json({ error: "Failed to fetch salary" });
  }
};

const addSalary = async (req, res) => {
  try {
    const salaryData = req.body;
    const result = await staffModel.createStaffSalaryUsingSP(salaryData);
    res.status(201).json({ message: "Salary created", id: result.salary_ID });
  } catch (err) {
    console.error("Error adding salary:", err);
    if (err.message.includes("Insufficient funds")) {
      return res.status(400).json({ error: "Not enough funds in the selected budget." });
    }
    res.status(400).json({ error: err.message });
  }
};
const updateSalary = async (req, res) => {
  try {
    const id = req.params.id;
    const salaryData = req.body;
    const updated = await staffModel.updateStaffSalaryUsingSP(id, salaryData);

    if (!updated) return res.status(404).send("Salary not found");
    res.json({ message: "Salary updated", id: id });
  } catch (err) {
    console.error("Error in updateSalary:", err);

    if (err.message.includes("Insufficient")) {
      return res.status(400).json({ error: err.message });
    }

    res.status(400).json({ error: err.message });
  }
};


const deleteSalary = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await staffModel.deleteStaffSalary(id);
    res.json({ message: "Salary deleted" });
  } catch (err) {
    console.error("Error deleting salary:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllSalaries,
  getSalaryById,
  addSalary,
  updateSalary,
  deleteSalary,
};