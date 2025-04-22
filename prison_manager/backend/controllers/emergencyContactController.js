const emergencyContactModel = require("../models/emergencyContactModel");

const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await emergencyContactModel.getAllContacts();
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching emergency contacts:", err);
    res.status(500).send(err.message);
  }
};

const getEmergencyContact = async (req, res) => {
  try {
    const contact = await emergencyContactModel.getContactById(req.params.id);
    if (!contact) return res.status(404).send("Emergency contact not found");
    res.json(contact);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addEmergencyContact = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, address_, email } = req.body;
    await emergencyContactModel.createContact(first_name, last_name, date_of_birth, gender, phone, address_, email);
    res.status(201).send("Emergency contact created");
  } catch (err) {
    console.error("Error adding emergency contact:", err);
    res.status(500).send(err.message);
  }
};


const updateEmergencyContact = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, phone, address_, email } = req.body;
    await emergencyContactModel.updateContact(req.params.id, first_name, last_name, date_of_birth, gender, phone, address_, email);
    res.send("Emergency contact updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const deleteEmergencyContact = async (req, res) => {
  try {
    await emergencyContactModel.deleteContact(req.params.id);
    res.send("Emergency contact deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getEmergencyContacts,
  getEmergencyContact,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
};
