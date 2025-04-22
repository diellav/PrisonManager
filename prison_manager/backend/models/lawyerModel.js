const { pool, poolConnect, sql } = require("../database");

async function getAllLawyers() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM lawyers");
  return result.recordset;
}

async function getLawyerById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM lawyers WHERE lawyer_ID = @id");
  return result.recordset[0];
}

async function createLawyer(first_name, last_name, phone, email, category) {
  await poolConnect;
  const result = await pool
    .request()
    .input("first_name", sql.VarChar(100), first_name)
    .input("last_name", sql.VarChar(100), last_name)
    .input("phone", sql.VarChar(20), phone)
    .input("email", sql.VarChar(255), email)
    .input("category", sql.VarChar(255), category)
    .query(`
      INSERT INTO lawyers (first_name, last_name, phone, email, category)
      VALUES (@first_name, @last_name, @phone, @email, @category)
    `);
  return result;
}

async function updateLawyer(id, first_name, last_name, phone, email, category) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("first_name", sql.VarChar(100), first_name)
    .input("last_name", sql.VarChar(100), last_name)
    .input("phone", sql.VarChar(20), phone)
    .input("email", sql.VarChar(255), email)
    .input("category", sql.VarChar(255), category)
    .query(`
      UPDATE lawyers
      SET first_name = @first_name, last_name = @last_name,
          phone = @phone, email = @email, category = @category
      WHERE lawyer_ID = @id
    `);
  return result;
}

async function deleteLawyer(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM lawyers WHERE lawyer_ID = @id");
  return result;
}

module.exports = {
  getAllLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deleteLawyer,
};
