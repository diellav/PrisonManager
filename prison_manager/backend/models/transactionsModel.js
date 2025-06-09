const { pool, poolConnect, sql } = require("../database");

async function getAll() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM transactions");
  return result.recordset;
}

async function getById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM transactions WHERE transaction_ID = @id");
  return result.recordset[0];
}

async function create(prisonerID, reference_of_purchase, amount, type_, date_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("reference_of_purchase", sql.Int, reference_of_purchase)
    .input("amount", sql.Decimal(10, 2), amount)
    .input("type_", sql.VarChar(255), type_)
    .input("date_", sql.Date, date_)
    .query(
      "INSERT INTO transactions (prisonerID, reference_of_purchase, amount, type_, date_) VALUES (@prisonerID, @reference_of_purchase, @amount, @type_, @date_)"
    );
  return result;
}

async function update(id, prisonerID, reference_of_purchase, amount, type_, date_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("reference_of_purchase", sql.Int, reference_of_purchase)
    .input("amount", sql.Decimal(10, 2), amount)
    .input("type_", sql.VarChar(255), type_)
    .input("date_", sql.Date, date_)
    .query(
      "UPDATE transactions SET prisonerID = @prisonerID, reference_of_purchase = @reference_of_purchase, amount = @amount, type_ = @type_, date_ = @date_ WHERE transaction_ID = @id"
    );
  return result;
}

async function deleteTransaction(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM transactions WHERE transaction_ID = @id");
  return result;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteTransaction,
};
