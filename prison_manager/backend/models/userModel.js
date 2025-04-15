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
  } = user;

  await poolConnect;
  const result = await pool
    .request()
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("phone", sql.VarChar(255), phone)
    .input("address_", sql.VarChar(255), address_)
    .input("email", sql.VarChar(255), email)
    .input("username", sql.VarChar(255), username)
    .input("password_", sql.VarChar(255), password_)
    .input("photo", sql.VarChar(255), photo)
    .input("roleID", sql.Int, roleID)
    .query(
      `INSERT INTO users 
        (first_name, last_name, date_of_birth, gender, phone, address_, email, username, password_, photo, roleID) 
       VALUES 
        (@first_name, @last_name, @date_of_birth, @gender, @phone, @address_, @email, @username, @password_, @photo, @roleID)`
    );
  return result;
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
    password_,
    photo,
    roleID,
  } = user;

  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("phone", sql.VarChar(255), phone)
    .input("address_", sql.VarChar(255), address_)
    .input("email", sql.VarChar(255), email)
    .input("username", sql.VarChar(255), username)
    .input("password_", sql.VarChar(255), password_)
    .input("photo", sql.VarChar(255), photo)
    .input("roleID", sql.Int, roleID)
    .query(
      `UPDATE users SET 
        first_name = @first_name,
        last_name = @last_name,
        date_of_birth = @date_of_birth,
        gender = @gender,
        phone = @phone,
        address_ = @address_,
        email = @email,
        username = @username,
        password_ = @password_,
        photo = @photo,
        roleID = @roleID
       WHERE userID = @id`
    );
  return result;
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
