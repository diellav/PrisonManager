const { pool, poolConnect, sql } = require("../database");

async function getAllTransport() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT *
    FROM transport
    ORDER BY transport_ID
  `);
  return result.recordset;
}

async function getTransportById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT *
      FROM transport
      WHERE transport_ID = @id
    `);
  return result.recordset[0];
}

async function createTransport(transport) {
  const {
    prisonerID,
    departure_location,
    destination_location,
    transport_date,
    transport_reason,
    status_,
    guard_ID,
    vehicle_ID
  } = transport;

  await poolConnect;
  const result = await pool.request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("departure_location", sql.VarChar(255), departure_location)
    .input("destination_location", sql.VarChar(255), destination_location)
    .input("transport_date",sql.DateTime, transport_date)
    .input("transport_reason",sql.Text,transport_reason)
    .input("status_", sql.VarChar(255), status_)
    .input("guard_ID",sql.Int,guard_ID)
    .input("vehicle_ID", sql.Int, vehicle_ID)
    .query(`
      INSERT INTO transport
        (prisonerID, departure_location, destination_location,
         transport_date, transport_reason, status_, guard_ID, vehicle_ID)
      OUTPUT INSERTED.transport_ID
      VALUES
        (@prisonerID, @departure_location, @destination_location,
         @transport_date, @transport_reason, @status_, @guard_ID, @vehicle_ID)
    `);

  return { transport_ID: result.recordset[0].transport_ID };
}

async function updateTransport(id, transport) {
  const {
    prisonerID,
    departure_location,
    destination_location,
    transport_date,
    transport_reason,
    status_,
    guard_ID,
    vehicle_ID
  } = transport;

  await poolConnect;
  await pool.request()
    .input("id", sql.Int,id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("departure_location", sql.VarChar(255), departure_location)
    .input("destination_location", sql.VarChar(255), destination_location)
    .input("transport_date",  sql.DateTime, transport_date)
    .input("transport_reason", sql.Text,  transport_reason)
    .input("status_", sql.VarChar(255), status_)
    .input("guard_ID", sql.Int, guard_ID)
    .input("vehicle_ID", sql.Int,vehicle_ID)
    .query(`
      UPDATE transport SET
        prisonerID = @prisonerID,
        departure_location = @departure_location,
        destination_location = @destination_location,
        transport_date = @transport_date,
        transport_reason = @transport_reason,
        status_ = @status_,
        guard_ID = @guard_ID,
        vehicle_ID = @vehicle_ID
      WHERE transport_ID = @id
    `);

  return { transport_ID: id };
}

async function deleteTransport(id) {
  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .query(`
      DELETE FROM transport
      WHERE transport_ID = @id
    `);

  return { transport_ID: id };
}

module.exports = {
  getAllTransport,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport
};