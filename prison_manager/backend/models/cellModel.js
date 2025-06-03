const { pool, poolConnect, sql } = require("../database");

async function getAllCells() {
  await poolConnect;
  const result = await pool.request().query(`
SELECT
  c.cell_block_ID,
  c.block_id,
  c.block_name,
  c.capacity,
  c.category,
  c.cell_number,
  ISNULL(COUNT(p.prisonerID), 0) AS actual_capacity
FROM cells c
LEFT JOIN prisoners p ON p.cell_block_ID = c.cell_block_ID
GROUP BY
  c.cell_block_ID,
  c.block_id,
  c.block_name,
  c.capacity,
  c.category,
  c.cell_number

  `);
  return result.recordset;
}

async function getCellById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT
  c.cell_block_ID,
  c.block_id,
  c.block_name,
  c.capacity,
  c.category,
  c.cell_number,
  ISNULL(COUNT(p.prisonerID), 0) AS actual_capacity
FROM cells c
LEFT JOIN prisoners p ON p.cell_block_ID = c.cell_block_ID
GROUP BY
  c.cell_block_ID,
  c.block_id,
  c.block_name,
  c.capacity,
  c.category,
  c.cell_number
where cell_block_ID=@id
    `);
  return result.recordset[0];
}

async function createCell(block_id, capacity, category, cell_number) {
  await poolConnect;
  const result = await pool
    .request()
    .input("block_id", sql.Int, block_id)
    .input("capacity", sql.Int, capacity)
    .input("category", sql.VarChar(255), category)
    .input("cell_number", sql.VarChar(10), cell_number)
    .query(`
      INSERT INTO cells (block_id, capacity, category, cell_number)
      VALUES (@block_id, @capacity, @category, @cell_number)
    `);
  return result;
}

async function updateCell(id, block_id, capacity, category, cell_number) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("block_id", sql.Int, block_id)
    .input("capacity", sql.Int, capacity)
    .input("category", sql.VarChar(255), category)
    .input("cell_number", sql.VarChar(10), cell_number)
    .query(`
      UPDATE cells
      SET block_id = @block_id, capacity = @capacity, category = @category, cell_number = @cell_number
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
