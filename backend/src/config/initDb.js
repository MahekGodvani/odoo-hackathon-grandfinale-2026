const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  console.log('🔄 Initializing MySQL database for PeoplePay360...');

  const dbHost = process.env.DB_HOST ?? 'localhost';
  const dbUser = process.env.DB_USER ?? 'root';
  const dbPassword = process.env.DB_PASSWORD ?? '';
  const dbName = process.env.DB_NAME ?? 'demo';
  const dbPort = parseInt(process.env.DB_PORT ?? '3306', 10);

  let connection;
  try {
    // 1. Connect to MySQL server (without specifying DB first to create it if not exists)
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort,
      multipleStatements: true
    });

    console.log(`📡 Connected to MySQL at ${dbHost}:${dbPort}`);

    // 2. Ensure database exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`📁 Database \`${dbName}\` is ready.`);

    // 3. Read schema.sql
    const schemaPath = path.join(__dirname, '../../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

    // 4. Execute all SQL statements
    await connection.query(sqlContent);

    console.log('========================================================');
    console.log('✅ ALL DATABASE TABLES & SAMPLE SEED DATA CREATED SUCCESSFULLY!');
    console.log('========================================================');
    console.log('You can now log in with:');
    console.log('👑 Admin:    admin@peoplepay360.com / admin123');
    console.log('💼 HR:       hr@peoplepay360.com / hr123');
    console.log('💰 Payroll:  payroll@peoplepay360.com / payroll123');
    console.log('👤 Employee: alex.johnson@peoplepay360.com / emp123');
    console.log('========================================================');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
};

initDatabase();
