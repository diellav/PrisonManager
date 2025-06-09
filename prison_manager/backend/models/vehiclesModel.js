const pool = require("../database").pool;

const getAllVehicles = async () => {
  await poolConnect; // ensure connection is established
  const request = pool.request();
  const result = await request.query("SELECT * FROM vehicles ORDER BY vehicle_ID");
  return result.recordset;
};

const getVehicleById = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('id', sql.Int, id);  // assuming vehicle_ID is int
  const result = await request.query("SELECT * FROM vehicles WHERE vehicle_ID = @id");
  return result.recordset[0];
};

const createVehicle = async (vehicle) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicle;
  await poolConnect;
  const request = pool.request();
  request.input('plate_number', sql.VarChar, plate_number);
  request.input('type_', sql.VarChar, type_);
  request.input('capacity', sql.Int, capacity);
  request.input('status_', sql.VarChar, status_);
  request.input('transport_staff_ID', sql.Int, transport_staff_ID);
  
  const insertQuery = `
    INSERT INTO vehicles (plate_number, type_, capacity, status_, transport_staff_ID)
    OUTPUT INSERTED.*
    VALUES (@plate_number, @type_, @capacity, @status_, @transport_staff_ID)
  `;

  const result = await request.query(insertQuery);
  return result.recordset[0];
};

const updateVehicle = async (id, vehicle) => {
  const { plate_number, type_, capacity, status_, transport_staff_ID } = vehicle;
  await poolConnect;
  const request = pool.request();
  request.input('id', sql.Int, id);
  request.input('plate_number', sql.VarChar, plate_number);
  request.input('type_', sql.VarChar, type_);
  request.input('capacity', sql.Int, capacity);
  request.input('status_', sql.VarChar, status_);
  request.input('transport_staff_ID', sql.Int, transport_staff_ID);

  const updateQuery = `
    UPDATE vehicles
    SET plate_number = @plate_number,
        type_ = @type_,
        capacity = @capacity,
        status_ = @status_,
        transport_staff_ID = @transport_staff_ID
    OUTPUT INSERTED.*
    WHERE vehicle_ID = @id
  `;

  const result = await request.query(updateQuery);
  return result.recordset[0];
};

const deleteVehicle = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('id', sql.Int, id);
  await request.query("DELETE FROM vehicles WHERE vehicle_ID = @id");
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
