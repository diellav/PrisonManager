require('dotenv').config();
const sql = require('mssql');

console.log("DB_SERVER:", process.env.DB_USER);

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,  
    password: process.env.DB_PASSWORD,  
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true',
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true'
    }
};

async function connectDB() {
  try {
    let pool = await sql.connect(config);
    console.log(' Connected to the database successfully!');
    return pool;
  } catch (err) {
    console.error(' Database connection error:', err);
  }
}

module.exports = { connectDB };
