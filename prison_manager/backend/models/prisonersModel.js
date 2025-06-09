const { pool, poolConnect, sql } = require("../database");

async function getAllPrisoners() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM prisoners");
  return result.recordset;
}

async function getPrisonerById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM prisoners WHERE prisonerID = @id");
  return result.recordset[0];
}

async function createPrisoner(data) {
  await poolConnect;
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    national_id,
    address_,
    photo,
    sentence_start,
    sentence_end,
    status_,
    rank_,
    cell_block_ID,
    emergency_contact_ID
  } = data;

  if (cell_block_ID) {
    const capacityCheck = await pool.request()
      .input("cell_block_ID", sql.Int, cell_block_ID)
      .query(`
        SELECT capacity, actual_capacity
        FROM cells
        WHERE cell_block_ID = @cell_block_ID
      `);

    if (capacityCheck.recordset.length === 0) {
      throw new Error("Cell block not found");
    }

    const { capacity, actual_capacity } = capacityCheck.recordset[0];
    if (actual_capacity >= capacity) {
      throw new Error("Cell capacity reached");
    }
  }

  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const request = new sql.Request(transaction);
    request.input("first_name", sql.VarChar(255), first_name);
    request.input("last_name", sql.VarChar(255), last_name);
    request.input("date_of_birth", sql.Date, date_of_birth);
    request.input("gender", sql.VarChar(255), gender);
    request.input("national_id", sql.VarChar(255), national_id);
    request.input("address_", sql.VarChar(255), address_);
    request.input("photo", sql.VarChar(255), photo);
    request.input("sentence_start", sql.Date, sentence_start);
    request.input("sentence_end", sql.Date, sentence_end);
    request.input("status_", sql.VarChar(255), status_);
    request.input("rank_", sql.VarChar(255), rank_);
    request.input("cell_block_ID", sql.Int, cell_block_ID || null);
    request.input("emergency_contact_ID", sql.Int, emergency_contact_ID);

    const insertResult = await request.query(`
  DECLARE @InsertedIds TABLE (prisonerID INT);

  INSERT INTO prisoners (
    first_name, last_name, date_of_birth, gender, national_id, address_,
    photo, sentence_start, sentence_end, status_, rank_, cell_block_ID, emergency_contact_ID
  )
  OUTPUT INSERTED.prisonerID INTO @InsertedIds
  VALUES (
    @first_name, @last_name, @date_of_birth, @gender, @national_id, @address_,
    @photo, @sentence_start, @sentence_end, @status_, @rank_, @cell_block_ID, @emergency_contact_ID
  );

  SELECT prisonerID FROM @InsertedIds;
`);

    if (cell_block_ID) {
      await new sql.Request(transaction)
        .input("cell_block_ID", sql.Int, cell_block_ID)
        .query(`
          UPDATE cells SET actual_capacity = actual_capacity + 1
          WHERE cell_block_ID = @cell_block_ID
        `);
    }

    await transaction.commit();

    return insertResult.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updatePrisoner(id, data) {
  await poolConnect;

  const { cell_block_ID } = data;
  if (cell_block_ID) {
    const capacityCheck = await pool.request()
      .input("cell_block_ID", sql.Int, cell_block_ID)
      .query(`
        SELECT capacity, actual_capacity
        FROM cells
        WHERE cell_block_ID = @cell_block_ID
      `);

    if (capacityCheck.recordset.length === 0) {
      throw new Error("Cell block not found");
    }

    const { capacity, actual_capacity } = capacityCheck.recordset[0];
    if (actual_capacity > capacity) {
      throw new Error("Cell capacity reached");
    }
  }
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const currentPrisoner = await new sql.Request(transaction)
      .input("id", sql.Int, id)
      .query("SELECT cell_block_ID FROM prisoners WHERE prisonerID = @id");

    const old_cell_block_ID = currentPrisoner.recordset[0]?.cell_block_ID;

    const request = new sql.Request(transaction);
    request.input("id", sql.Int, id);

    const updates = [];
    for (let key in data) {
      let value = data[key];
      let type = sql.VarChar(255);
      if (key === "date_of_birth" || key === "sentence_start" || key === "sentence_end") type = sql.Date;
      if (key === "cell_block_ID" || key === "emergency_contact_ID") type = sql.Int;

      request.input(key, type, value);
      updates.push(`${key} = @${key}`);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    const updateQuery = `UPDATE prisoners SET ${updates.join(", ")} WHERE prisonerID = @id`;
    await request.query(updateQuery);

    if (cell_block_ID && old_cell_block_ID !== cell_block_ID) {
      if (old_cell_block_ID) {
        await new sql.Request(transaction)
          .input("old_cell_block_ID", sql.Int, old_cell_block_ID)
          .query(`
            UPDATE cells SET actual_capacity = actual_capacity - 1
            WHERE cell_block_ID = @old_cell_block_ID
          `);
      }

      await new sql.Request(transaction)
        .input("cell_block_ID", sql.Int, cell_block_ID)
        .query(`
          UPDATE cells SET actual_capacity = actual_capacity + 1
          WHERE cell_block_ID = @cell_block_ID
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function deletePrisoner(id) {
  await poolConnect;

  const prisoner = await pool.request()
    .input("id", sql.Int, id)
    .query("SELECT cell_block_ID FROM prisoners WHERE prisonerID = @id");

  const cell_block_ID = prisoner.recordset[0]?.cell_block_ID;

  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM prisoners WHERE prisonerID = @id");

    if (cell_block_ID) {
      await new sql.Request(transaction)
        .input("cell_block_ID", sql.Int, cell_block_ID)
        .query(`
          UPDATE cells SET actual_capacity = actual_capacity - 1
          WHERE cell_block_ID = @cell_block_ID
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  getAllPrisoners,
  getPrisonerById,
  createPrisoner,
  updatePrisoner,
  deletePrisoner,
};