-- ==========================================================
-- Database: demo (PeoplePay360 Complete HR & Payroll System)
-- Production-Ready MySQL/MariaDB Schema
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bank_accounts`;
DROP TABLE IF EXISTS `payslips`;
DROP TABLE IF EXISTS `payrolls`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `contracts`;
DROP TABLE IF EXISTS `salaries`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `companies`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 1. COMPANIES TABLE
-- ----------------------------------------------------------
CREATE TABLE `companies` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `website` VARCHAR(150) DEFAULT NULL,
  `tax_id` VARCHAR(50) DEFAULT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. ROLES & PERMISSIONS
-- ----------------------------------------------------------
CREATE TABLE `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. USERS TABLE
-- ----------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED DEFAULT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'hr', 'payroll', 'employee') NOT NULL DEFAULT 'employee',
  `refresh_token` TEXT DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expires` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. EMPLOYEES TABLE
-- ----------------------------------------------------------
CREATE TABLE `employees` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED DEFAULT NULL,
  `user_id` INT UNSIGNED UNIQUE,
  `employee_code` VARCHAR(20) NOT NULL UNIQUE,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(20) DEFAULT NULL,
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(50) NOT NULL,
  `joining_date` DATE NOT NULL,
  `status` ENUM('active', 'probation', 'inactive', 'terminated') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. SALARIES / CONTRACTS TABLE
-- ----------------------------------------------------------
CREATE TABLE `contracts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `contract_type` ENUM('full_time', 'part_time', 'contract') NOT NULL DEFAULT 'full_time',
  `base_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `hra_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `transport_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `other_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_deduction_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM('active', 'expired', 'terminated') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alias view for salary compatibility
CREATE OR REPLACE VIEW `salaries` AS SELECT * FROM `contracts`;

-- ----------------------------------------------------------
-- 6. ATTENDANCE TABLE
-- ----------------------------------------------------------
CREATE TABLE `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `check_in` TIME DEFAULT NULL,
  `check_out` TIME DEFAULT NULL,
  `total_hours` DECIMAL(4,2) DEFAULT 0.00,
  `status` ENUM('present', 'absent', 'half_day', 'on_leave') NOT NULL DEFAULT 'present',
  `notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_emp_date` (`employee_id`, `date`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. LEAVE REQUESTS TABLE
-- ----------------------------------------------------------
CREATE TABLE `leave_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `leave_type` ENUM('casual', 'sick', 'paid', 'unpaid', 'maternity', 'emergency') NOT NULL DEFAULT 'casual',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_days` INT UNSIGNED NOT NULL DEFAULT 1,
  `reason` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `approved_by_user_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. PAYROLLS TABLE
-- ----------------------------------------------------------
CREATE TABLE `payrolls` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period_month` TINYINT UNSIGNED NOT NULL,
  `period_year` SMALLINT UNSIGNED NOT NULL,
  `status` ENUM('draft', 'processing', 'approved', 'paid') NOT NULL DEFAULT 'draft',
  `total_gross_pay` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_net_pay` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `approved_by_user_id` INT UNSIGNED DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_period` (`period_month`, `period_year`),
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. PAYSLIPS TABLE
-- ----------------------------------------------------------
CREATE TABLE `payslips` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `payroll_id` INT UNSIGNED NOT NULL,
  `employee_id` INT UNSIGNED NOT NULL,
  `contract_id` INT UNSIGNED NOT NULL,
  `working_days` TINYINT UNSIGNED NOT NULL DEFAULT 30,
  `present_days` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `paid_leave_days` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `unpaid_leave_days` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `base_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `allowances_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `gross_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `unpaid_deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `net_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
  `payment_date` DATE DEFAULT NULL,
  `email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_payroll_emp` (`payroll_id`, `employee_id`),
  FOREIGN KEY (`payroll_id`) REFERENCES `payrolls`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 10. BANK ACCOUNTS TABLE
-- ----------------------------------------------------------
CREATE TABLE `bank_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL,
  `account_number` VARCHAR(50) NOT NULL,
  `ifsc_code` VARCHAR(30) DEFAULT NULL,
  `account_type` ENUM('savings', 'checking', 'salary') DEFAULT 'salary',
  `is_primary` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 11. PAYMENTS TABLE
-- ----------------------------------------------------------
CREATE TABLE `payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `payroll_id` INT UNSIGNED DEFAULT NULL,
  `employee_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('bank_transfer', 'cheque', 'cash', 'upi') NOT NULL DEFAULT 'bank_transfer',
  `transaction_ref` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'completed',
  `payment_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`payroll_id`) REFERENCES `payrolls`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 12. NOTIFICATIONS TABLE
-- ----------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('info', 'warning', 'success', 'payroll', 'leave') DEFAULT 'info',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 13. SETTINGS TABLE
-- ----------------------------------------------------------
CREATE TABLE `settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `company_id` INT UNSIGNED DEFAULT NULL,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA
-- ==========================================================

INSERT INTO `companies` (`id`, `name`, `email`, `phone`, `address`, `currency`) VALUES
(1, 'PeoplePay360 Technologies', 'contact@peoplepay360.com', '+1 (555) 019-2834', '100 Innovation Way, Suite 400', 'USD');

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Full system administrator access'),
(2, 'hr', 'Human resources manager'),
(3, 'payroll', 'Payroll and finance manager'),
(4, 'employee', 'Standard employee');

INSERT INTO `users` (`id`, `company_id`, `email`, `password_hash`, `role`) VALUES
(1, 1, 'admin@peoplepay360.com', 'hash_admin123', 'admin'),
(2, 1, 'hr@peoplepay360.com', 'hash_hr123', 'hr'),
(3, 1, 'payroll@peoplepay360.com', 'hash_payroll123', 'payroll'),
(4, 1, 'alex.johnson@peoplepay360.com', 'hash_emp123', 'employee'),
(5, 1, 'sarah.miller@peoplepay360.com', 'hash_emp123', 'employee'),
(6, 1, 'jaysantoki786@gmail.com', 'hash_admin123', 'admin'),
(7, 1, 'rahul.patel@peoplepay360.com', 'hash_password123', 'payroll'),
(8, 1, 'amit.shah@peoplepay360.com', 'hash_password123', 'hr'),
(9, 1, 'neha.patel@peoplepay360.com', 'hash_password123', 'payroll'),
(10, 1, 'priya.shah@peoplepay360.com', 'hash_password123', 'employee'),
(11, 1, 'karan.mehta@peoplepay360.com', 'hash_password123', 'admin');

INSERT INTO `employees` (`id`, `company_id`, `user_id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `department`, `designation`, `joining_date`, `status`) VALUES
(1, 1, 4, 'EMP-1001', 'Alex', 'Johnson', 'alex.johnson@peoplepay360.com', '+1234567890', 'Engineering', 'Senior Developer', '2025-01-15', 'active'),
(2, 1, 5, 'EMP-1002', 'Sarah', 'Miller', 'sarah.miller@peoplepay360.com', '+1987654321', 'Marketing', 'Marketing Lead', '2025-03-01', 'active'),
(3, 1, 7, 'EMP-1003', 'Rahul', 'Patel', 'rahul.patel@peoplepay360.com', '+1555019283', 'Finance', 'HR Payroll Manager', '2024-06-01', 'active'),
(4, 1, 8, 'EMP-1004', 'Amit', 'Shah', 'amit.shah@peoplepay360.com', '+1555019284', 'Human Resources', 'HR Manager', '2024-05-15', 'active'),
(5, 1, 10, 'EMP-1005', 'Priya', 'Shah', 'priya.shah@peoplepay360.com', '+1555019285', 'Engineering', 'Software Engineer', '2025-02-01', 'active');

INSERT INTO `bank_accounts` (`employee_id`, `bank_name`, `account_number`, `ifsc_code`, `account_type`, `is_primary`) VALUES
(1, 'Chase Bank', '9876543210', 'CHASUS33', 'salary', 1),
(2, 'Bank of America', '1234567899', 'BOFAUS3N', 'salary', 1);

INSERT INTO `contracts` (`id`, `employee_id`, `contract_type`, `base_salary`, `hra_allowance`, `transport_allowance`, `other_allowance`, `tax_deduction_rate`, `start_date`, `status`) VALUES
(1, 1, 'full_time', 5000.00, 1000.00, 300.00, 200.00, 10.00, '2025-01-15', 'active'),
(2, 2, 'full_time', 4500.00, 800.00, 250.00, 150.00, 10.00, '2025-03-01', 'active');

INSERT INTO `attendance` (`employee_id`, `date`, `check_in`, `check_out`, `total_hours`, `status`) VALUES
(1, '2026-09-01', '09:00:00', '18:00:00', 9.00, 'present'),
(1, '2026-09-02', '09:15:00', '18:15:00', 9.00, 'present'),
(2, '2026-09-01', '09:00:00', '17:30:00', 8.50, 'present'),
(2, '2026-09-02', '09:00:00', '18:00:00', 9.00, 'present');

INSERT INTO `leave_requests` (`id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`, `approved_by_user_id`) VALUES
(1, 1, 'casual', '2026-09-10', '2026-09-11', 2, 'Family function', 'approved', 2),
(2, 2, 'sick', '2026-09-15', '2026-09-15', 1, 'Doctor appointment', 'pending', NULL);

INSERT INTO `payrolls` (`id`, `period_month`, `period_year`, `status`, `total_gross_pay`, `total_deductions`, `total_net_pay`, `approved_by_user_id`, `paid_at`) VALUES
(1, 8, 2026, 'paid', 12200.00, 1220.00, 10980.00, 3, '2026-08-31 10:00:00');

INSERT INTO `payslips` (`id`, `payroll_id`, `employee_id`, `contract_id`, `working_days`, `present_days`, `paid_leave_days`, `unpaid_leave_days`, `base_salary`, `allowances_total`, `gross_salary`, `tax_deductions`, `unpaid_deductions`, `total_deductions`, `net_salary`, `payment_status`, `payment_date`, `email_sent`) VALUES
(1, 1, 1, 1, 30, 28, 2, 0, 5000.00, 1500.00, 6500.00, 650.00, 0.00, 650.00, 5850.00, 'paid', '2026-08-31', 1),
(2, 1, 2, 2, 30, 30, 0, 0, 4500.00, 1200.00, 5700.00, 570.00, 0.00, 570.00, 5130.00, 'paid', '2026-08-31', 1);

INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`) VALUES
(4, 'Payslip Generated', 'Your August 2026 payslip is ready for download.', 'payroll'),
(2, 'Leave Request', 'Alex Johnson submitted a leave request for 2 days.', 'leave');

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('company_name', 'PeoplePay360 Technologies'),
('working_days_per_month', '30'),
('default_currency', 'USD'),
('tax_rate_default', '10');
