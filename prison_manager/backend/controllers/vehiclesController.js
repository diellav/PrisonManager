const vehiclesModel = require("../models/vehiclesModel");

const getVehicles = async (req, res) => {
  try {
    const vehicles = await vehiclesModel.getAllVehicles();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
};

const getVehicle = async (req, res) => {
  try {
    const vehicle = await vehiclesModel.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
};

const createVehicle = async (req, res) => {
  try {
    const newVehicle = await vehiclesModel.createVehicle(req.body);
    res.status(201).json(newVehicle);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(500).json("duplicate key value violates unique constraint");
    }
    res.status(500).json({ error: "Failed to create vehicle" });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await vehiclesModel.updateVehicle(req.params.id, req.body);
    if (!updatedVehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(updatedVehicle);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(500).json("duplicate key value violates unique constraint");
    }
    res.status(500).json({ error: "Failed to update vehicle" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    await vehiclesModel.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
};

module.exports = {
  getAllVehicles: getVehicles,
  getVehicleById: getVehicle,
  addVehicle: createVehicle,
  updateVehicle,
  deleteVehicle
};
