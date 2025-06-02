const { pool, poolConnect, sql } = require("../database");

async function getAllPrisonerWorks() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT * FROM prisoner_work
  `);
  return result.recordset;
}

async function getPrisonerWorkById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT * FROM prisoner_work
      WHERE prisoner_work_ID = @id
    `);
  return result.recordset[0];
}

async function createPrisonerWork(work) {
  const { prisonerID, work_type, work_hours, work_status } = work;

  await poolConnect;
  const result = await pool.request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("work_type", sql.VarChar(255), work_type)
    .input("work_hours", sql.VarChar(255), work_hours)
    .input("work_status", sql.VarChar(255), work_status)
    .query(`
      INSERT INTO prisoner_work
      (prisonerID, work_type, work_hours, work_status)
      OUTPUT INSERTED.prisoner_work_ID
      VALUES (@prisonerID, @work_type, @work_hours, @work_status)
    `);

  return { prisoner_work_ID: result.recordset[0].prisoner_work_ID };
}

async function updatePrisonerWork(id, work) {
  const { prisonerID, work_type, work_hours, work_status } = work;

  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("work_type", sql.VarChar(255), work_type)
    .input("work_hours", sql.VarChar(255), work_hours)
    .input("work_status", sql.VarChar(255), work_status)
    .query(`
      UPDATE prisoner_work SET
        prisonerID = @prisonerID,
        work_type = @work_type,
        work_hours = @work_hours,
        work_status = @work_status
      WHERE prisoner_work_ID = @id
    `);

  return { prisoner_work_ID: id };
}

async function deletePrisonerWork(id) {
  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .query(`
      DELETE FROM prisoner_work WHERE prisoner_work_ID = @id
    `);

  return { prisoner_work_ID: id };
}

module.exports = {
  getAllPrisonerWorks,
  getPrisonerWorkById,
  createPrisonerWork,
  updatePrisonerWork,
  deletePrisonerWork
};
