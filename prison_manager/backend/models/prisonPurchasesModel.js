const { pool, poolConnect, sql } = require("../database");

async function getAllPurchases() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM prison_purchases");
  return result.recordset;
}

async function getPurchaseById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM prison_purchases WHERE prison_purchase_ID = @id");
  return result.recordset[0];
}

async function createPurchase(store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by) {
  await poolConnect;
  const result = await pool
    .request()
    .input("store_item_ID", sql.Int, store_item_ID)
    .input("quantity", sql.Int, quantity)
    .input("total_price", sql.Decimal(10, 2), total_price)
    .input("date_", sql.Date, date_)
    .input("prisoner_account_ID", sql.Int, prisoner_account_ID)
    .input("approved_by", sql.Int, approved_by)
    .query(`
      INSERT INTO prison_purchases (store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by)
      VALUES (@store_item_ID, @quantity, @total_price, @date_, @prisoner_account_ID, @approved_by)
    `);
  return result;
}

async function updatePurchase(id, store_item_ID, quantity, total_price, date_, prisoner_account_ID, approved_by) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("store_item_ID", sql.Int, store_item_ID)
    .input("quantity", sql.Int, quantity)
    .input("total_price", sql.Decimal(10, 2), total_price)
    .input("date_", sql.Date, date_)
    .input("prisoner_account_ID", sql.Int, prisoner_account_ID)
    .input("approved_by", sql.Int, approved_by)
    .query(`
      UPDATE prison_purchases
      SET store_item_ID = @store_item_ID,
          quantity = @quantity,
          total_price = @total_price,
          date_ = @date_,
          prisoner_account_ID = @prisoner_account_ID,
          approved_by = @approved_by
      WHERE prison_purchase_ID = @id
    `);
  return result;
}

async function deletePurchase(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM prison_purchases WHERE prison_purchase_ID = @id");
  return result;
}

module.exports = {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase
};
