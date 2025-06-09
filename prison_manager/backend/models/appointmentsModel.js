const { pool, poolConnect, sql } = require("../database");

async function getAllAppointments() {
  await poolConnect;
  const result = await pool.request().query(`
  SELECT a.*, 
         p.first_name + ' ' + p.last_name AS prisoner_name,
         u.first_name + ' ' + u.last_name AS medical_staff_name
  FROM appointments a
  JOIN prisoners p ON a.prisonerID = p.prisonerID
  JOIN medical_staff m ON a.medical_staff_ID = m.medical_staff_ID
  JOIN users u ON m.userID = u.userID
  ORDER BY a.date_ DESC
`);

  return result.recordset;
}

async function getAppointmentById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT * FROM appointments WHERE appointment_ID = @id`);
  return result.recordset[0];
}

async function createAppointment(appointment) {
  const { prisonerID, medical_staff_ID, date_ } = appointment;
  await poolConnect;

  const result = await pool.request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("medical_staff_ID", sql.Int, medical_staff_ID)
    .input("date_", sql.DateTime, date_)
    .query(`
      INSERT INTO appointments (prisonerID, medical_staff_ID, date_)
      OUTPUT INSERTED.appointment_ID
      VALUES (@prisonerID, @medical_staff_ID, @date_)
    `);

  return { appointment_ID: result.recordset[0].appointment_ID };
}


async function updateAppointment(id, appointment) {
  const { prisonerID, medical_staff_ID, date_ } = appointment;
  await poolConnect;

  await pool.request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("medical_staff_ID", sql.Int, medical_staff_ID)
    .input("date_", sql.DateTime, date_)
    .query(`
      UPDATE appointments
      SET prisonerID = @prisonerID,
          medical_staff_ID = @medical_staff_ID,
          date_ = @date_
      WHERE appointment_ID = @id
    `);

  return { appointment_ID: id };
}

async function deleteAppointment(id) {
  await poolConnect;

  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM appointments WHERE appointment_ID = @id`);

  return { appointment_ID: id };
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
