const { pool, poolConnect, sql } = require("../database");

async function getAllContacts() {
  await poolConnect;
  const result = await pool.request().query("SELECT * FROM emergency_contact");
  return result.recordset;
}

async function getContactById(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM emergency_contact WHERE emergency_contact_ID = @id");
  return result.recordset[0];
}

async function createContact(first_name, last_name, date_of_birth, gender, phone, address, email) {
  await poolConnect;
  const result = await pool
    .request()
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("phone", sql.VarChar(255), phone)
    .input("address", sql.VarChar(255), address)
    .input("email", sql.VarChar(255), email)
    .query(`
      INSERT INTO emergency_contact (first_name, last_name, date_of_birth, gender, phone, address_, email)
      VALUES (@first_name, @last_name, @date_of_birth, @gender, @phone, @address, @email)
    `);
  return result;
}

async function updateContact(emergency_contact_ID, first_name, last_name, date_of_birth, gender, phone, address, email) {
  await poolConnect;
  const result = await pool
    .request()
    .input("emergency_contact_ID", sql.Int, emergency_contact_ID)
    .input("first_name", sql.VarChar(255), first_name)
    .input("last_name", sql.VarChar(255), last_name)
    .input("date_of_birth", sql.Date, date_of_birth)
    .input("gender", sql.VarChar(255), gender)
    .input("phone", sql.VarChar(255), phone)
    .input("address", sql.VarChar(255), address)
    .input("email", sql.VarChar(255), email)
    .query(`
      UPDATE emergency_contact
      SET first_name = @first_name, last_name = @last_name, date_of_birth = @date_of_birth, gender = @gender, phone = @phone, address_ = @address, email = @email
      WHERE emergency_contact_ID = @emergency_contact_ID
    `);
  return result;
}

async function deleteContact(id) {
  await poolConnect;
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM emergency_contact WHERE emergency_contact_ID = @id");
  return result;
}

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
