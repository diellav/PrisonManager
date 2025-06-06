const { pool, poolConnect, sql } = require("../database");

async function getAllMedicalRecords() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT mr.*, 
           p.first_name + ' ' + p.last_name AS prisoner_name,
           u.first_name + ' ' + u.last_name AS medical_staff_name
    FROM medical_records mr
    JOIN prisoners p ON mr.prisonerID = p.prisonerID
    JOIN medical_staff ms ON mr.medical_staff_ID = ms.medical_staff_ID
    JOIN users u ON ms.userID = u.userID
    ORDER BY mr.medical_record_ID DESC
  `);
  return result.recordset;
}

async function getMedicalRecordById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT * FROM medical_records WHERE medical_record_ID = @id`);
  return result.recordset[0];
}

async function createMedicalRecord(record) {
  const { prisonerID, medical_staff_ID, diagnosis, treatment, medications } = record;
  await poolConnect;

  const result = await pool.request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("medical_staff_ID", sql.Int, medical_staff_ID)
    .input("diagnosis", sql.VarChar(255), diagnosis)
    .input("treatment", sql.Text, treatment)
    .input("medications", sql.VarChar(255), medications || null)
    .query(`
      INSERT INTO medical_records (prisonerID, medical_staff_ID, diagnosis, treatment, medications)
      OUTPUT INSERTED.medical_record_ID
      VALUES (@prisonerID, @medical_staff_ID, @diagnosis, @treatment, @medications)
    `);

  return { medical_record_ID: result.recordset[0].medical_record_ID };
}

async function updateMedicalRecord(id, record) {
  const { prisonerID, medical_staff_ID, diagnosis, treatment, medications } = record;
  await poolConnect;

  await pool.request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("medical_staff_ID", sql.Int, medical_staff_ID)
    .input("diagnosis", sql.VarChar(255), diagnosis)
    .input("treatment", sql.Text, treatment)
    .input("medications", sql.VarChar(255), medications || null)
    .query(`
      UPDATE medical_records
      SET prisonerID = @prisonerID,
          medical_staff_ID = @medical_staff_ID,
          diagnosis = @diagnosis,
          treatment = @treatment,
          medications = @medications
      WHERE medical_record_ID = @id
    `);

  return { medical_record_ID: id };
}

async function deleteMedicalRecord(id) {
  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM medical_records WHERE medical_record_ID = @id`);

  return { medical_record_ID: id };
}

module.exports = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
};
