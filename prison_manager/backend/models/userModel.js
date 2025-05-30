const { pool, poolConnect, sql } = require("../database");
async function getAllUsers() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM users");
  return result.recordset;
}
async function getUserById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM users WHERE userID = @id");
  return result.recordset[0];
}

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
async function createUser(user) {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    address_,
    email,
    username,
    password_,
    photo,
    roleID,
    transport_role,
  } = user;

  const hashedPassword = await bcrypt.hash(password_, SALT_ROUNDS);
  await poolConnect;
 const insertResult = await pool
  .request()
  .input("first_name", sql.VarChar(255), first_name)
  .input("last_name", sql.VarChar(255), last_name)
  .input("date_of_birth", sql.Date, date_of_birth)
  .input("gender", sql.VarChar(255), gender)
  .input("phone", sql.VarChar(255), phone)
  .input("address_", sql.VarChar(255), address_)
  .input("email", sql.VarChar(255), email)
  .input("username", sql.VarChar(255), username)
  .input("password_", sql.VarChar(255), hashedPassword)
  .input("photo", sql.VarChar(255), photo)
  .input("roleID", sql.Int, roleID)
  .query(`
    INSERT INTO users 
      (first_name, last_name, date_of_birth, gender, phone, address_, email, username, password_, photo, roleID)
    VALUES 
      (@first_name, @last_name, @date_of_birth, @gender, @phone, @address_, @email, @username, @password_, @photo, @roleID);
    SELECT SCOPE_IDENTITY() AS userID;
  `);

const insertedUserID = insertResult.recordset[0].userID;
  const roleNameResult = await pool
    .request()
    .input("roleID", sql.Int, roleID)
    .query("SELECT name_ FROM roles WHERE roleID = @roleID");

  const roleName = roleNameResult.recordset[0]?.name_.toLowerCase();
  if (roleName.includes("transport")) {
    await pool
      .request()
      .input("userID", sql.Int, insertedUserID)
      .input("transport_role", sql.VarChar(255),  String(transport_role || ""))
      .query("INSERT INTO transport_staff (userID, transport_role) VALUES (@userID, @transport_role)");
  }

  return { success: true, userID: insertedUserID };
}

async function updateUser(id, user) {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    address_,
    email,
    username,
    photo,
    roleID,
    transport_role
  } = user;

  await poolConnect;

  let query = `
    UPDATE users SET
      first_name = @first_name,
      last_name = @last_name,
      date_of_birth = @date_of_birth,
      gender = @gender,
      phone = @phone,
      address_ = @address_,
      email = @email,
      username = @username,
      roleID = @roleID
  `;

  if (photo !== undefined && photo !== null) {
    query += `, photo = @photo`;
  }
  query += ` WHERE userID = @id`;

  const request = pool.request()
    .input("id", sql.Int, id)
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("phone", sql.VarChar(255), phone)
    .input("address_", sql.VarChar(255), address_)
    .input("email", sql.VarChar(255), email)
    .input("username", sql.VarChar(255), username)
    .input("roleID", sql.Int, roleID);

  if (photo !== undefined && photo !== null) {
    request.input("photo", sql.VarChar(255), photo);
  }

  await request.query(query);

  const roleNameResult = await pool
    .request()
    .input("roleID", sql.Int, roleID)
    .query("SELECT name_ FROM roles WHERE roleID = @roleID");

  const roleName = roleNameResult.recordset[0]?.name_.toLowerCase() || "";

  if (roleName.includes("transport")) {
    const existResult = await pool
      .request()
      .input("userID", sql.Int, id)
      .query("SELECT * FROM transport_staff WHERE userID = @userID");

    if (existResult.recordset.length > 0) {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("transport_role", sql.VarChar(255), String(transport_role || ""))
        .query("UPDATE transport_staff SET transport_role = @transport_role WHERE userID = @userID");
    } else {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("transport_role", sql.VarChar(255), String(transport_role || ""))
        .query("INSERT INTO transport_staff (userID, transport_role) VALUES (@userID, @transport_role)");
    }
  } else {
    await pool
      .request()
      .input("userID", sql.Int, id)
      .query("DELETE FROM transport_staff WHERE userID = @userID");
  }
  return { success: true };
}


async function deleteUser(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM users WHERE userID = @id");
  return result;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};