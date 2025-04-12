const roleModel = require("../models/roleModel");

const getRoles = async (req, res) => {
    try {
      const roles = await roleModel.getAllRoles();
      console.log("Roles retrieved from database:", roles);
      res.json(roles);
    } catch (err) {
      console.error("Error fetching roles:", err); 
      res.status(500).send(err.message);
    }
  };

const getRole = async (req, res) => {
  try {
    const role = await roleModel.getRoleById(req.params.id);
    if (!role) return res.status(404).send("Role not found");
    res.json(role);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const addRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    await roleModel.createRole(name, description);
    res.status(201).send("Role created");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    await roleModel.updateRole(req.params.id, name, description);
    res.send("Role updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteRole = async (req, res) => {
  try {
    await roleModel.deleteRole(req.params.id);
    res.send("Role deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getRoles,
  getRole,
  addRole,
  updateRole,
  deleteRole
};
