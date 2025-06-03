const { pool, poolConnect, sql } = require("../database");

const getAllMedicalStaff = async () => {
  try {
    await poolConnect;
    const result = await pool.request()
      .query(`SELECT medical_staff_ID, userID, specialty FROM medical_staff`);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};


const getMedicalStaffById = async (id) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT medical_staff_ID, userID, specialty FROM medical_staff WHERE medical_staff_ID = @id`);
    return result.recordset[0];
  } catch (error) {
    throw error;
  }
};

const createMedicalStaff = async (medicalStaff) => {
  try {
    await poolConnect;
    const result = await pool.request()
      .input('userID', sql.Int, medicalStaff.userID)
      .input('specialty', sql.VarChar(255), medicalStaff.specialty)
      .query(`INSERT INTO medical_staff (userID, specialty)
              VALUES (@userID, @specialty);
              SELECT SCOPE_IDENTITY() AS medical_staff_ID;`);
    return result.recordset[0];
  } catch (error) {
    throw error;
  }
};

const updateMedicalStaff = async (id, medicalStaff) => {
  try {
    await poolConnect;
    await pool.request()
      .input('id', sql.Int, id)
      .input('userID', sql.Int, medicalStaff.userID)
      .input('specialty', sql.VarChar(255), medicalStaff.specialty)
      .query(`UPDATE medical_staff SET userID = @userID, specialty = @specialty WHERE medical_staff_ID = @id`);
  } catch (error) {
    throw error;
  }
};

const deleteMedicalStaff = async (id) => {
  try {
    await poolConnect;
    await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM medical_staff WHERE medical_staff_ID = @id`);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllMedicalStaff,
  getMedicalStaffById,
  createMedicalStaff,
  updateMedicalStaff,
  deleteMedicalStaff,
};
