const { pool, poolConnect, sql } = require("../database");

async function getAllOperationalExpenses() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT * from vw_operational_expenses_details
  `);
  return result.recordset;
}

async function getOperationalExpenseById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT * from vw_operational_expenses_details
      WHERE oe.operational_expense_ID = @id
    `);
  return result.recordset[0];
}

async function createOperationalExpense(expense) {
  const {
    description_, amount, date_, category,
    budget_ID, approved_by, asset_ID
  } = expense;

  await poolConnect;
  const result = await pool.request()
    .input("description_", sql.Text, description_)
    .input("amount", sql.Decimal(10,2), amount)
    .input("date_", sql.Date, date_)
    .input("category", sql.VarChar(255), category)
    .input("budget_ID", sql.Int, budget_ID)
    .input("approved_by", sql.Int, approved_by)
    .input("asset_ID", sql.Int, asset_ID || null)
    .query(`
      INSERT INTO operational_expenses
      (description_, amount, date_, category, budget_ID, approved_by, asset_ID)
      OUTPUT INSERTED.operational_expense_ID
      VALUES
      (@description_, @amount, @date_, @category, @budget_ID, @approved_by, @asset_ID)
    `);

  return { operational_expense_ID: result.recordset[0].operational_expense_ID };
}

async function updateOperationalExpense(id, expense) {
  const {
    description_, amount, date_, category,
    budget_ID, approved_by, asset_ID
  } = expense;

  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .input("description_", sql.Text, description_)
    .input("amount", sql.Decimal(10,2), amount)
    .input("date_", sql.Date, date_)
    .input("category", sql.VarChar(255), category)
    .input("budget_ID", sql.Int, budget_ID)
    .input("approved_by", sql.Int, approved_by)
    .input("asset_ID", sql.Int, asset_ID || null)
    .query(`
      UPDATE operational_expenses SET
        description_ = @description_,
        amount = @amount,
        date_ = @date_,
        category = @category,
        budget_ID = @budget_ID,
        approved_by = @approved_by,
        asset_ID = @asset_ID
      WHERE operational_expense_ID = @id
    `);

  return { operational_expense_ID: id };
}

async function deleteOperationalExpense(id) {
  await poolConnect;
  await pool.request()
    .input("id", sql.Int, id)
    .query(`
      DELETE FROM operational_expenses WHERE operational_expense_ID = @id
    `);

  return { operational_expense_ID: id };
}

module.exports = {
  getAllOperationalExpenses,
  getOperationalExpenseById,
  createOperationalExpense,
  updateOperationalExpense,
  deleteOperationalExpense
};
