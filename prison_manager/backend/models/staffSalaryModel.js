const { pool, poolConnect, sql } = require("../database");

async function getAllStaffSalaries() {
  await poolConnect;
  const result = await pool.request().query(`
    SELECT ss.*, u.first_name, u.last_name, b.year_
    FROM staff_salaries ss
    JOIN users u ON ss.staff_ID = u.userID
    JOIN budget b ON ss.budget_ID = b.budget_ID
  `);
  return result.recordset;
}

async function getStaffSalaryById(id) {
  await poolConnect;
  const result = await pool.request()
    .input("id", sql.Int, id)
    .query(`
      SELECT ss.*, u.first_name, u.last_name, b.year_
      FROM staff_salaries ss
      JOIN users u ON ss.staff_ID = u.userID
      JOIN budget b ON ss.budget_ID = b.budget_ID
      WHERE ss.salary_ID = @id
    `);
  return result.recordset[0];
}

async function createStaffSalaryUsingSP(salary) {
  const { staff_ID, amount, payment_date, payment_method, notes, budget_ID } = salary;
  await poolConnect;

  try {
    const result = await pool.request()
      .input("staff_ID", sql.Int, staff_ID)
      .input("amount", sql.Decimal(10, 2), amount)
      .input("payment_date", sql.Date, payment_date)
      .input("payment_method", sql.VarChar(255), payment_method)
      .input("notes", sql.Text, notes || null)
      .input("budget_ID", sql.Int, budget_ID)
      .output("salary_ID", sql.Int)
      .execute("InsertStaffSalary");

    return { salary_ID: result.output.salary_ID };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function updateStaffSalaryUsingSP(id, salary) {
  const { staff_ID, amount, payment_date, payment_method, notes, budget_ID } = salary;
  await poolConnect;

  try {
    await pool.request()
      .input("salary_ID", sql.Int, id)
      .input("staff_ID", sql.Int, staff_ID)
      .input("amount", sql.Decimal(10, 2), amount)
      .input("payment_date", sql.Date, payment_date)
      .input("payment_method", sql.VarChar(255), payment_method)
      .input("notes", sql.Text, notes || null)
      .input("budget_ID", sql.Int, parseInt(budget_ID))
      .execute("UpdateStaffSalaryy");

    return { salary_ID: id };
  } catch (err) {
    throw new Error(err.originalError?.info?.message || err.message);
  }
}

async function deleteStaffSalary(id) {
  await poolConnect;

  const salary = await pool.request()
    .input("id", sql.Int, id)
    .query(`SELECT amount, budget_ID FROM staff_salaries WHERE salary_ID = @id`);

  if (salary.recordset.length === 0) return null;

  const { amount, budget_ID } = salary.recordset[0];

  await pool.request()
    .input("id", sql.Int, id)
    .query(`DELETE FROM staff_salaries WHERE salary_ID = @id`);

  await pool.request()
    .input("budget_ID", sql.Int, budget_ID)
    .input("amount", sql.Decimal(10, 2), amount)
    .query(`
      UPDATE budget
      SET used_funds = used_funds - @amount,
          remaining_funds = allocated_funds - (used_funds - @amount)
      WHERE budget_ID = @budget_ID
    `);

  return { salary_ID: id };
}

module.exports = {
  getAllStaffSalaries,
  getStaffSalaryById,
  createStaffSalaryUsingSP,
  updateStaffSalaryUsingSP,
  deleteStaffSalary
};
