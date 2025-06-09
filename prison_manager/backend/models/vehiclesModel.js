
const db = require("../db");

const getAllVehicles = async () => {
  const result = await db.query("SELECT * FROM vehicles ORDER BY vehicle_ID");
  return result.rows;
};

const getVehicleById = async (id) => {
  const result = await db.query("SELECT * FROM vehicles WHERE vehicle_ID = $1", [id]);
  return result.rows[0];
};

const createVehicle = async (vehicle) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicle;
  const result = await db.query(
    `INSERT INTO vehicles (plate_number, type_, capacity, status_, transport_staff_ID)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [plate_number, type_, capacity, status_, transport_staff_ID]
  );
  return result.rows[0];
};

const updateVehicle = async (id, vehicle) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicle;
  const result = await db.query(
    `UPDATE vehicles SET plate_number=$1, type_=$2, capacity=$3, status_=$4, transport_staff_ID=$5
     WHERE vehicle_ID=$6 RETURNING *`,
    [plate_number, type_, capacity, status_, transport_staff_ID, id]
  );
  return result.rows[0];
};

const deleteVehicle = async (id) => {
  await db.query("DELETE FROM vehicles WHERE vehicle_ID = $1", [id]);
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
