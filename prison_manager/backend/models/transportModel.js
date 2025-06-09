
const db = require("../db");

const getAllTransport = async () => {
  const result = await db.query("SELECT * FROM transport ORDER BY transport_ID");
  return result.rows;
};

const getTransportById = async (id) => {
  const result = await db.query("SELECT * FROM transport WHERE transport_ID = $1", [id]);
  return result.rows[0];
};

const createTransport = async (transport) => {
  const {
    prisonerID,
    departure_location,
    destination_location,
    transport_date,
    transport_reason,
    status_,
    guard_ID,
    vehicle_ID,
  } = transport;

  const result = await db.query(
    `INSERT INTO transport 
     (prisonerID, departure_location, destination_location, transport_date, transport_reason, status_, guard_ID, vehicle_ID)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      prisonerID,
      departure_location,
      destination_location,
      transport_date,
      transport_reason,
      status_,
      guard_ID,
      vehicle_ID,
    ]
  );
  return result.rows[0];
};

const updateTransport = async (id, transport) => {
  const {
    prisonerID,
    departure_location,
    destination_location,
    transport_date,
    transport_reason,
    status_,
    guard_ID,
    vehicle_ID,
  } = transport;

  const result = await db.query(
    `UPDATE transport SET 
       prisonerID=$1, departure_location=$2, destination_location=$3, transport_date=$4, transport_reason=$5, 
       status_=$6, guard_ID=$7, vehicle_ID=$8
     WHERE transport_ID=$9 RETURNING *`,
    [
      prisonerID,
      departure_location,
      destination_location,
      transport_date,
      transport_reason,
      status_,
      guard_ID,
      vehicle_ID,
      id,
    ]
  );
  return result.rows[0];
};

const deleteTransport = async (id) => {
  await db.query("DELETE FROM transport WHERE transport_ID = $1", [id]);
};

module.exports = {
  getAllTransport,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
};
