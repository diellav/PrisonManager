const { pool, poolConnect, sql } = require("../database");

async function getAllBudgets() {
  await poolConnect; 
  const result = await pool.request().query("SELECT * FROM budget");
  return result.recordset;
}

async function getBudgetById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM budget WHERE budget_ID = @id");
  return result.recordset[0];
}

async function createBudget(year, allocated_funds, used_funds, remaining_funds, last_updated) {
  await poolConnect;
  const result = await pool
    .request()
    .input("year_", sql.Int, year)
    .input("allocated_funds", sql.Int, allocated_funds)
    .input("used_funds", sql.Decimal(18, 2), used_funds)
    .input("remaining_funds", sql.Decimal(18, 2), remaining_funds)
    .input("last_updated", sql.DateTime, last_updated)
    .query("INSERT INTO budget (year_, allocated_funds, used_funds, remaining_funds, last_updated)VALUES (@year_, @allocated_funds, @used_funds, @remaining_funds, @last_updated)");
  return result;
}

async function updateBudget(id, year, allocated_funds, used_funds, remaining_funds, last_updated) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("year_", sql.Int, year)
    .input("allocated_funds", sql.Int, allocated_funds)
    .input("used_funds", sql.Decimal(18, 2), used_funds)
    .input("remaining_funds", sql.Decimal(18, 2), remaining_funds)
    .input("last_updated", sql.DateTime, last_updated)
    .query("UPDATE budget SET year_ = @year_,  allocated_funds = @allocated_funds, used_funds = @used_funds, remaining_funds = @remaining_funds, last_updated = @last_updated WHERE budget_ID = @id");
  return result;
}

async function deleteBudget(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM budget WHERE budget_ID = @id");
  return result;
}

module.exports = {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
};
