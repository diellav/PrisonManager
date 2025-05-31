const userModel = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await userModel.getUserById(userID);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address_,
      email,
      username,
      password_,
      roleID,
       transport_role,
       kitchen_role
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const result = await userModel.createUser({
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address_,
      email,
      username,
      password_,
      photo,
      roleID,
       transport_role,
       kitchen_role,
    });

    res.status(201).json({ message: "User created", userID: result.userID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const updateUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address_,
      email,
      username,
      photo,
      roleID,
      transport_role,
      kitchen_role
    } = req.body;

    const updateData = {
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      address_,
      email,
      username,
      roleID,
      transport_role,
      kitchen_role,
    };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    await userModel.updateUser(userID, updateData);
    res.send("User updated successfully");
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

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userID;
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getProfile
};
