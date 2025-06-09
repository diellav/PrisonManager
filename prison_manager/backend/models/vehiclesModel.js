const { pool, poolConnect, sql } = require("../database");

const getAllVehicles = async () => {
  await poolConnect;
  const result = await pool.request()
    .query("SELECT * FROM vehicles ORDER BY vehicle_ID");
  return result.recordset;
};

const getVehicleById = async (id) => {
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query("SELECT * FROM vehicles WHERE vehicle_ID = @id");
  return result.recordset[0];
};

const createVehicle = async (vehicleData) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicleData;
  await poolConnect;
  const result = await pool.request()
    .input('plate_number', sql.VarChar, plate_number)
    .input('type_', sql.VarChar, type_)
    .input('capacity', sql.Int, capacity)
    .input('status_', sql.VarChar, status_)
    .input('transport_staff_ID', sql.Int, transport_staff_ID)
    .query(
      `INSERT INTO vehicles (plate_number, type_, capacity, status_, transport_staff_ID)
       VALUES (@plate_number, @type_, @capacity, @status_, @transport_staff_ID)`
    );
  return result;
};

const updateVehicle = async (id, vehicleData) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicleData;
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .input('plate_number', sql.VarChar, plate_number)
    .input('type_', sql.VarChar, type_)
    .input('capacity', sql.Int, capacity)
    .input('status_', sql.VarChar, status_)
    .input('transport_staff_ID', sql.Int, transport_staff_ID)
    .query(
      `UPDATE vehicles SET
        plate_number = @plate_number,
        type_ = @type_,
        capacity = @capacity,
        status_ = @status_,
        transport_staff_ID = @transport_staff_ID
      WHERE vehicle_ID = @id`
    );
  return result;
};

const deleteVehicle = async (id) => {
  await poolConnect;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query("DELETE FROM vehicles WHERE vehicle_ID = @id");
  return result;
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
