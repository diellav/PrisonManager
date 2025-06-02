const { pool, poolConnect, sql } = require("../database");


async function getAllPrisonerMovements() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM prisoner_movements");
  return result.recordset;
}


async function getPrisonerMovementById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM prisoner_movements WHERE prisoner_movement_ID = @id");
  return result.recordset[0];
}

async function createPrisonerMovement(data) {
  await poolConnect;
  const { prisonerID, from_cell_ID, to_cell_ID, date_ } = data;
  if (
    prisonerID == null ||
    from_cell_ID == null ||
    to_cell_ID == null ||
    !date_
  ) {
    throw new Error("Missing required fields for prisoner movement");
  }

  const result = await pool
    .request()
    .input("prisonerID", sql.Int, prisonerID)
    .input("from_cell_ID", sql.Int, from_cell_ID)
    .input("to_cell_ID", sql.Int, to_cell_ID)
    .input("date_", sql.Date, date_)
    .query(`
      INSERT INTO prisoner_movements (
        prisonerID, from_cell_ID, to_cell_ID, date_
      )
      OUTPUT INSERTED.*
      VALUES (
        @prisonerID, @from_cell_ID, @to_cell_ID, @date_
      )
    `);

  return result.recordset[0];
}

async function updatePrisonerMovement(id, data) {
  await poolConnect;

  const allowedFields = ["prisonerID", "from_cell_ID", "to_cell_ID", "date_"];

  const request = pool.request().input("id", sql.Int, id);

  const updates = [];

  for (const key in data) {
    if (!allowedFields.includes(key)) {
      continue;
    }

    const value = data[key];
    let type = sql.VarChar(255);

    if (["prisonerID", "from_cell_ID", "to_cell_ID"].includes(key)) type = sql.Int;
    if (key === "date_") type = sql.Date;

    request.input(key, type, value);
    updates.push(`${key} = @${key}`);
  }

  if (updates.length === 0) {
    throw new Error("No valid fields to update");
  }

  const query = `UPDATE prisoner_movements SET ${updates.join(", ")} WHERE prisoner_movement_ID = @id`;
  await request.query(query);
}

async function deletePrisonerMovement(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM prisoner_movements WHERE prisoner_movement_ID = @id");
  return result;
}

module.exports = {
  getAllPrisonerMovements,
  getPrisonerMovementById,
  createPrisonerMovement,
  updatePrisonerMovement,
  deletePrisonerMovement,
};
