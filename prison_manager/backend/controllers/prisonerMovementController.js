const prisonerMovementModel = require("../models/prisonerMovementModel");

const getPrisonerMovements = async (req, res) => {
  try {
    const movements = await prisonerMovementModel.getAllPrisonerMovements();
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getPrisonerMovement = async (req, res) => {
  try {
    const movementID = parseInt(req.params.id, 10);
    if (isNaN(movementID)) {
      return res.status(400).json({ error: "Invalid prisoner movement ID" });
    }

    const movement = await prisonerMovementModel.getPrisonerMovementById(movementID);
    if (!movement) return res.status(404).json({ error: "Prisoner movement not found" });

    res.json(movement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const addPrisonerMovement = async (req, res) => {
  try {
    const { prisonerID, from_cell_ID, to_cell_ID, date_ } = req.body;

    if (
      prisonerID == null ||
      from_cell_ID == null ||
      to_cell_ID == null ||
      !date_
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await prisonerMovementModel.createPrisonerMovement({
      prisonerID,
      from_cell_ID,
      to_cell_ID,
      date_,
    });

    res.status(201).json({
      message: "Prisoner movement recorded",
      prisoner_movement_ID: result.prisoner_movement_ID,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const updatePrisonerMovement = async (req, res) => {
  try {
    const movementID = parseInt(req.params.id, 10);
    if (isNaN(movementID)) {
      return res.status(400).json({ error: "Invalid prisoner movement ID" });
    }

    const updateData = { ...req.body };

    await prisonerMovementModel.updatePrisonerMovement(movementID, updateData);

    res.json({ message: "Prisoner movement updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deletePrisonerMovement = async (req, res) => {
  try {
    const movementID = parseInt(req.params.id, 10);
    if (isNaN(movementID)) {
      return res.status(400).json({ error: "Invalid prisoner movement ID" });
    }

    await prisonerMovementModel.deletePrisonerMovement(movementID);
    res.json({ message: "Prisoner movement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPrisonerMovements,
  getPrisonerMovement,
  addPrisonerMovement,
  updatePrisonerMovement,
  deletePrisonerMovement,
};
