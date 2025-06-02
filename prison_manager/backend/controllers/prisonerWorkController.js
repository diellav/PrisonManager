const prisonerWorkModel = require("../models/prisonerWorkModel");

const getAllPrisonerWorks = async (req, res) => {
  try {
    const works = await prisonerWorkModel.getAllPrisonerWorks();
    res.json(works);
  } catch (err) {
    console.error("Error in getAllPrisonerWorks:", err);
    res.status(500).send(err.message);
  }
};

const getPrisonerWorkById = async (req, res) => {
  try {
    const work = await prisonerWorkModel.getPrisonerWorkById(req.params.id);
    if (!work) return res.status(404).send("Prisoner work not found");
    res.json(work);
  } catch (err) {
    console.error("Error in getPrisonerWorkById:", err);
    res.status(500).send(err.message);
  }
};

const addPrisonerWork = async (req, res) => {
  try {
    const newWork = req.body;
    const result = await prisonerWorkModel.createPrisonerWork(newWork);
    res.status(201).json({ message: "Prisoner work created", id: result.prisoner_work_ID });
  } catch (err) {
    console.error("Error in addPrisonerWork:", err);
    res.status(500).send(err.message);
  }
};

const updatePrisonerWork = async (req, res) => {
  try {
    const updatedWork = req.body;
    await prisonerWorkModel.updatePrisonerWork(req.params.id, updatedWork);
    res.json({ message: "Prisoner work updated" });
  } catch (err) {
    console.error("Error in updatePrisonerWork:", err);
    res.status(500).send(err.message);
  }
};

const deletePrisonerWork = async (req, res) => {
  try {
    await prisonerWorkModel.deletePrisonerWork(req.params.id);
    res.json({ message: "Prisoner work deleted" });
  } catch (err) {
    console.error("Error in deletePrisonerWork:", err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllPrisonerWorks,
  getPrisonerWorkById,
  addPrisonerWork,
  updatePrisonerWork,
  deletePrisonerWork
};
