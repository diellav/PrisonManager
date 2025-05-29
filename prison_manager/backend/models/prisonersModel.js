const { pool, poolConnect, sql } = require("../database");

async function getAllPrisoners() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM prisoners");
  return result.recordset;
}

async function getPrisonerById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM prisoners WHERE prisonerID = @id");
  return result.recordset[0];
}

async function createPrisoner(data) {
  await poolConnect;
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    national_id,
    address_,
    photo,
    sentence_start,
    sentence_end,
    status_,
    rank_,
    cell_block_ID,
    emergency_contact_ID
  } = data;

  const result = await pool
    .request()
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("national_id", sql.VarChar(255), national_id)
    .input("address_", sql.VarChar(255), address_)
    .input("photo", sql.VarChar(255), photo)
    .input("sentence_start", sql.Date, sentence_start)
    .input("sentence_end", sql.Date, sentence_end)
    .input("status_", sql.VarChar(255), status_)
    .input("rank_", sql.VarChar(255), rank_)
    .input("cell_block_ID", sql.Int, cell_block_ID || null)
    .input("emergency_contact_ID", sql.Int, emergency_contact_ID)
    .query(`
      INSERT INTO prisoners (
        first_name, last_name, date_of_birth, gender, national_id, address_,
        photo, sentence_start, sentence_end, status_, rank_, cell_block_ID, emergency_contact_ID
      )
      OUTPUT INSERTED.prisonerID
      VALUES (
        @first_name, @last_name, @date_of_birth, @gender, @national_id, @address_,
        @photo, @sentence_start, @sentence_end, @status_, @rank_, @cell_block_ID, @emergency_contact_ID
      )
    `);

  return result.recordset[0];
}

async function updatePrisoner(id, data) {
  await poolConnect;

  const request = pool.request().input("id", sql.Int, id);

  const updates = [];
  for (let key in data) {
    let value = data[key];
    let type = sql.VarChar(255);
    if (key === "date_of_birth" || key === "sentence_start" || key === "sentence_end") type = sql.Date;
    if (key === "cell_block_ID" || key === "emergency_contact_ID") type = sql.Int;

    request.input(key, type, value);
    updates.push(`${key} = @${key}`);
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }

  const query = `UPDATE prisoners SET ${updates.join(", ")} WHERE prisonerID = @id`;
  await request.query(query);
}

async function deletePrisoner(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM prisoners WHERE prisonerID = @id");
  return result;
}

module.exports = {
  getAllPrisoners,
  getPrisonerById,
  createPrisoner,
  updatePrisoner,
  deletePrisoner,
};
