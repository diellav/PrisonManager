const { pool, poolConnect, sql } = require("../database");

async function getAllStoreItems() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM store_items");
  return result.recordset;
}

async function getStoreItemById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM store_items WHERE store_item_ID = @id");
  return result.recordset[0];
}

async function createStoreItem(data) {
  const { name_, price, category, stock_quantity, last_restocked } = data;
  await poolConnect;
  const result = await pool
    .request()
    .input("name_", sql.VarChar(255), name_)
    .input("price", sql.Decimal(10, 2), price)
    .input("category", sql.VarChar(255), category)
    .input("stock_quantity", sql.Int, stock_quantity)
    .input("last_restocked", sql.Date, last_restocked)
    .query(
      `INSERT INTO store_items (name_, price, category, stock_quantity, last_restocked)
       OUTPUT INSERTED.store_item_ID
       VALUES (@name_, @price, @category, @stock_quantity, @last_restocked)`
    );
  return { store_item_ID: result.recordset[0].store_item_ID };
}

async function updateStoreItem(id, data) {
  const { name_, price, category, stock_quantity, last_restocked } = data;
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name_", sql.VarChar(255), name_)
    .input("price", sql.Decimal(10, 2), price)
    .input("category", sql.VarChar(255), category)
    .input("stock_quantity", sql.Int, stock_quantity)
    .input("last_restocked", sql.Date, last_restocked)
    .query(
      `UPDATE store_items
       SET name_ = @name_,
           price = @price,
           category = @category,
           stock_quantity = @stock_quantity,
           last_restocked = @last_restocked
       WHERE store_item_ID = @id`
    );
  return result.rowsAffected;
}

async function deleteStoreItem(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM store_items WHERE store_item_ID = @id");
  return result.rowsAffected;
}

module.exports = {
  getAllStoreItems,
  getStoreItemById,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
};
