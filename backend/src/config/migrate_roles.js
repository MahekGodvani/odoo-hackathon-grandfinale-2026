import pool from './db.js';
import bcrypt from 'bcryptjs';

export async function migrateRoles() {
  console.log('🔄 Migrating roles to exact Odoo hackathon specification...');

  // 1. Temporarily allow all enum values on users table to facilitate conversion
  await pool.query(`
    ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'employee';
  `);

  // 2. Clean and synchronize roles table to the EXACT 5 roles from Odoo spec
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('TRUNCATE TABLE role_permissions');
  await pool.query('TRUNCATE TABLE roles');
  
  await pool.query(`
    INSERT INTO roles (id, name, description) VALUES
    (1, 'admin', 'Admin - Full access to all modules and models across the platform; complete system & user administration'),
    (2, 'hr_payroll_manager', 'HR Payroll Manager - All HR Payroll User permissions with full CRUD access to Payruns, Payslips, Salary Structures, and Salary Rules'),
    (3, 'hr_payroll_user', 'HR Payroll User - All HR Manager permissions plus Create, Read, and Update access to Payruns and Payslips; Read-only Salary Structures & Rules'),
    (4, 'hr_manager', 'HR Manager - Full CRUD access to Employees, Attendance, Contracts, Working Schedules, and Time Off; approve/refuse Time Off; no payroll access'),
    (5, 'employee', 'Employee - View own employee details, attendance records, leave balances, payslips; create attendance entries & time off requests');
  `);
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('✅ Roles table synchronized with exact 5 roles.');

  // 3. Map existing users in users table to exact canonical roles
  await pool.query("UPDATE users SET role = 'hr_manager' WHERE role IN ('hr', 'hr_manager', 'HR', 'HR Manager')");
  await pool.query("UPDATE users SET role = 'hr_payroll_manager' WHERE role IN ('payroll', 'payroll_manager', 'HR Payroll Manager') AND email NOT LIKE '%neha%'");
  await pool.query("UPDATE users SET role = 'hr_payroll_user' WHERE email LIKE '%neha%' OR email LIKE '%payroll.user%' OR role = 'HR Payroll User'");
  await pool.query("UPDATE users SET role = 'admin' WHERE role IN ('admin', 'Admin')");
  await pool.query("UPDATE users SET role = 'employee' WHERE role IN ('employee', 'Employee') OR role NOT IN ('admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'employee')");

  // 4. Alter users.role enum to strictly enforce ONLY the 5 Odoo roles
  await pool.query(`
    ALTER TABLE users MODIFY COLUMN role ENUM(
      'admin',
      'hr_payroll_manager',
      'hr_payroll_user',
      'hr_manager',
      'employee'
    ) NOT NULL DEFAULT 'employee';
  `);
  console.log('✅ users.role column enum strictly constrained to 5 roles.');

  // 5. Ensure each of the 5 roles has dedicated, tested demo accounts with bcrypt passwords
  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const hrPasswordHash = await bcrypt.hash('hr123', 10);
  const payrollPasswordHash = await bcrypt.hash('payroll123', 10);
  const empPasswordHash = await bcrypt.hash('emp123', 10);

  // Define representative accounts
  const demoAccounts = [
    { email: 'admin@peoplepay360.com', hash: adminPasswordHash, role: 'admin' },
    { email: 'jaimil.trivedi@peoplepay360.com', hash: defaultPasswordHash, role: 'admin' },
    { email: 'rahul.patel@peoplepay360.com', hash: defaultPasswordHash, role: 'hr_payroll_manager' },
    { email: 'payroll@peoplepay360.com', hash: payrollPasswordHash, role: 'hr_payroll_manager' },
    { email: 'payroll.manager@peoplepay360.com', hash: payrollPasswordHash, role: 'hr_payroll_manager' },
    { email: 'neha.patel@peoplepay360.com', hash: defaultPasswordHash, role: 'hr_payroll_user' },
    { email: 'payroll.user@peoplepay360.com', hash: defaultPasswordHash, role: 'hr_payroll_user' },
    { email: 'amit.shah@peoplepay360.com', hash: defaultPasswordHash, role: 'hr_manager' },
    { email: 'hr@peoplepay360.com', hash: hrPasswordHash, role: 'hr_manager' },
    { email: 'hr.manager@peoplepay360.com', hash: hrPasswordHash, role: 'hr_manager' },
    { email: 'alex.johnson@peoplepay360.com', hash: empPasswordHash, role: 'employee' },
    { email: 'priya.shah@peoplepay360.com', hash: defaultPasswordHash, role: 'employee' }
  ];

  for (const acc of demoAccounts) {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [acc.email]);
    if (existing.length > 0) {
      await pool.query('UPDATE users SET role = ?, password_hash = ? WHERE email = ?', [acc.role, acc.hash, acc.email]);
    } else {
      await pool.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [acc.email, acc.hash, acc.role]);
    }
  }

  console.log('✅ Demo accounts verified and configured for all 5 roles.');
}

if (process.argv[1] && process.argv[1].includes('migrate_roles.js')) {
  migrateRoles()
    .then(() => {
      console.log('🎉 Roles migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Roles migration failed:', err);
      process.exit(1);
    });
}
