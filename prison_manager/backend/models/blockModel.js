const { pool, poolConnect, sql } = require("../database");

async function getAllBlocks() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM blocks");
  return result.recordset;
}

async function getBlockById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM blocks WHERE block_id = @id");
  return result.recordset[0];
}

async function createBlock(block_name, category) {
  await poolConnect;
  const result = await pool
    .request()
    .input("block_name", sql.VarChar(255), block_name)
    .input("category", sql.VarChar(255), category)
    .query(`
      INSERT INTO blocks (block_name, category) 
      VALUES (@block_name, @category)
    `);
  return result;
}

async function updateBlock(id, block_name, category) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("block_name", sql.VarChar(255), block_name)
    .input("category", sql.VarChar(255), category)
    .query(`
      UPDATE blocks 
      SET block_name = @block_name, category = @category 
      WHERE block_id = @id
    `);
  return result;
}

async function deleteBlock(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM blocks WHERE block_id = @id");
  return result;
}

module.exports = {
  getAllBlocks,
  getBlockById,
  createBlock,
  updateBlock,
  deleteBlock,
};
