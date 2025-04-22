const lawyerModel = require("../models/lawyerModel");

const getLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.getAllLawyers();
    res.json(lawyers);
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    res.status(500).send(err.message);
  }
};

const getLawyer = async (req, res) => {
  try {
    const lawyer = await lawyerModel.getLawyerById(req.params.id);
    if (!lawyer) return res.status(404).send("Lawyer not found");
    res.json(lawyer);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addLawyer = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, category } = req.body;
    await lawyerModel.createLawyer(first_name, last_name, phone, email, category);
    res.status(201).send("Lawyer created");
  } catch (err) {
    console.error("Error adding lawyer:", err);
    res.status(500).send(err.message);
  }
};

const updateLawyer = async (req, res) => {
  try {
    const { first_name, last_name, phone, email, category } = req.body;
    await lawyerModel.updateLawyer(req.params.id, first_name, last_name, phone, email, category);
    res.send("Lawyer updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteLawyer = async (req, res) => {
  try {
    await lawyerModel.deleteLawyer(req.params.id);
    res.send("Lawyer deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getLawyers,
  getLawyer,
  addLawyer,
  updateLawyer,
  deleteLawyer
};
