const { pool, poolConnect, sql } = require("../database");

async function getAllHearings() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT ch.*, 
           j.first_name AS judge_first_name, j.last_name AS judge_last_name,
           c.description_ AS case_description, c.status_ AS case_status
    FROM court_hearings ch
    JOIN judges j ON ch.judge_ID = j.judge_ID
    JOIN cases c ON ch.case_ID = c.case_ID
  `);
  return result.recordset;
}

async function getHearingById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT ch.*, 
             j.first_name AS judge_first_name, j.last_name AS judge_last_name,
             c.description_ AS case_description, c.status_ AS case_status
      FROM court_hearings ch
      JOIN judges j ON ch.judge_ID = j.judge_ID
      JOIN cases c ON ch.case_ID = c.case_ID
      WHERE ch.court_hearingID = @id
    `);
  return result.recordset[0];
}

async function createHearing(hearingData) {
  const { date_, court_name, verdict, judge_ID, case_ID } = hearingData;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("date_", sql.Date, date_)
      .input("court_name", sql.VarChar(255), court_name)
      .input("verdict", sql.VarChar(255), verdict)
      .input("judge_ID", sql.Int, judge_ID)
      .input("case_ID", sql.Int, case_ID)
      .query(`
        INSERT INTO court_hearings (date_, court_name, verdict, judge_ID, case_ID)
        OUTPUT INSERTED.court_hearingID
        VALUES (@date_, @court_name, @verdict, @judge_ID, @case_ID)
      `);

    return { court_hearingID: result.recordset[0].court_hearingID };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function updateHearing(id, hearingData) {
  const { date_, court_name, verdict, judge_ID, case_ID } = hearingData;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("date_", sql.Date, date_)
      .input("court_name", sql.VarChar(255), court_name)
      .input("verdict", sql.VarChar(255), verdict)
      .input("judge_ID", sql.Int, judge_ID)
      .input("case_ID", sql.Int, case_ID)
      .query(`
        UPDATE court_hearings
        SET date_ = @date_,
            court_name = @court_name,
            verdict = @verdict,
            judge_ID = @judge_ID,
            case_ID = @case_ID
        WHERE court_hearingID = @id
      `);

    return result.rowsAffected[0] > 0 ? { court_hearingID: id } : null;
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function deleteHearing(id) {
  await poolConnect;

  const check = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT court_hearingID FROM court_hearings WHERE court_hearingID = @id`);

  if (check.recordset.length === 0) return null;

  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM court_hearings WHERE court_hearingID = @id`);

  return { court_hearingID: id };
}

module.exports = {
  getAllHearings,
  getHearingById,
  createHearing,
  updateHearing,
  deleteHearing,
};
