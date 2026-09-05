import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  console.log('🔄 Initializing MySQL database for PeoplePay360...');

  const dbHost = process.env.DB_HOST ?? 'localhost';
  const dbUser = process.env.DB_USER ?? 'root';
  const dbPassword = process.env.DB_PASSWORD ?? '';
  const dbName = process.env.DB_NAME ?? 'demo';
  const dbPort = parseInt(process.env.DB_PORT ?? '3306', 10);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort,
      multipleStatements: true
    });

    console.log(`📡 Connected to MySQL at ${dbHost}:${dbPort}`);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`📁 Database \`${dbName}\` is ready.`);

    const schemaPath = path.join(__dirname, '../../schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at ${schemaPath}`);
    }

    const sqlContent = fs.readFileSync(schemaPath, 'utf8');

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

export default initDatabase;
