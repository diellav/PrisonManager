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

async function createRoleWithPermissions(name, description, permissionIDs = []) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    const result = await request
      .input("name", sql.VarChar(255), name)
      .input("description", sql.Text, description)
      .query("INSERT INTO roles (name_, description_) OUTPUT INSERTED.roleID VALUES (@name, @description)");

    const newRoleId = result.recordset[0].roleID;

    for (let permID of permissionIDs) {
      await new sql.Request(transaction)
        .input("roleID", sql.Int, newRoleId)
        .input("permissionID", sql.Int, permID)
        .query("INSERT INTO role_permissions (roleID, permissionID) VALUES (@roleID, @permissionID)");
    }

    await transaction.commit();
    return { roleID: newRoleId };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function updateRole(id, name, description, permissionIDs = []) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

 
    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .input("name", sql.VarChar(255), name)
      .input("description", sql.Text, description)
      .query(`
        UPDATE roles
        SET name_ = @name, description_ = @description
        WHERE roleID = @id
      `);

    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("DELETE FROM role_permissions WHERE roleID = @id");

   
    for (let permID of permissionIDs) {
      await new sql.Request(transaction)
        .input("roleID", sql.Int, id)
        .input("permissionID", sql.Int, permID)
        .query("INSERT INTO role_permissions (roleID, permissionID) VALUES (@roleID, @permissionID)");
    }

    await transaction.commit();
    return { message: "Role and permissions updated" };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}


async function deleteRole(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM roles WHERE roleID = @id");
  return result;
}

async function getAllPermissions() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM permissions");
  return result.recordset;
}
async function getPermissionsByRoleId(roleID) {
  await poolConnect;
  const result = await pool
    .request()
    .input("roleID", sql.Int, roleID)
    .query("SELECT permissionID FROM role_permissions WHERE roleID = @roleID");
  return result.recordset;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRoleWithPermissions,
  updateRole,
  deleteRole,
  getAllPermissions,
  getPermissionsByRoleId,
};
