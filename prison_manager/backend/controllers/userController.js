const userModel = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    console.log("Users retrieved from database:", users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send(err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addUser = async (req, res) => {
  try {
    const newUser = req.body;
    await userModel.createUser(newUser);
    res.status(201).send("User created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = req.body;
    await userModel.updateUser(req.params.id, updatedUser);
    res.send("User updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.send("User deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
};
