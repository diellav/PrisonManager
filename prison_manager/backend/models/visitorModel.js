const { pool, poolConnect, sql } = require("../database");

const getAllVisitors = async () => {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM visitors');
  return result.recordset;
};

const getVisitorById = async (id) => {
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM visitors WHERE visitor_ID = @id');
  return result.recordset[0];
};

const getVisitorByUsername = async (username) => {
  await poolConnect;
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM visitors WHERE username = @username');
  return result.recordset[0];
};

const createVisitor = async (visitorData) => {
  const { first_name, last_name, username, password, email, relationship, visit_request = 0 } = visitorData;
  await poolConnect;
  const result = await pool.request()
    .input('first_name', sql.VarChar, first_name)
    .input('last_name', sql.VarChar, last_name)
    .input('username', sql.VarChar, username)
    .input('password', sql.VarChar, password)  
    .input('email', sql.VarChar, email)
    .input('relationship', sql.VarChar, relationship)
    .input('visit_request', sql.Bit, visit_request)

    .query(
      `INSERT INTO visitors 
       (first_name, last_name, username, password, email, relationship, visit_request)
       VALUES (@first_name, @last_name, @username, @password, @email, @relationship, @visit_request)`
    );
  return result;
};

const updateVisitor = async (id, visitorData) => {
  const { first_name, last_name, username, password, email, relationship, visit_request } = visitorData;
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('first_name', sql.VarChar, first_name)
    .input('last_name', sql.VarChar, last_name)
    .input('username', sql.VarChar, username)
    .input('password', sql.VarChar, password)
    .input('email', sql.VarChar, email)
    .input('relationship', sql.VarChar, relationship)
    .input('visit_request', sql.Bit, visit_request)
    .query(
      `UPDATE visitors SET 
         first_name = @first_name, 
         last_name = @last_name, 
         username = @username, 
         password = @password, 
         email = @email, 
         relationship = @relationship, 
         visit_request = @visit_request
       WHERE visitor_ID = @id`
    );
  return result;
};

const deleteVisitor = async (id) => {
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM visitors WHERE visitor_ID = @id');
  return result;
};

module.exports = {
  getAllVisitors,
  getVisitorById,
  getVisitorByUsername,
  createVisitor,
  updateVisitor,
  deleteVisitor
};
