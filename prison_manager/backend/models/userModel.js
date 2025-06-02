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
    kitchen_role,
    maintenance_role, 
    guard_position,
    specialty,
    employment_date,
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
  .input("employment_date", sql.Date, employment_date)
  .query(`
    INSERT INTO users 
      (first_name, last_name, date_of_birth, gender, phone, address_, email, username, password_, photo, roleID, employment_date)
    VALUES 
      (@first_name, @last_name, @date_of_birth, @gender, @phone, @address_, @email, @username, @password_, @photo, @roleID,@employment_date);
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
  if (roleName.includes("kitchen")) {
    await pool
      .request()
      .input("userID", sql.Int, insertedUserID)
      .input("kitchen_role", sql.VarChar(255), String(kitchen_role || ""))
      .query("INSERT INTO kitchen_staff (userID, kitchen_role) VALUES (@userID, @kitchen_role)");
  }
  if (roleName.includes("maintenance")) {
    await pool
      .request()
      .input("userID", sql.Int, insertedUserID)
      .input("maintenance_role", sql.VarChar(255), String(maintenance_role || ""))
      .query("INSERT INTO maintenance_staff (userID, maintenance_role) VALUES (@userID, @maintenance_role)");
  }
  if (roleName.includes("guard")) {
    await pool
      .request()
      .input("userID", sql.Int, insertedUserID)
      .input("guard_position", sql.VarChar(255), String(guard_position || ""))
      .query("INSERT INTO guard_staff (userID, guard_position) VALUES (@userID, @guard_position)");
  }
  if (roleName.includes("medical")) {
    await pool
      .request()
      .input("userID", sql.Int, insertedUserID)
      .input("specialty", sql.VarChar(255), String(specialty || ""))
      .query("INSERT INTO medical_staff (userID, specialty) VALUES (@userID, @specialty)");
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
    transport_role,
    kitchen_role, 
    maintenance_role,
    guard_position,
    specialty,
    employment_date,
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
      roleID = @roleID,
      employment_date=@employment_date
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
    .input("roleID", sql.Int, roleID)
    .input("employment_date", sql.Date, employment_date);

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

  
   if (roleName.includes("kitchen")) {
    const existResult = await pool
      .request()
      .input("userID", sql.Int, id)
      .query("SELECT * FROM kitchen_staff WHERE userID = @userID");

    if (existResult.recordset.length > 0) {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("kitchen_role", sql.VarChar(255), String(kitchen_role || ""))
        .query("UPDATE kitchen_staff SET kitchen_role = @kitchen_role WHERE userID = @userID");
    } else {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("kitchen_role", sql.VarChar(255), String(kitchen_role || ""))
        .query("INSERT INTO kitchen_staff (userID, kitchen_role) VALUES (@userID, @kitchen_role)");
    }
  } else {
    await pool
      .request()
      .input("userID", sql.Int, id)
      .query("DELETE FROM kitchen_staff WHERE userID = @userID");
  }


  if (roleName.includes("maintenance")) {
    const existResult = await pool
      .request()
      .input("userID", sql.Int, id)
      .query("SELECT * FROM maintenance_staff WHERE userID = @userID");

    if (existResult.recordset.length > 0) {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("maintenance_role", sql.VarChar(255), String(maintenance_role || ""))
        .query("UPDATE maintenance_staff SET maintenance_role = @maintenance_role WHERE userID = @userID");
    } else {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("maintenance_role", sql.VarChar(255), String(maintenance_role || ""))
        .query("INSERT INTO maintenance_staff (userID, maintenance_role) VALUES (@userID, @maintenance_role)");
    }
  } else {
    await pool
      .request()
      .input("userID", sql.Int, id)
      .query("DELETE FROM maintenance_staff WHERE userID = @userID");
  }


  if (roleName.includes("guard")) {
    const existResult = await pool
      .request()
      .input("userID", sql.Int, id)
      .query("SELECT * FROM guard_staff WHERE userID = @userID");

    if (existResult.recordset.length > 0) {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("guard_position", sql.VarChar(255), String(guard_position || ""))
        .query("UPDATE guard_staff SET guard_position = @guard_position WHERE userID = @userID");
    } else {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("guard_position", sql.VarChar(255), String(guard_position || ""))
        .query("INSERT INTO guard_staff (userID, guard_position) VALUES (@userID, @guard_position)");
    }
  } else {
    await pool
      .request()
      .input("userID", sql.Int, id)
      .query("DELETE FROM guard_staff WHERE userID = @userID");
  }


  if (roleName.includes("medical")) {
    const existResult = await pool
      .request()
      .input("userID", sql.Int, id)
      .query("SELECT * FROM medical_staff WHERE userID = @userID");

    if (existResult.recordset.length > 0) {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("specialty", sql.VarChar(255), String(specialty || ""))
        .query("UPDATE medical_staff SET specialty = @specialty WHERE userID = @userID");
    } else {
      await pool
        .request()
        .input("userID", sql.Int, id)
        .input("specialty", sql.VarChar(255), String(specialty || ""))
        .query("INSERT INTO medical_staff (userID, specialty) VALUES (@userID, @specialty)");
    }
  } else {
    await pool
      .request()
      .input("userID", sql.Int, id)
      .query("DELETE FROM medical_staff WHERE userID = @userID");
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