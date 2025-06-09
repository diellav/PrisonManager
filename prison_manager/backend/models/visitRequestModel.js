const { pool, sql, poolConnect } = require('../database');

const fetchPendingRequests = async () => {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT 
      vr.request_id, 
      vr.visit_date, 
      v.first_name, 
      v.last_name, 
      vr.prisonerID, 
      vr.relationship, 
      v.email
    FROM visit_requests vr
    JOIN visitors v ON v.visitor_ID = vr.visitor_ID
    WHERE vr.approved = 0
  `);
  return result.recordset;
};

const getRequestById = async (requestId) => {
  await poolConnect;
  const result = await pool.request()
    .input('request_id', sql.Int, requestId)
    .query(`
      SELECT 
        vr.request_id, vr.visit_date, vr.visitor_ID, vr.prisonerID, vr.relationship,
        v.first_name, v.last_name, v.email,
        p.first_name AS prisoner_first_name,
        p.last_name AS prisoner_last_name
      FROM visit_requests vr
      JOIN visitors v ON v.visitor_ID = vr.visitor_ID
      JOIN prisoners p ON p.prisonerID = vr.prisonerID
      WHERE vr.request_id = @request_id AND vr.approved = 0
    `);
  return result.recordset[0];
};

const insertVisit = async ({ visitor_ID, prisonerID, visit_date, relationship }) => {
  await poolConnect;
  return await pool.request()
    .input('visitor_ID', sql.Int, visitor_ID)
    .input('prisonerID', sql.Int, prisonerID)
    .input('visit_date', sql.Date, visit_date)
    .input('relationship', sql.VarChar(255), relationship)
    .query(`
      INSERT INTO visits (visitor_ID, prisonerID, visit_date, relationship)
      VALUES (@visitor_ID, @prisonerID, @visit_date, @relationship)
    `);
};

const createPendingVisitRequest = async ({ visitor_ID, prisonerID, visit_date, relationship }) => {
  await poolConnect;
  return await pool.request()
    .input('visitor_ID', sql.Int, visitor_ID)
    .input('prisonerID', sql.Int, prisonerID)
    .input('visit_date', sql.Date, visit_date)
    .input('relationship', sql.VarChar(255), relationship)
    .query(`
      INSERT INTO visit_requests (visitor_ID, prisonerID, visit_date, relationship, approved)
      VALUES (@visitor_ID, @prisonerID, @visit_date, @relationship, 0)
    `);
};

const markRequestAsApproved = async (requestId) => {
  await poolConnect;
  return await pool.request()
    .input('request_id', sql.Int, requestId)
    .query(`
      UPDATE visit_requests SET approved = 1 WHERE request_id = @request_id
    `);
};

const markRequestAsRejected = async (requestId) => {
  await poolConnect;
  return await pool.request()
    .input('request_id', sql.Int, requestId)
    .query(`
      DELETE FROM visit_requests WHERE request_id = @request_id
    `);
};

const prisonerExists = async (prisonerID) => {
  await poolConnect;
  const result = await pool.request()
    .input('prisonerID', sql.Int, prisonerID)
    .query('SELECT prisonerID FROM prisoners WHERE prisonerID = @prisonerID');
  return result.recordset.length > 0;
};

module.exports = {
  fetchPendingRequests,
  getRequestById,
  insertVisit,
  createPendingVisitRequest,
  markRequestAsApproved,
  markRequestAsRejected,
  prisonerExists,
};
