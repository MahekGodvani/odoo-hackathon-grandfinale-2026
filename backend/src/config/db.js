const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'demo',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Test connection with ES6 arrow function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Connected to MySQL database: ${process.env.DB_NAME ?? 'demo'}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection error:', error?.message ?? error);
  }
};

testConnection();

module.exports = pool;
