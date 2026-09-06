import pool from './db.js';

export async function migrateMissingTables() {
  console.log('Checking and migrating missing tables...');

  // 1. schedules table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`schedules\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(100) NOT NULL,
      \`type\` ENUM('full_time', 'part_time', 'shift', 'flexible') NOT NULL DEFAULT 'full_time',
      \`weekly_hours\` DECIMAL(4,1) NOT NULL DEFAULT 40.0,
      \`pattern\` JSON DEFAULT NULL,
      \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. salary_structures table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`salary_structures\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(150) NOT NULL,
      \`description\` TEXT DEFAULT NULL,
      \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 3. salary_rules table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`salary_rules\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`structure_id\` INT UNSIGNED DEFAULT NULL,
      \`name\` VARCHAR(150) NOT NULL,
      \`code\` VARCHAR(50) NOT NULL,
      \`category\` VARCHAR(50) NOT NULL DEFAULT 'basic',
      \`sequence\` INT NOT NULL DEFAULT 1,
      \`calculation_type\` VARCHAR(50) NOT NULL DEFAULT 'fixed',
      \`value\` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
      \`base_rule\` VARCHAR(50) DEFAULT NULL,
      \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (\`structure_id\`) REFERENCES \`salary_structures\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 4. leave_types table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`leave_types\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(100) NOT NULL,
      \`unit\` ENUM('days', 'hours') NOT NULL DEFAULT 'days',
      \`requires_approval\` TINYINT(1) NOT NULL DEFAULT 1,
      \`requires_allocation\` TINYINT(1) NOT NULL DEFAULT 1,
      \`payroll_integration\` TINYINT(1) NOT NULL DEFAULT 1,
      \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 5. leave_allocations table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS \`leave_allocations\` (
      \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      \`employee_id\` INT UNSIGNED NOT NULL,
      \`leave_type_id\` INT UNSIGNED NOT NULL,
      \`allocated\` INT UNSIGNED NOT NULL DEFAULT 0,
      \`taken\` INT UNSIGNED NOT NULL DEFAULT 0,
      \`remaining\` INT UNSIGNED NOT NULL DEFAULT 0,
      \`valid_from\` DATE NOT NULL,
      \`valid_to\` DATE NOT NULL,
      \`status\` ENUM('active', 'expired') NOT NULL DEFAULT 'active',
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE CASCADE,
      FOREIGN KEY (\`leave_type_id\`) REFERENCES \`leave_types\`(\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default schedules if empty
  const [schedules] = await pool.query('SELECT COUNT(*) as cnt FROM schedules');
  if (schedules[0].cnt === 0) {
    await pool.query(`
      INSERT INTO \`schedules\` (\`id\`, \`name\`, \`type\`, \`weekly_hours\`, \`pattern\`, \`status\`) VALUES
      (1, 'Standard Full-Time (40h)', 'full_time', 40.0, '{"Monday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Tuesday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Wednesday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Thursday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Friday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active'),
      (2, 'Engineering Flex Shift (40h)', 'shift', 40.0, '{"Monday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Tuesday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Wednesday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Thursday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Friday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active'),
      (3, 'Part-Time Morning (20h)', 'part_time', 20.0, '{"Monday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Tuesday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Wednesday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Thursday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Friday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active');
    `);
    console.log('Seeded schedules.');
  }

  // Seed default salary structures if empty
  const [structs] = await pool.query('SELECT COUNT(*) as cnt FROM salary_structures');
  if (structs[0].cnt === 0) {
    await pool.query(`
      INSERT INTO \`salary_structures\` (\`id\`, \`name\`, \`description\`, \`status\`) VALUES
      (1, 'Standard Regular Structure', 'Standard compensation structure for full-time employees including HRA, TA & PF', 'active'),
      (2, 'Executive Leadership Structure', 'Specialized structure for department leads and senior management with performance bonus', 'active');
    `);
    console.log('Seeded salary_structures.');
  }

  // Seed default salary rules if empty
  const [rules] = await pool.query('SELECT COUNT(*) as cnt FROM salary_rules');
  if (rules[0].cnt === 0) {
    await pool.query(`
      INSERT INTO \`salary_rules\` (\`id\`, \`structure_id\`, \`name\`, \`code\`, \`category\`, \`sequence\`, \`calculation_type\`, \`value\`, \`base_rule\`, \`status\`) VALUES
      (1, 1, 'Basic Salary', 'BASIC', 'basic', 1, 'fixed', 50000.00, NULL, 'active'),
      (2, 1, 'House Rent Allowance', 'HRA', 'allowance', 2, 'percentage', 20.00, 'BASIC', 'active'),
      (3, 1, 'Transport Allowance', 'TA', 'allowance', 3, 'fixed', 4000.00, NULL, 'active'),
      (4, 1, 'Provident Fund', 'PF', 'deduction', 4, 'percentage', 12.00, 'BASIC', 'active'),
      (5, 1, 'Net Salary', 'NET', 'net', 99, 'formula', 0.00, 'GROSS - DEDUCTION', 'active'),
      (6, 2, 'Performance Bonus', 'BONUS', 'allowance', 5, 'fixed', 8000.00, NULL, 'active');
    `);
    console.log('Seeded salary_rules.');
  }

  // Seed default leave types if empty
  const [ltypes] = await pool.query('SELECT COUNT(*) as cnt FROM leave_types');
  if (ltypes[0].cnt === 0) {
    await pool.query(`
      INSERT INTO \`leave_types\` (\`id\`, \`name\`, \`unit\`, \`requires_approval\`, \`requires_allocation\`, \`payroll_integration\`, \`status\`) VALUES
      (1, 'Paid Vacation Leave', 'days', 1, 1, 1, 'active'),
      (2, 'Sick Leave', 'days', 1, 1, 1, 'active'),
      (3, 'Casual Leave', 'days', 1, 1, 1, 'active'),
      (4, 'Maternity / Paternity Leave', 'days', 1, 1, 1, 'active'),
      (5, 'Unpaid Leave (LWP)', 'days', 1, 0, 1, 'active');
    `);
    console.log('Seeded leave_types.');
  }

  // Seed default leave allocations if empty
  const [lallocs] = await pool.query('SELECT COUNT(*) as cnt FROM leave_allocations');
  if (lallocs[0].cnt === 0) {
    const [employees] = await pool.query('SELECT id FROM employees');
    for (const emp of employees) {
      await pool.query(`
        INSERT INTO \`leave_allocations\` (\`employee_id\`, \`leave_type_id\`, \`allocated\`, \`taken\`, \`remaining\`, \`valid_from\`, \`valid_to\`, \`status\`) VALUES
        (?, 1, 20, 2, 18, '2026-01-01', '2026-12-31', 'active'),
        (?, 2, 12, 1, 11, '2026-01-01', '2026-12-31', 'active')
      `, [emp.id, emp.id]);
    }
    console.log('Seeded leave_allocations for active employees.');
  }

  // 6. Ensure contracts table has structure_id column and allows draft status
  const [contractCols] = await pool.query("SHOW COLUMNS FROM contracts LIKE 'structure_id'");
  if (contractCols.length === 0) {
    await pool.query('ALTER TABLE contracts ADD COLUMN structure_id INT UNSIGNED DEFAULT NULL AFTER employee_id');
    await pool.query('UPDATE contracts SET structure_id = 1 WHERE structure_id IS NULL');
    console.log('Added structure_id column to contracts.');
  }
  await pool.query("ALTER TABLE contracts MODIFY COLUMN status ENUM('active','draft','expired','terminated') NOT NULL DEFAULT 'active'");

  // 7. Ensure leave_requests accepts dynamic leave types without truncation
  try {
    await pool.query("ALTER TABLE leave_requests MODIFY COLUMN leave_type VARCHAR(60) NOT NULL DEFAULT 'casual'");
    console.log('Ensured leave_requests.leave_type accepts dynamic leave types.');
  } catch (err) {
    console.warn('leave_requests alter warning:', err.message);
  }

  console.log('✅ Missing tables migration completed successfully.');
}

if (process.argv[1] && process.argv[1].includes('migrate_missing_tables.js')) {
  migrateMissingTables()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
