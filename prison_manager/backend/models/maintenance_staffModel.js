const { pool, poolConnect, sql } = require("../database");

async function getAllMaintenanceStaff() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT ms.maintenance_staff_ID, ms.maintenance_role, ms.userID, u.first_name, u.last_name
    FROM maintenance_staff ms
    JOIN users u ON ms.userID = u.userID
  `);
  return result.recordset;
}

async function getMaintenanceStaffById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT ms.maintenance_staff_ID, ms.maintenance_role, ms.userID, u.first_name, u.last_name
      FROM maintenance_staff ms
      JOIN users u ON ms.userID = u.userID
      WHERE ms.maintenance_staff_ID = @id
    `);
  return result.recordset[0];
}

async function updateMaintenanceStaff(id, data) {
  await poolConnect;
  const { userID, maintenance_role } = data;

  await pool
    .request()
    .input("id", sql.Int, id)
    .input("userID", sql.Int, userID)
    .input("maintenance_role", sql.VarChar(255), maintenance_role)
    .query(`
      UPDATE maintenance_staff
      SET maintenance_role = @maintenance_role
      WHERE maintenance_staff_ID = @id
    `);
}



module.exports = {
  getAllMaintenanceStaff,
  getMaintenanceStaffById,
  updateMaintenanceStaff,
};
