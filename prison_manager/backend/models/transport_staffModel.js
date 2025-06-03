const { pool, poolConnect, sql } = require("../database");

async function getAllTransportStaff() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT ts.transport_staff_ID, ts.transport_role, ts.userID, u.first_name, u.last_name
    FROM transport_staff ts
    JOIN users u ON ts.userID = u.userID
  `);
  return result.recordset;
}

async function getTransportStaffById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT ts.transport_staff_ID, ts.transport_role, ts.userID, u.first_name, u.last_name
      FROM transport_staff ts
      JOIN users u ON ts.userID = u.userID
      WHERE ts.transport_staff_ID = @id
    `);
  return result.recordset[0];
}


async function updateTransportStaff(id, data) {
  await poolConnect;
  const { userID, transport_role } = data;

  await pool
    .request()
    .input("id", sql.Int, id)
    .input("userID", sql.Int, userID)
    .input("transport_role", sql.VarChar(255), transport_role)
    .query(`
      UPDATE transport_staff
      SET transport_role = @transport_role
      WHERE transport_staff_ID = @id
    `);
}



module.exports = {
  getAllTransportStaff,
  getTransportStaffById,
  updateTransportStaff,
};
