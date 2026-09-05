-- ==========================================================
-- Database: demo (PeoplePay360 HR & Payroll Platform)
-- Simple, Clean, Normalized & Production-Ready MySQL/MariaDB Schema
-- ==========================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payslips`;
DROP TABLE IF EXISTS `payrolls`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `contracts`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 1. USERS TABLE (Authentication & Role Management)
-- Roles: admin, hr, payroll, employee
-- ----------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'hr', 'payroll', 'employee') NOT NULL DEFAULT 'employee',
  `refresh_token` TEXT DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expires` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. EMPLOYEES TABLE (Personal, Job & Bank Info)
-- ----------------------------------------------------------
CREATE TABLE `employees` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED UNIQUE,
  `employee_code` VARCHAR(20) NOT NULL UNIQUE,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `department` VARCHAR(50) NOT NULL,
  `designation` VARCHAR(50) NOT NULL,
  `joining_date` DATE NOT NULL,
  `status` ENUM('active', 'probation', 'inactive') NOT NULL DEFAULT 'active',
  `bank_name` VARCHAR(100),
  `bank_account_no` VARCHAR(50),
  `bank_ifsc_code` VARCHAR(30),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. CONTRACTS TABLE (Base Salary & Allowances)
-- ----------------------------------------------------------
CREATE TABLE `contracts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `contract_type` ENUM('full_time', 'part_time', 'contract') NOT NULL DEFAULT 'full_time',
  `base_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `hra_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `transport_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `other_allowance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax_deduction_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- e.g. 10.00 for 10%
  `start_date` DATE NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `status` ENUM('active', 'expired', 'terminated') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. ATTENDANCE TABLE (Daily Work Logging)
-- ----------------------------------------------------------
CREATE TABLE `attendance` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `check_in` TIME DEFAULT NULL,
  `check_out` TIME DEFAULT NULL,
  `total_hours` DECIMAL(4,2) DEFAULT 0.00,
  `status` ENUM('present', 'absent', 'half_day', 'on_leave') NOT NULL DEFAULT 'present',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_emp_date` (`employee_id`, `date`),
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. LEAVE REQUESTS TABLE (Leave Management & HR Approval)
-- ----------------------------------------------------------
CREATE TABLE `leave_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `leave_type` ENUM('casual', 'sick', 'paid', 'unpaid') NOT NULL DEFAULT 'casual',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `total_days` INT UNSIGNED NOT NULL DEFAULT 1,
  `reason` TEXT,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `approved_by_user_id` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. PAYROLLS TABLE (Monthly Payroll Cycles)
-- ----------------------------------------------------------
CREATE TABLE `payrolls` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `period_month` TINYINT UNSIGNED NOT NULL, -- 1 to 12
  `period_year` SMALLINT UNSIGNED NOT NULL, -- e.g. 2026
  `status` ENUM('draft', 'approved', 'paid') NOT NULL DEFAULT 'draft',
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
-- 7. PAYSLIPS TABLE (Itemized Salary & Calculation Breakdown)
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

-- ==========================================================
-- 8. SAMPLE SEED DATA (Ready to Test & Demo)
-- ==========================================================

-- Users
INSERT INTO `users` (`id`, `email`, `password_hash`, `role`) VALUES
(1, 'admin@peoplepay360.com', 'hash_admin123', 'admin'),
(2, 'hr@peoplepay360.com', 'hash_hr123', 'hr'),
(3, 'payroll@peoplepay360.com', 'hash_payroll123', 'payroll'),
(4, 'alex.johnson@peoplepay360.com', 'hash_emp123', 'employee'),
(5, 'sarah.miller@peoplepay360.com', 'hash_emp123', 'employee');

-- Employees
INSERT INTO `employees` (`id`, `user_id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `department`, `designation`, `joining_date`, `status`, `bank_name`, `bank_account_no`, `bank_ifsc_code`) VALUES
(1, 4, 'EMP-1001', 'Alex', 'Johnson', 'alex.johnson@peoplepay360.com', '+1234567890', 'Engineering', 'Senior Developer', '2025-01-15', 'active', 'Chase Bank', '9876543210', 'CHASUS33'),
(2, 5, 'EMP-1002', 'Sarah', 'Miller', 'sarah.miller@peoplepay360.com', '+1987654321', 'Marketing', 'Marketing Lead', '2025-03-01', 'active', 'Bank of America', '1234567899', 'BOFAUS3N');

-- Contracts
INSERT INTO `contracts` (`id`, `employee_id`, `contract_type`, `base_salary`, `hra_allowance`, `transport_allowance`, `other_allowance`, `tax_deduction_rate`, `start_date`, `status`) VALUES
(1, 1, 'full_time', 5000.00, 1000.00, 300.00, 200.00, 10.00, '2025-01-15', 'active'),
(2, 2, 'full_time', 4500.00, 800.00, 250.00, 150.00, 10.00, '2025-03-01', 'active');

-- Attendance
INSERT INTO `attendance` (`employee_id`, `date`, `check_in`, `check_out`, `total_hours`, `status`) VALUES
(1, '2026-09-01', '09:00:00', '18:00:00', 9.00, 'present'),
(1, '2026-09-02', '09:15:00', '18:15:00', 9.00, 'present'),
(2, '2026-09-01', '09:00:00', '17:30:00', 8.50, 'present'),
(2, '2026-09-02', '09:00:00', '18:00:00', 9.00, 'present');

-- Leave Requests
INSERT INTO `leave_requests` (`id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`, `approved_by_user_id`) VALUES
(1, 1, 'casual', '2026-09-10', '2026-09-11', 2, 'Family function', 'approved', 2),
(2, 2, 'sick', '2026-09-15', '2026-09-15', 1, 'Doctor appointment', 'pending', NULL);

-- Payroll Cycle
INSERT INTO `payrolls` (`id`, `period_month`, `period_year`, `status`, `total_gross_pay`, `total_deductions`, `total_net_pay`, `approved_by_user_id`, `paid_at`) VALUES
(1, 8, 2026, 'paid', 12200.00, 1220.00, 10980.00, 3, '2026-08-31 10:00:00');

-- Payslips
INSERT INTO `payslips` (`id`, `payroll_id`, `employee_id`, `contract_id`, `working_days`, `present_days`, `paid_leave_days`, `unpaid_leave_days`, `base_salary`, `allowances_total`, `gross_salary`, `tax_deductions`, `unpaid_deductions`, `total_deductions`, `net_salary`, `payment_status`, `payment_date`, `email_sent`) VALUES
(1, 1, 1, 1, 30, 28, 2, 0, 5000.00, 1500.00, 6500.00, 650.00, 0.00, 650.00, 5850.00, 'paid', '2026-08-31', 1),
(2, 1, 2, 2, 30, 30, 0, 0, 4500.00, 1200.00, 5700.00, 570.00, 0.00, 570.00, 5130.00, 'paid', '2026-08-31', 1);
