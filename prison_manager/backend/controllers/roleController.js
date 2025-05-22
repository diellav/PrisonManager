const roleModel = require("../models/roleModel");

const getRoles = async (req, res) => {
  try {
    const roles = await roleModel.getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getRole = async (req, res) => {
  try {
    const role = await roleModel.getRoleById(req.params.id);
    if (!role) return res.status(404).send("Role not found");
    const permissions = await roleModel.getPermissionsByRoleId(req.params.id);
    role.permissionIDs = permissions.map(p => p.permissionID);
    res.json(role);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const addRole = async (req, res) => {
  try {
    const { name, description, permissionIDs } = req.body;
    const result = await roleModel.createRoleWithPermissions(name, description, permissionIDs);
    res.status(201).json({ message: "Role created", roleID: result.roleID });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, permissionIDs } = req.body;
    await roleModel.updateRole(req.params.id, name, description, permissionIDs);
    res.send("Role updated successfully");
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

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await roleModel.getAllPermissions();
    res.json(permissions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
  getRoles,
  getRole,
  addRole,
  updateRole,
  deleteRole,
  getAllPermissions,
};
