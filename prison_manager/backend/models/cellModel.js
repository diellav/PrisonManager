const { pool, poolConnect, sql } = require("../database");

async function getAllCells() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM cells");
  return result.recordset;
}

async function getCellById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM cells WHERE cell_block_ID = @id");
  return result.recordset[0];
}

async function createCell(block_name, capacity, actual_capacity, category, cell_number) {
  await poolConnect;
  const result = await pool
    .request()
    .input("block_name", sql.VarChar(1), block_name)
    .input("capacity", sql.Int, capacity)
    .input("actual_capacity", sql.Int, actual_capacity)
    .input("category", sql.VarChar(255), category)
    .input("cell_number", sql.VarChar(10), cell_number)
    .query(`
      INSERT INTO cells (block_name, capacity, actual_capacity, category, cell_number) 
      VALUES (@block_name, @capacity, @actual_capacity, @category, @cell_number)
    `);
  return result;
}

async function updateCell(id, block_name, capacity, actual_capacity, category, cell_number) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("block_name", sql.VarChar(1), block_name)
    .input("capacity", sql.Int, capacity)
    .input("actual_capacity", sql.Int, actual_capacity)
    .input("category", sql.VarChar(255), category)
    .input("cell_number", sql.VarChar(10), cell_number)
    .query(`
      UPDATE cells 
      SET block_name = @block_name, capacity = @capacity, actual_capacity = @actual_capacity, category = @category, cell_number = @cell_number 
      WHERE cell_block_ID = @id
    `);
  return result;
}

async function deleteCell(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM cells WHERE cell_block_ID = @id");
  return result;
}

module.exports = {
  getAllCells,
  getCellById,
  createCell,
  updateCell,
  deleteCell,
};
