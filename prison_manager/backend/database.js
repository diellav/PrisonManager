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

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect(); 

poolConnect
  .then(() => console.log("Connected to the database successfully!"))
  .catch((err) => console.error("Error connecting to database:", err));

module.exports = { pool, poolConnect, sql };
