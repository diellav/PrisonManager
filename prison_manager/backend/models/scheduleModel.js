const { pool, poolConnect, sql } = require("../database");

async function getAllSchedules() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM staff_schedule");
  return result.recordset;
}

async function getScheduleById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM staff_schedule WHERE staff_schedule_ID = @id");
  return result.recordset[0];
}

async function createSchedule(userID, shift_type, shift_start, shift_end, date_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("userID", sql.Int, userID)
    .input("shift_type", sql.VarChar(255), shift_type)
    .input("shift_start", sql.Time, shift_start)
    .input("shift_end", sql.Time, shift_end)
    .input("date_", sql.Date, date_)
    .query(`
      INSERT INTO staff_schedule (userID, shift_type, shift_start, shift_end, date_)
      VALUES (@userID, @shift_type, @shift_start, @shift_end, @date_)
    `);
  return result;
}

async function updateSchedule(id, userID, shift_type, shift_start, shift_end, date_) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("userID", sql.Int, userID)
    .input("shift_type", sql.VarChar(255), shift_type)
    .input("shift_start", sql.Time, shift_start)
    .input("shift_end", sql.Time, shift_end)
    .input("date_", sql.Date, date_)
    .query(`
      UPDATE staff_schedule
      SET userID = @userID, shift_type = @shift_type, 
          shift_start = @shift_start, shift_end = @shift_end, date_ = @date_
      WHERE staff_schedule_ID = @id
    `);
  return result;
}

async function deleteSchedule(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM staff_schedule WHERE staff_schedule_ID = @id");
  return result;
}

async function createScheduleRepeat(userID, shift_type, shift_start, shift_end, date_, repeat_weeks) {
  await poolConnect;

  for (let currentWeek = 0; currentWeek < repeat_weeks; currentWeek++) {
    await pool
      .request()
      .input("userID", sql.Int, userID)
      .input("shift_type", sql.VarChar(255), shift_type)
      .input("shift_start", sql.Time, shift_start)
      .input("shift_end", sql.Time, shift_end)
      .input("date_", sql.Date, date_)
      .input("weeksToAdd", sql.Int, currentWeek)
      .query(`
        INSERT INTO staff_schedule (userID, shift_type, shift_start, shift_end, date_)
        VALUES (
          @userID,
          @shift_type,
          @shift_start,
          @shift_end,
          DATEADD(week, @weeksToAdd, @date_)
        )
      `);
  }
}
async function getSchedulesByUserID(userID) {
  if (!userID) throw new Error("Invalid user ID");

  try {
    await poolConnect;
    const result = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(`
        SELECT * FROM staff_schedule
        WHERE userID = @userID AND date_ >= CAST(GETDATE() AS DATE)
        ORDER BY date_ ASC
      `);
    return result.recordset;
  } catch (err) {
    console.error("Error fetching schedules:", err);
    throw err;
  }
}
module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createScheduleRepeat,
  getSchedulesByUserID,
};
