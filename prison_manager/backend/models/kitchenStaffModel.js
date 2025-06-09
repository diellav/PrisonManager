const { pool, poolConnect, sql } = require("../database");

async function getAllKitchenStaff() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT ks.kitchen_staff_ID, ks.kitchen_role, ks.userID, u.first_name, u.last_name
    FROM kitchen_staff ks
    JOIN users u ON ks.userID = u.userID
  `);
  return result.recordset;
}

async function getKitchenStaffById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT ks.kitchen_staff_ID, ks.kitchen_role, ks.userID, u.first_name, u.last_name
      FROM kitchen_staff ks
      JOIN users u ON ks.userID = u.userID
      WHERE ks.kitchen_staff_ID = @id
    `);
  return result.recordset[0];
}

async function updateKitchenStaff(id, data) {
  await poolConnect;
  const { userID, kitchen_role } = data;

  await pool
    .request()
    .input("id", sql.Int, id)
    .input("userID", sql.Int, userID)
    .input("kitchen_role", sql.VarChar(255), kitchen_role)
    .query(`
      UPDATE kitchen_staff
      SET kitchen_role = @kitchen_role
      WHERE kitchen_staff_ID = @id
    `);
}



module.exports = {
  getAllKitchenStaff,
  getKitchenStaffById,
  updateKitchenStaff,
};
