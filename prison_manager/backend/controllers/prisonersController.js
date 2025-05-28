const prisonerModel = require("../models/prisonersModel");

const getPrisoners = async (req, res) => {
  try {
    const prisoners = await prisonerModel.getAllPrisoners();
    res.json(prisoners);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPrisoner = async (req, res) => {
  try {
    const prisonerID = req.params.id;
    const prisoner = await prisonerModel.getPrisonerById(prisonerID);
    if (!prisoner) return res.status(404).send("Prisoner not found");
    res.json(prisoner);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addPrisoner = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      national_id,
      address_,
      photo,
      sentence_start,
      sentence_end,
      status_,
      rank_,
      cell_block_ID,
      emergency_contact_ID
    } = req.body;

    const result = await prisonerModel.createPrisoner({
      first_name,
      last_name,
      date_of_birth,
      gender,
      national_id,
      address_,
      photo,
      sentence_start,
      sentence_end,
      status_,
      rank_,
      cell_block_ID,
      emergency_contact_ID
    });

    res.status(201).json({ message: "Prisoner created", prisonerID: result.prisonerID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePrisoner = async (req, res) => {
  try {
    const prisonerID = req.params.id;
    const updateData = req.body;
    await prisonerModel.updatePrisoner(prisonerID, updateData);
    res.send("Prisoner updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePrisoner = async (req, res) => {
  try {
    await prisonerModel.deletePrisoner(req.params.id);
    res.send("Prisoner deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getPrisoners,
  getPrisoner,
  addPrisoner,
  updatePrisoner,
  deletePrisoner,
};
