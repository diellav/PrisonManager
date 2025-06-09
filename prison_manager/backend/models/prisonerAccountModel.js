const { pool, poolConnect, sql } = require("../database");

async function getAllPrisonerAccounts() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM prisoner_accounts");
  return result.recordset;
}

async function getPrisonerAccountById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM prisoner_accounts WHERE prisoner_account_ID = @id");
  return result.recordset[0];
}

async function createPrisonerAccount(prisonerID, balance, status_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("balance", sql.Decimal(10, 2), balance)
    .input("status_", sql.VarChar(255), status_)
    .query(`
      INSERT INTO prisoner_accounts (prisonerID, balance, status_)
      VALUES (@prisonerID, @balance, @status_)
    `);
  return result;
}

async function updatePrisonerAccount(id, prisonerID, balance, status_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("prisonerID", sql.Int, prisonerID)
    .input("balance", sql.Decimal(10, 2), balance)
    .input("status_", sql.VarChar(255), status_)
    .query(`
      UPDATE prisoner_accounts
      SET prisonerID = @prisonerID, balance = @balance, status_ = @status_
      WHERE prisoner_account_ID = @id
    `);
  return result;
}

async function deletePrisonerAccount(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM prisoner_accounts WHERE prisoner_account_ID = @id");
  return result;
}

module.exports = {
  getAllPrisonerAccounts,
  getPrisonerAccountById,
  createPrisonerAccount,
  updatePrisonerAccount,
  deletePrisonerAccount,
};
