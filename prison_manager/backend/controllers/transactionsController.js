const { sql, pool } = require("../database");
const transactionsModel = require("../models/transactionsModel");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionsModel.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    console.error("Error in getAllTransactions:", err);
    res.status(500).send(err.message);
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionsModel.getTransactionById(req.params.id);
    if (!transaction) return res.status(404).send("Transaction not found");
    res.json(transaction);
  } catch (err) {
    console.error("Error in getTransactionById:", err);
    res.status(500).send(err.message);
  }
};

const createTransaction = async (req, res) => {
  try {
    let { prisoner_account_ID, amount, type_, date_, prison_purchase_ID, prisonerID } = req.body;

    if (!prison_purchase_ID && !prisonerID) {
      const result = await pool.request()
        .input("prisoner_account_ID", sql.Int, prisoner_account_ID)
        .query(`SELECT prisonerID FROM prisoner_accounts WHERE prisoner_account_ID = @prisoner_account_ID`);

      if (!result.recordset.length) {
        return res.status(400).json({ error: "Invalid prisoner_account_ID" });
      }
      prisonerID = result.recordset[0].prisonerID;
    }

    const newTransaction = await transactionsModel.createTransaction({
      prisoner_account_ID,
      prisonerID,
      amount,
      type_,
      date_,
      prison_purchase_ID
    });

    res.status(201).json({ message: "Transaction created", transaction_ID: newTransaction.transaction_ID });
  } catch (err) {
    console.error("Error creating transaction:", err);
    res.status(500).json({ error: err.message });
  }
};
const createTransactionFromPurchase = async (req, res) => {
  try {
    const { prison_purchase_ID } = req.body;

    if (!prison_purchase_ID) {
      return res.status(400).json({ message: "prison_purchase_ID is required" });
    }

    const result = await pool.request()
      .input("purchaseID", sql.Int, prison_purchase_ID)
      .query(`
        SELECT pp.total_price AS amount, pa.prisonerID, pa.prisoner_account_ID, pa.balance
        FROM prison_purchases pp
        JOIN prisoner_accounts pa ON pp.prisoner_account_ID = pa.prisoner_account_ID
        WHERE pp.prison_purchase_ID = @purchaseID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const { amount, prisonerID, prisoner_account_ID, balance } = result.recordset[0];
    const check = await pool.request()
      .input("purchaseID", sql.Int, prison_purchase_ID)
      .query(`SELECT * FROM transactions WHERE reference_of_purchase = @purchaseID`);

    if (check.recordset.length > 0) {
      return res.status(400).json({ message: "Transaction for this purchase already exists" });
    }

    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient balance in prisoner's account" });
    }
    const newTransaction = await transactionsModel.createTransaction({
      prisoner_account_ID,
      prisonerID,
      amount,
      type_: 'purchase',
      date_: new Date(),
      prison_purchase_ID
    });

    await pool.request()
      .input("amount", sql.Decimal(10, 2), amount)
      .input("id", sql.Int, prisoner_account_ID)
      .query(`
        UPDATE prisoner_accounts
        SET balance = balance - @amount
        WHERE prisoner_account_ID = @id
      `);

    res.status(201).json({ message: "Transaction created from purchase", transaction_ID: newTransaction.transaction_ID });
  } catch (err) {
    console.error("Error in createTransactionFromPurchase:", err);
    res.status(500).json({ error: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const updatedData = req.body;
    await transactionsModel.updateTransaction(req.params.id, updatedData);
    res.json({ message: "Transaction updated" });
  } catch (err) {
    console.error("Error in updateTransaction:", err);
    res.status(500).send(err.message);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionsModel.deleteTransaction(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error("Error in deleteTransaction:", err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  createTransactionFromPurchase,
  updateTransaction,
  deleteTransaction
};
