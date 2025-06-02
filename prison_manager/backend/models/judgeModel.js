const { pool, poolConnect, sql } = require("../database");

async function getAllJudges() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM judges");
  return result.recordset;
}

async function getJudgeById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM judges WHERE judge_ID = @id");
  return result.recordset[0];
}

async function createJudge(data) {
  const { first_name, last_name, date_of_birth, phone, email, rank_ } = data;
  await poolConnect;
  const result = await pool
    .request()
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("phone", sql.VarChar(255), phone)
    .input("email", sql.VarChar(255), email)
    .input("rank_", sql.VarChar(255), rank_)
    .query(
      `INSERT INTO judges (first_name, last_name, date_of_birth, phone, email, rank_)
       OUTPUT INSERTED.judge_ID
       VALUES (@first_name, @last_name, @date_of_birth, @phone, @email, @rank_)`
    );
  return { judge_ID: result.recordset[0].judge_ID };
}

async function updateJudge(id, data) {
  const { first_name, last_name, date_of_birth, phone, email, rank_ } = data;
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("phone", sql.VarChar(255), phone)
    .input("email", sql.VarChar(255), email)
    .input("rank_", sql.VarChar(255), rank_)
    .query(
      `UPDATE judges
       SET first_name = @first_name,
           last_name = @last_name,
           date_of_birth = @date_of_birth,
           phone = @phone,
           email = @email,
           rank_ = @rank_
       WHERE judge_ID = @id`
    );
  return result.rowsAffected;
}

async function deleteJudge(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM judges WHERE judge_ID = @id");
  return result.rowsAffected;
}

module.exports = {
  getAllJudges,
  getJudgeById,
  createJudge,
  updateJudge,
  deleteJudge,
};
