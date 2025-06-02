const { pool, poolConnect, sql } = require("../database");

async function getAllIncidents() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT 
      i.*, 
      (
        SELECT p.prisonerID, p.first_name, p.last_name
        FROM incident_prisoners ip
        JOIN prisoners p ON ip.prisoner_ID = p.prisonerID
        WHERE ip.incident_ID = i.incident_ID
        FOR JSON PATH
      ) AS prisoners
    FROM incidents i
  `);

  const incidents = result.recordset.map(row => ({
    ...row,
    prisoners: row.prisoners ? JSON.parse(row.prisoners) : []
  }));

  return incidents;
}

async function getIncidentById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT 
        i.*, 
        (
          SELECT p.prisonerID, p.first_name, p.last_name
          FROM incident_prisoners ip
          JOIN prisoners p ON ip.prisoner_ID = p.prisonerID
          WHERE ip.incident_ID = i.incident_ID
          FOR JSON PATH
        ) AS prisoners
      FROM incidents i
      WHERE i.incident_ID = @id
    `);

  if (result.recordset.length === 0) return null;

  const incident = result.recordset[0];
  incident.prisoners = incident.prisoners ? JSON.parse(incident.prisoners) : [];

  return incident;
}

async function createIncidentWithPrisoners(date_reported, severity, resolved, follow_up_actions, prisonerIDs = []) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    const result = await request
      .input("date_reported", sql.Date, date_reported)
      .input("severity", sql.VarChar(255), severity)
      .input("resolved", sql.VarChar(255), resolved)
      .input("follow_up_actions", sql.Text, follow_up_actions)
      .query(`
        INSERT INTO incidents (date_reported, severity, resolved, follow_up_actions)
        OUTPUT INSERTED.incident_ID
        VALUES (@date_reported, @severity, @resolved, @follow_up_actions)
      `);

    const newIncidentID = result.recordset[0].incident_ID;

    for (let prisonerID of prisonerIDs) {
      await new sql.Request(transaction)
        .input("incidentID", sql.Int, newIncidentID)
        .input("prisonerID", sql.Int, prisonerID)
        .query("INSERT INTO incident_prisoners (incident_ID, prisoner_ID) VALUES (@incidentID, @prisonerID)");
    }

    await transaction.commit();
    return { incident_ID: newIncidentID };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function updateIncident(id, date_reported, severity, resolved, follow_up_actions, prisonerIDs = []) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .input("date_reported", sql.Date, date_reported)
      .input("severity", sql.VarChar(255), severity)
      .input("resolved", sql.VarChar(255), resolved)
      .input("follow_up_actions", sql.Text, follow_up_actions)
      .query(`
        UPDATE incidents
        SET date_reported = @date_reported,
            severity = @severity,
            resolved = @resolved,
            follow_up_actions = @follow_up_actions
        WHERE incident_ID = @id
      `);

    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("DELETE FROM incident_prisoners WHERE incident_ID = @id");

    for (let prisonerID of prisonerIDs) {
      await new sql.Request(transaction)
        .input("incidentID", sql.Int, id)
        .input("prisonerID", sql.Int, prisonerID)
        .query("INSERT INTO incident_prisoners (incident_ID, prisoner_ID) VALUES (@incidentID, @prisonerID)");
    }

    await transaction.commit();
    return { message: "Incident and involved prisoners updated" };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}


async function deleteIncident(id) {
  await poolConnect;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("DELETE FROM incident_prisoners WHERE incident_ID = @id");

    await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("DELETE FROM incidents WHERE incident_ID = @id");

    await transaction.commit();
    return { message: "Incident deleted successfully" };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

module.exports = {
  getAllIncidents,
  getIncidentById,
  createIncidentWithPrisoners,
  updateIncident,
  deleteIncident,
};
