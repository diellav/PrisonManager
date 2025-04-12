const { pool, poolConnect, sql } = require("../database");

async function getAllRoles() {
  await poolConnect; 
  const result = await pool.request().query("SELECT * FROM roles");
  return result.recordset;
}

async function getRoleById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM roles WHERE roleID = @id");
  return result.recordset[0];
}

async function createRole(name, description) {
  await poolConnect;
  const result = await pool
    .request()
    .input("name", sql.VarChar(255), name)
    .input("description", sql.Text, description)
    .query("INSERT INTO roles (name_, description_) VALUES (@name, @description)");
  return result;
}

async function updateRole(id, name, description) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.VarChar(255), name)
    .input("description", sql.Text, description)
    .query("UPDATE roles SET name_ = @name, description_ = @description WHERE roleID = @id");
  return result;
}

async function deleteRole(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM roles WHERE roleID = @id");
  return result;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
