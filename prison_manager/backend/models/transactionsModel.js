const { pool, poolConnect, sql } = require("../database");

async function getAllTransactions() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT * FROM transactions
  `);
  return result.recordset;
}

async function getTransactionById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT * FROM transactions WHERE transaction_ID = @id`);
  return result.recordset[0];
}

async function createTransaction(data) {
  await poolConnect;

  let {
    amount,
    type_,
    date_,
    prison_purchase_ID,
    prisonerID
  } = data;

  let prisoner_account_ID = null;
  let reference_of_purchase = null;

  if (prison_purchase_ID) {
  
    const purchaseResult = await pool.request()
      .input("id", sql.Int, prison_purchase_ID)
      .query(`
        SELECT pp.total_price, pp.date_, pa.prisonerID, pp.prisoner_account_ID
        FROM prison_purchases pp
        JOIN prisoner_accounts pa ON pa.prisoner_account_ID = pp.prisoner_account_ID
        WHERE pp.prison_purchase_ID = @id
      `);

    if (!purchaseResult.recordset.length) {
      throw new Error("Purchase not found");
    }

    const purchase = purchaseResult.recordset[0];
    amount = purchase.total_price;
    date_ = purchase.date_;
    prisonerID = purchase.prisonerID;
    prisoner_account_ID = purchase.prisoner_account_ID;
    reference_of_purchase = prison_purchase_ID;
  }

  if (!prisonerID) {
    throw new Error("prisonerID is required to create a transaction");
  }

  const insertResult = await pool.request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("reference_of_purchase", sql.Int, reference_of_purchase)
    .input("amount", sql.Decimal(10, 2), amount)
    .input("type_", sql.VarChar(255), type_)
    .input("date_", sql.Date, date_)
    .query(`
      INSERT INTO transactions (prisonerID, reference_of_purchase, amount, type_, date_)
      OUTPUT INSERTED.transaction_ID
      VALUES (@prisonerID, @reference_of_purchase, @amount, @type_, @date_)
    `);

  if (prisoner_account_ID) {
    await pool.request()
      .input("id", sql.Int, prisoner_account_ID)
      .input("amount", sql.Decimal(10, 2), amount)
      .query(`
        UPDATE prisoner_accounts
        SET balance = balance - @amount
        WHERE prisoner_account_ID = @id
      `);
  }

  return { transaction_ID: insertResult.recordset[0].transaction_ID };
}

async function updateTransaction(id, data) {
  const { prisonerID, reference_of_purchase, amount, type_, date_ } = data;

  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("reference_of_purchase", sql.Int, reference_of_purchase)
    .input("amount", sql.Decimal(10, 2), amount)
    .input("type_", sql.VarChar(255), type_)
    .input("date_", sql.Date, date_)
    .query(`
      UPDATE transactions SET
        prisonerID = @prisonerID,
        reference_of_purchase = @reference_of_purchase,
        amount = @amount,
        type_ = @type_,
        date_ = @date_
      WHERE transaction_ID = @id
    `);

  return { transaction_ID: id };
}

async function deleteTransaction(id) {
  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM transactions WHERE transaction_ID = @id`);
  return { transaction_ID: id };
}

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
