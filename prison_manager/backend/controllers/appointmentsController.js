const appointmentsModel = require("../models/appointmentsModel");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentsModel.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = await appointmentsModel.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

const createAppointment = async (req, res) => {
  try {
    const appointment = req.body;
    const result = await appointmentsModel.createAppointment(appointment);
    res.status(201).json({ message: "Appointment created", ...result });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = req.body;
    await appointmentsModel.updateAppointment(id, appointment);
    res.json({ message: "Appointment updated" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await appointmentsModel.deleteAppointment(id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
