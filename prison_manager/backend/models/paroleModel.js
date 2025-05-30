const { pool, poolConnect, sql } = require("../database");

async function getAllParoles() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT p.*, pr.first_name, pr.last_name
    FROM paroles p
    JOIN prisoners pr ON p.prisonerID = pr.prisonerID
  `);
  return result.recordset;
}

async function getParoleById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT p.*, pr.first_name, pr.last_name
      FROM paroles p
      JOIN prisoners pr ON p.prisonerID = pr.prisonerID
      WHERE p.parole_ID = @id
    `);
  return result.recordset[0];
}
async function createParole(parole) {
  const { prisonerID, request_date, decision_date, status_, conditions, notes } = parole;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("prisonerID", sql.Int, prisonerID)
      .input("request_date", sql.Date, request_date)
      .input("decision_date", sql.Date, decision_date)
      .input("status_", sql.VarChar(255), status_)
      .input("conditions", sql.VarChar(255), conditions)
      .input("notes", sql.Text, notes)
      .query(`
        INSERT INTO paroles (prisonerID, request_date, decision_date, status_, conditions, notes)
        OUTPUT INSERTED.parole_ID
        VALUES (@prisonerID, @request_date, @decision_date, @status_, @conditions, @notes)
      `);

    return { parole_ID: result.recordset[0].parole_ID };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function updateParole(id, parole) {
  const { prisonerID, request_date, decision_date, status_, conditions, notes } = parole;
  await poolConnect;

  try {
    await pool.request()
      .input("id", sql.Int, id)
      .input("prisonerID", sql.Int, prisonerID)
      .input("request_date", sql.Date, request_date)
      .input("decision_date", sql.Date, decision_date)
      .input("status_", sql.VarChar(255), status_)
      .input("conditions", sql.VarChar(255), conditions)
      .input("notes", sql.Text, notes)
      .query(`
        UPDATE paroles
        SET prisonerID = @prisonerID,
            request_date = @request_date,
            decision_date = @decision_date,
            status_ = @status_,
            conditions = @conditions,
            notes = @notes
        WHERE parole_ID = @id
      `);

    return { parole_ID: id };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}


async function deleteParole(id) {
  await poolConnect;

  const check = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT parole_ID FROM paroles WHERE parole_ID = @id`);

  if (check.recordset.length === 0) return null;

  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM paroles WHERE parole_ID = @id`);

  return { parole_ID: id };
}

module.exports = {
  getAllParoles,
  getParoleById,
  createParole,
  updateParole,
  deleteParole,
};
