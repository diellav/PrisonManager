require('dotenv').config({ path: '../.env' });
const { connectDB } = require('./database');

async function fetchData() {
  try {
    const pool = await connectDB();
    if (!pool) {
      throw new Error("Database connection failed!");
    }
    
    const result = await pool.request().query("SELECT * FROM roles");
    console.log("Results:", result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
