const kitchenModel = require("../models/kitchenStaffModel");

const getKitchenStaff = async (req, res) => {
  try {
    const staff = await kitchenModel.getAllKitchenStaff();
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getOneKitchenStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const staff = await kitchenModel.getKitchenStaffById(id);
    if (!staff) return res.status(404).send("Kitchen staff not found");
    res.json(staff);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateKitchenStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const { userID, kitchen_role } = req.body;
    await kitchenModel.updateKitchenStaff(id, { userID, kitchen_role });
    res.send("Kitchen staff updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteKitchenStaff = async (req, res) => {
  try {
    await kitchenModel.deleteKitchenStaff(req.params.id);
    res.send("Kitchen staff deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getKitchenStaff,
  getOneKitchenStaff,
  updateKitchenStaff,
  deleteKitchenStaff,
};
