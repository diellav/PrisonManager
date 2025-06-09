
const { pool, poolConnect, sql } = require("../database");

const getAllTransactions = async () => {
  const result = await db.query("SELECT * FROM transactions ORDER BY transaction_ID");
  return result.rows;
};

const getTransactionById = async (id) => {
  const result = await db.query("SELECT * FROM transactions WHERE transaction_ID = $1", [id]);
  return result.rows[0];
};

const createTransaction = async (transaction) => {
  const {
    prisonerID,
    reference_of_purchase,
    amount,
    type_,
    date_,
  } = transaction;

  const result = await db.query(
    `INSERT INTO transactions 
     (prisonerID, reference_of_purchase, amount, type_, date_)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      prisonerID,
      reference_of_purchase,
      amount,
      type_,
      date_,
    ]
  );
  return result.rows[0];
};

const updateTransaction = async (id, transaction) => {
  const {
    prisonerID,
    reference_of_purchase,
    amount,
    type_,
    date_,
  } = transaction;

  const result = await db.query(
    `UPDATE transactions SET 
       prisonerID=$1, reference_of_purchase=$2, amount=$3, type_=$4, date_=$5
     WHERE transaction_ID=$6 RETURNING *`,
    [
      prisonerID,
      reference_of_purchase,
      amount,
      type_,
      date_,
      id,
    ]
  );
  return result.rows[0];
};

const deleteTransaction = async (id) => {
  await db.query("DELETE FROM transactions WHERE transaction_ID = $1", [id]);
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
