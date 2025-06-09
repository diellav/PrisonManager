const { pool, poolConnect, sql } = require("../database");


async function getAllSecurityLogs() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM security_logs");
  return result.recordset;
}


async function getSecurityLogById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM security_logs WHERE security_log_ID = @id");
  return result.recordset[0];
}


async function createSecurityLog(event_type, description_, location_, action_taken, time_stamp, incident_ID, reporting_guard_ID) {
  await poolConnect;
  const result = await pool
    .request()
    .input("event_type", sql.VarChar(255), event_type)
    .input("description_", sql.Text, description_)
    .input("location_", sql.VarChar(255), location_)
    .input("action_taken", sql.Text, action_taken)
    .input("time_stamp", sql.DateTime, time_stamp)
    .input("incident_ID", sql.Int, incident_ID)
    .input("reporting_guard_ID", sql.Int, reporting_guard_ID)
    .query(`
      INSERT INTO security_logs (
        event_type, description_, location_, action_taken,
        time_stamp, incident_ID, reporting_guard_ID
      ) VALUES (
        @event_type, @description_, @location_, @action_taken,
        @time_stamp, @incident_ID, @reporting_guard_ID
      )
    `);
  return result;
}

async function updateSecurityLog(id, event_type, description_, location_, action_taken, time_stamp, incident_ID, reporting_guard_ID) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("event_type", sql.VarChar(255), event_type)
    .input("description_", sql.Text, description_)
    .input("location_", sql.VarChar(255), location_)
    .input("action_taken", sql.Text, action_taken)
    .input("time_stamp", sql.DateTime, time_stamp)
    .input("incident_ID", sql.Int, incident_ID)
    .input("reporting_guard_ID", sql.Int, reporting_guard_ID)
    .query(`
      UPDATE security_logs
      SET 
        event_type = @event_type,
        description_ = @description_,
        location_ = @location_,
        action_taken = @action_taken,
        time_stamp = @time_stamp,
        incident_ID = @incident_ID,
        reporting_guard_ID = @reporting_guard_ID
      WHERE security_log_ID = @id
    `);
  return result;
}


async function deleteSecurityLog(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM security_logs WHERE security_log_ID = @id");
  return result;
}

module.exports = {
  getAllSecurityLogs,
  getSecurityLogById,
  createSecurityLog,
  updateSecurityLog,
  deleteSecurityLog
};
