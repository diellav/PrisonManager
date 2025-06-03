const { pool, poolConnect, sql } = require("../database");

async function getAllGuardStaff() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT g.guard_staff_ID, g.guard_position, g.userID, u.first_name, u.last_name
    FROM guard_staff g
    JOIN users u ON g.userID = u.userID
  `);
  return result.recordset;
}

async function getGuardStaffById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT g.guard_staff_ID, g.guard_position, g.userID, u.first_name, u.last_name
      FROM guard_staff g
      JOIN users u ON g.userID = u.userID
      WHERE g.guard_staff_ID = @id
    `);
  return result.recordset[0];
}

async function updateGuardStaff(id, data) {
  await poolConnect;
  const { userID, guard_position } = data;

  await pool
    .request()
    .input("id", sql.Int, id)
    .input("userID", sql.Int, userID)
    .input("guard_position", sql.VarChar(255), guard_position)
    .query(`
      UPDATE guard_staff
      SET guard_position = @guard_position
      WHERE guard_staff_ID = @id
    `);
}



module.exports = {
  getAllGuardStaff,
  getGuardStaffById,
  updateGuardStaff,
};
