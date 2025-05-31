const { pool, poolConnect, sql } = require("../database");

async function getAllPrisonerCalls() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT pc.*, p.first_name AS prisoner_first_name, p.last_name AS prisoner_last_name
    FROM prisoner_calls pc
    JOIN prisoners p ON pc.prisonerID = p.prisonerID
  `);
  return result.recordset;
}

async function getPrisonerCallById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT pc.*, p.first_name AS prisoner_first_name, p.last_name AS prisoner_last_name
      FROM prisoner_calls pc
      JOIN prisoners p ON pc.prisonerID = p.prisonerID
      WHERE pc.prisoner_call_ID = @id
    `);
  return result.recordset[0];
}

async function createPrisonerCall(callData) {
  const { call_date, duration, prisonerID } = callData;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("call_date", sql.Date, call_date || new Date())
      .input("duration", sql.VarChar(64), duration)
      .input("prisonerID", sql.Int, prisonerID)
      .query(`
        INSERT INTO prisoner_calls (call_date, duration, prisonerID)
        OUTPUT INSERTED.prisoner_call_ID
        VALUES (@call_date, @duration, @prisonerID)
      `);

    return { prisoner_call_ID: result.recordset[0].prisoner_call_ID };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function updatePrisonerCall(id, callData) {
  const { call_date, duration, prisonerID } = callData;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("call_date", sql.Date, call_date)
      .input("duration", sql.VarChar(64), duration)
      .input("prisonerID", sql.Int, prisonerID)
      .query(`
        UPDATE prisoner_calls
        SET call_date = @call_date,
            duration = @duration,
            prisonerID = @prisonerID
        WHERE prisoner_call_ID = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return null;
    }

    return { prisoner_call_ID: id };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function deletePrisonerCall(id) {
  await poolConnect;

  const check = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT prisoner_call_ID FROM prisoner_calls WHERE prisoner_call_ID = @id`);

  if (check.recordset.length === 0) return null;

  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM prisoner_calls WHERE prisoner_call_ID = @id`);

  return { prisoner_call_ID: id };
}

module.exports = {
  getAllPrisonerCalls,
  getPrisonerCallById,
  createPrisonerCall,
  updatePrisonerCall,
  deletePrisonerCall,
};




