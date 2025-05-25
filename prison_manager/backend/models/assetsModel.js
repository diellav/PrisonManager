const { pool, poolConnect, sql } = require("../database");

async function getAllAssets() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM assets");
  return result.recordset;
}

async function getAssetById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM assets WHERE asset_ID = @id");
  return result.recordset[0];
}

async function createAsset(name, category, purchase_date, status_, location_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("name", sql.VarChar, name)
    .input("category", sql.VarChar, category)
    .input("purchase_date", sql.Date, purchase_date)
    .input("status_", sql.VarChar, status_)
    .input("location_", sql.VarChar, location_)
    .query(
      "INSERT INTO assets (name, category, purchase_date, status_, location_) VALUES (@name, @category, @purchase_date, @status_, @location_)"
    );
  return result;
}

async function updateAsset(id, name, category, purchase_date, status_, location_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("name", sql.VarChar, name)
    .input("category", sql.VarChar, category)
    .input("purchase_date", sql.Date, purchase_date)
    .input("status_", sql.VarChar, status_)
    .input("location_", sql.VarChar, location_)
    .query(
      "UPDATE assets SET name = @name, category = @category, purchase_date = @purchase_date, status_ = @status_, location_ = @location_ WHERE asset_ID = @id"
    );
  return result;
}

async function deleteAsset(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM assets WHERE asset_ID = @id");
  return result;
}

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
