const { pool, poolConnect, sql } = require("../database");

async function getAllCases() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT c.*, p.first_name AS prisoner_first_name, p.last_name AS prisoner_last_name,
           l.first_name AS lawyer_first_name, l.last_name AS lawyer_last_name
    FROM cases c
    JOIN prisoners p ON c.prisonerID = p.prisonerID
    JOIN lawyers l ON c.lawyer_ID = l.lawyer_ID
  `);
  return result.recordset;
}

async function getCaseById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT c.*, p.first_name AS prisoner_first_name, p.last_name AS prisoner_last_name,
             l.first_name AS lawyer_first_name, l.last_name AS lawyer_last_name
      FROM cases c
      JOIN prisoners p ON c.prisonerID = p.prisonerID
      JOIN lawyers l ON c.lawyer_ID = l.lawyer_ID
      WHERE c.case_ID = @id
    `);
  return result.recordset[0];
}

async function createCase(caseData) {
  const { description_, status_, prisonerID, lawyer_ID } = caseData;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("description_", sql.Text, description_)
      .input("status_", sql.VarChar(255), status_)
      .input("prisonerID", sql.Int, prisonerID)
      .input("lawyer_ID", sql.Int, lawyer_ID)
      .query(`
        INSERT INTO cases (description_, status_, prisonerID, lawyer_ID)
        OUTPUT INSERTED.case_ID
        VALUES (@description_, @status_, @prisonerID, @lawyer_ID)
      `);

    return { case_ID: result.recordset[0].case_ID };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function updateCase(id, caseData) {
  const { description_, status_, prisonerID, lawyer_ID } = caseData;
  await poolConnect;

  try {
    await pool.request()
      .input("id", sql.Int, id)
      .input("description_", sql.Text, description_)
      .input("status_", sql.VarChar(255), status_)
      .input("prisonerID", sql.Int, prisonerID)
      .input("lawyer_ID", sql.Int, lawyer_ID)
      .query(`
        UPDATE cases
        SET description_ = @description_,
            status_ = @status_,
            prisonerID = @prisonerID,
            lawyer_ID = @lawyer_ID
        WHERE case_ID = @id
      `);

    return { case_ID: id };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function deleteCase(id) {
  await poolConnect;

  const check = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT case_ID FROM cases WHERE case_ID = @id`);

  if (check.recordset.length === 0) return null;

  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM cases WHERE case_ID = @id`);

  return { case_ID: id };
}

module.exports = {
  getAllCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
};
