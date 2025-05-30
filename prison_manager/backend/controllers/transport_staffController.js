const transportModel = require("../models/transport_staffModel");

const getTransportStaff = async (req, res) => {
  try {
    const staff = await transportModel.getAllTransportStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneTransportStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await transportModel.getTransportStaffById(id);
    if (!staff) return res.status(404).send("Transport staff not found");
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const updateTransportStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const { userID, transport_role } = req.body;
    await transportModel.updateTransportStaff(id, { userID, transport_role });
    res.send("Transport staff updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteTransportStaff = async (req, res) => {
  try {
    await transportModel.deleteTransportStaff(req.params.id);
    res.send("Transport staff deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getTransportStaff,
  getOneTransportStaff,
  updateTransportStaff,
  deleteTransportStaff,
};
