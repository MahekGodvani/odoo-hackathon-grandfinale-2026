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
DROP TABLE IF EXISTS `leave_allocations`;
DROP TABLE IF EXISTS `leave_types`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `salary_rules`;
DROP TABLE IF EXISTS `salary_structures`;
DROP TABLE IF EXISTS `schedules`;
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

-- ----------------------------------------------------------
-- 14. SCHEDULES TABLE
-- ----------------------------------------------------------
CREATE TABLE `schedules` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('full_time', 'part_time', 'shift', 'flexible') NOT NULL DEFAULT 'full_time',
  `weekly_hours` DECIMAL(4,1) NOT NULL DEFAULT 40.0,
  `pattern` JSON DEFAULT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 15. SALARY STRUCTURES TABLE
-- ----------------------------------------------------------
CREATE TABLE `salary_structures` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 16. SALARY RULES TABLE
-- ----------------------------------------------------------
CREATE TABLE `salary_rules` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `structure_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `category` ENUM('basic', 'allowance', 'deduction', 'net') NOT NULL DEFAULT 'basic',
  `sequence` INT NOT NULL DEFAULT 1,
  `calculation_type` ENUM('fixed', 'percentage', 'formula') NOT NULL DEFAULT 'fixed',
  `value` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `base_rule` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`structure_id`) REFERENCES `salary_structures`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 17. LEAVE TYPES TABLE
-- ----------------------------------------------------------
CREATE TABLE `leave_types` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `unit` ENUM('days', 'hours') NOT NULL DEFAULT 'days',
  `requires_approval` TINYINT(1) NOT NULL DEFAULT 1,
  `requires_allocation` TINYINT(1) NOT NULL DEFAULT 1,
  `payroll_integration` TINYINT(1) NOT NULL DEFAULT 1,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 18. LEAVE ALLOCATIONS TABLE
-- ----------------------------------------------------------
CREATE TABLE `leave_allocations` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT UNSIGNED NOT NULL,
  `leave_type_id` INT UNSIGNED NOT NULL,
  `allocated` INT UNSIGNED NOT NULL DEFAULT 0,
  `taken` INT UNSIGNED NOT NULL DEFAULT 0,
  `remaining` INT UNSIGNED NOT NULL DEFAULT 0,
  `valid_from` DATE NOT NULL,
  `valid_to` DATE NOT NULL,
  `status` ENUM('active', 'expired') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED DATA - COMPREHENSIVE PRODUCTION-GRADE ENTERPRISE DATASET
-- ==========================================================

INSERT INTO `companies` (`id`, `name`, `email`, `phone`, `address`, `currency`) VALUES
(1, 'PeoplePay360 Global HQ (San Francisco)', 'contact@peoplepay360.com', '+1 (415) 555-0190', '100 Innovation Way, Suite 400, San Francisco, CA 94105', 'USD'),
(2, 'PeoplePay360 Europe BV (London)', 'emea@peoplepay360.com', '+44 20 7946 0991', '25 Bank Street, Canary Wharf, London E14 5JP', 'GBP'),
(3, 'PeoplePay360 APAC Ltd (Singapore)', 'apac@peoplepay360.com', '+65 6789 0123', '1 Marina Boulevard, #28-00, Singapore 018989', 'SGD');

INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Full system administrator access and configuration'),
(2, 'hr', 'Human resources manager with employee and leave management'),
(3, 'payroll', 'Payroll and finance manager with compensation and payment execution'),
(4, 'employee', 'Standard employee self-service access');

INSERT INTO `users` (`id`, `company_id`, `email`, `password_hash`, `role`) VALUES
(1, 1, 'admin@peoplepay360.com', '$2a$10$oqtwpVD8/7xrhmnAXyGbj..jQ6UeqxYoqJYYmVG7CUF8soUv5aEnm', 'admin'),
(2, 1, 'hr@peoplepay360.com', '$2a$10$FHVvVtWF4roszEki/P0f5uUG1y1qPOOqvMhv5PyETDVYIo58DOv0S', 'hr'),
(3, 1, 'payroll@peoplepay360.com', '$2a$10$bcsAWd9MqnEzYqkTLhf1IeoIUTW.N53drytsHDIo3azzUg69IpZz.', 'payroll'),
(4, 1, 'alex.johnson@peoplepay360.com', '$2a$10$SFCmko5xRmQgSBtW1maodOz5Z8IMzbLOOvkVpDkvp8Je8irgJGseG', 'employee'),
(5, 1, 'sarah.miller@peoplepay360.com', '$2a$10$SFCmko5xRmQgSBtW1maodOz5Z8IMzbLOOvkVpDkvp8Je8irgJGseG', 'employee'),
(6, 1, 'rahul.patel@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'payroll'),
(7, 1, 'amit.shah@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'hr'),
(8, 1, 'neha.patel@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'payroll'),
(9, 1, 'priya.shah@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(10, 1, 'karan.mehta@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'admin'),
(11, 1, 'vikram.verma@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(12, 1, 'ananya.roy@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(13, 1, 'sanya.kapoor@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(14, 1, 'rohan.joshi@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(15, 1, 'devendra.singh@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'payroll'),
(16, 1, 'meera.nair@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'hr'),
(17, 1, 'suresh.kumar@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(18, 1, 'pooja.gupta@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(19, 1, 'arjun.rao@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(20, 1, 'rajesh.sharma@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(21, 1, 'clara.oswald@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(22, 1, 'marcus.vance@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(23, 1, 'elena.rostova@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(24, 1, 'david.kim@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'employee'),
(25, 1, 'jaimil.trivedi@peoplepay360.com', '$2a$10$j2xvUJkEJGcN9/jLNBgWC.l6.PDnqWImUxlTV.utCVzA1SW.iRWaW', 'admin');

INSERT INTO `employees` (`id`, `company_id`, `user_id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `department`, `designation`, `joining_date`, `status`) VALUES
(1, 1, 4, 'EMP-1001', 'Alex', 'Johnson', 'alex.johnson@peoplepay360.com', '+1 (415) 839-2001', 'Engineering', 'Senior Staff Frontend Architect', '2023-01-15', 'active'),
(2, 1, 5, 'EMP-1002', 'Sarah', 'Miller', 'sarah.miller@peoplepay360.com', '+1 (415) 839-2002', 'Marketing', 'Global Product Marketing Director', '2023-03-01', 'active'),
(3, 1, 6, 'EMP-1003', 'Rahul', 'Patel', 'rahul.patel@peoplepay360.com', '+1 (415) 839-2003', 'Finance', 'Lead HR Payroll Accountant', '2022-06-01', 'active'),
(4, 1, 7, 'EMP-1004', 'Amit', 'Shah', 'amit.shah@peoplepay360.com', '+1 (415) 839-2004', 'Human Resources', 'Chief People Officer & HR Manager', '2022-05-15', 'active'),
(5, 1, 9, 'EMP-1005', 'Priya', 'Shah', 'priya.shah@peoplepay360.com', '+1 (415) 839-2005', 'Engineering', 'Principal Cloud & Distributed Systems Engineer', '2023-02-01', 'active'),
(6, 1, 10, 'EMP-1006', 'Karan', 'Mehta', 'karan.mehta@peoplepay360.com', '+1 (415) 839-2006', 'Engineering', 'Vice President of Engineering', '2021-03-15', 'active'),
(7, 1, 11, 'EMP-1007', 'Vikram', 'Verma', 'vikram.verma@peoplepay360.com', '+1 (415) 839-2007', 'Engineering', 'Technical Lead & System Architect', '2022-11-01', 'active'),
(8, 1, 12, 'EMP-1008', 'Ananya', 'Roy', 'ananya.roy@peoplepay360.com', '+1 (415) 839-2008', 'Sales', 'Vice President of Enterprise Sales', '2022-04-12', 'active'),
(9, 1, 13, 'EMP-1009', 'Sanya', 'Kapoor', 'sanya.kapoor@peoplepay360.com', '+1 (415) 839-2009', 'Sales', 'Senior Strategic Account Executive', '2023-05-18', 'active'),
(10, 1, 14, 'EMP-1010', 'Rohan', 'Joshi', 'rohan.joshi@peoplepay360.com', '+1 (415) 839-2010', 'Engineering', 'Full Stack Node.js Engineer', '2023-01-10', 'active'),
(11, 1, 15, 'EMP-1011', 'Devendra', 'Singh', 'devendra.singh@peoplepay360.com', '+1 (415) 839-2011', 'Finance', 'Senior Financial Analyst & Controller', '2022-09-01', 'active'),
(12, 1, 16, 'EMP-1012', 'Meera', 'Nair', 'meera.nair@peoplepay360.com', '+1 (415) 839-2012', 'Human Resources', 'Head of Global Talent Acquisition', '2023-07-01', 'active'),
(13, 1, 17, 'EMP-1013', 'Suresh', 'Kumar', 'suresh.kumar@peoplepay360.com', '+1 (415) 839-2013', 'Sales', 'Enterprise Business Development Lead', '2023-08-15', 'active'),
(14, 1, 18, 'EMP-1014', 'Pooja', 'Gupta', 'pooja.gupta@peoplepay360.com', '+1 (415) 839-2014', 'Engineering', 'Lead Quality Assurance & Test Automation Specialist', '2023-03-20', 'active'),
(15, 1, 19, 'EMP-1015', 'Arjun', 'Rao', 'arjun.rao@peoplepay360.com', '+1 (415) 839-2015', 'Sales', 'Regional Sales Director (West Coast)', '2022-04-05', 'active'),
(16, 1, 20, 'EMP-1016', 'Rajesh', 'Sharma', 'rajesh.sharma@peoplepay360.com', '+1 (415) 839-2016', 'Engineering', 'Senior Site Reliability & DevOps Engineer', '2022-10-10', 'active'),
(17, 1, 21, 'EMP-1017', 'Clara', 'Oswald', 'clara.oswald@peoplepay360.com', '+1 (415) 839-2017', 'Product', 'Lead Product Designer & UX Researcher', '2023-04-01', 'active'),
(18, 1, 22, 'EMP-1018', 'Marcus', 'Vance', 'marcus.vance@peoplepay360.com', '+1 (415) 839-2018', 'Engineering', 'AI Research Scientist & LLM Specialist', '2023-09-01', 'active'),
(19, 1, 23, 'EMP-1019', 'Elena', 'Rostova', 'elena.rostova@peoplepay360.com', '+1 (415) 839-2019', 'Operations', 'Global Legal & Corporate Compliance Director', '2022-08-15', 'active'),
(20, 1, 24, 'EMP-1020', 'David', 'Kim', 'david.kim@peoplepay360.com', '+1 (415) 839-2020', 'Product', 'Principal Group Product Manager (Payroll)', '2023-06-15', 'active'),
(21, 1, 8, 'EMP-1021', 'Neha', 'Patel', 'neha.patel@peoplepay360.com', '+1 (415) 839-2021', 'Finance', 'Senior Payroll Operations Specialist', '2023-02-01', 'active'),
(22, 1, 25, 'EMP-1022', 'Jaimil', 'Trivedi', 'jaimil.trivedi@peoplepay360.com', '+1 (415) 839-2099', 'Engineering', 'Lead Enterprise Infrastructure & Systems Architect', '2021-01-01', 'active');

INSERT INTO `bank_accounts` (`employee_id`, `bank_name`, `account_number`, `ifsc_code`, `account_type`, `is_primary`) VALUES
(1, 'JPMorgan Chase', '1092837461', 'CHASUS33', 'salary', 1),
(2, 'Bank of America', '9827364510', 'BOFAUS3N', 'salary', 1),
(3, 'Wells Fargo Bank', '5463728190', 'WFBIUS6S', 'salary', 1),
(4, 'Citibank N.A.', '8372615490', 'CITIUS33', 'salary', 1),
(5, 'Silicon Valley Bank', '4738291045', 'SVBKUS6S', 'salary', 1),
(6, 'First Republic Bank', '9028173645', 'FRBKUS6S', 'salary', 1),
(7, 'JPMorgan Chase', '3849201847', 'CHASUS33', 'salary', 1),
(8, 'Bank of America', '5849302918', 'BOFAUS3N', 'salary', 1),
(9, 'Morgan Stanley Bank', '8493029184', 'MSNYUS33', 'salary', 1),
(10, 'Wells Fargo Bank', '4930291847', 'WFBIUS6S', 'salary', 1),
(11, 'Goldman Sachs Bank', '5930291845', 'GSNYUS33', 'salary', 1),
(12, 'Citibank N.A.', '6930291846', 'CITIUS33', 'salary', 1),
(13, 'JPMorgan Chase', '7930291847', 'CHASUS33', 'salary', 1),
(14, 'Bank of America', '8930291848', 'BOFAUS3N', 'salary', 1),
(15, 'Wells Fargo Bank', '9930291849', 'WFBIUS6S', 'salary', 1),
(16, 'Barclays Bank', '1930291850', 'BARCGB22', 'salary', 1),
(17, 'HSBC Bank USA', '2930291851', 'HSBCUS33', 'salary', 1),
(18, 'JPMorgan Chase', '3930291852', 'CHASUS33', 'salary', 1),
(19, 'Bank of America', '4930291853', 'BOFAUS3N', 'salary', 1),
(20, 'Wells Fargo Bank', '5930291854', 'WFBIUS6S', 'salary', 1),
(21, 'Silicon Valley Bank', '6930291855', 'SVBKUS6S', 'salary', 1),
(22, 'Citibank N.A.', '7930291856', 'CITIUS33', 'salary', 1);

INSERT INTO `contracts` (`id`, `employee_id`, `contract_type`, `base_salary`, `hra_allowance`, `transport_allowance`, `other_allowance`, `tax_deduction_rate`, `start_date`, `status`) VALUES
(1, 1, 'full_time', 7500.00, 1500.00, 400.00, 300.00, 12.00, '2023-01-15', 'active'),
(2, 2, 'full_time', 8000.00, 1600.00, 450.00, 350.00, 14.00, '2023-03-01', 'active'),
(3, 3, 'full_time', 6500.00, 1300.00, 350.00, 250.00, 10.00, '2022-06-01', 'active'),
(4, 4, 'full_time', 8500.00, 1700.00, 500.00, 400.00, 15.00, '2022-05-15', 'active'),
(5, 5, 'full_time', 9200.00, 1800.00, 500.00, 500.00, 16.00, '2023-02-01', 'active'),
(6, 6, 'full_time', 12500.00, 2500.00, 600.00, 900.00, 20.00, '2021-03-15', 'active'),
(7, 7, 'full_time', 9000.00, 1800.00, 500.00, 400.00, 15.00, '2022-11-01', 'active'),
(8, 8, 'full_time', 10500.00, 2100.00, 550.00, 650.00, 18.00, '2022-04-12', 'active'),
(9, 9, 'full_time', 6000.00, 1200.00, 350.00, 250.00, 10.00, '2023-05-18', 'active'),
(10, 10, 'full_time', 6800.00, 1360.00, 350.00, 300.00, 11.00, '2023-01-10', 'active'),
(11, 11, 'full_time', 7200.00, 1440.00, 400.00, 350.00, 12.00, '2022-09-01', 'active'),
(12, 12, 'part_time', 4200.00, 840.00, 200.00, 150.00, 8.00, '2023-07-01', 'active'),
(13, 13, 'full_time', 5800.00, 1160.00, 300.00, 250.00, 10.00, '2023-08-15', 'active'),
(14, 14, 'full_time', 6400.00, 1280.00, 350.00, 250.00, 10.00, '2023-03-20', 'active'),
(15, 15, 'full_time', 7800.00, 1560.00, 400.00, 350.00, 13.00, '2022-04-05', 'active'),
(16, 16, 'full_time', 7500.00, 1500.00, 400.00, 300.00, 12.00, '2022-10-10', 'active'),
(17, 17, 'full_time', 7000.00, 1400.00, 350.00, 300.00, 12.00, '2023-04-01', 'active'),
(18, 18, 'full_time', 11000.00, 2200.00, 600.00, 700.00, 19.00, '2023-09-01', 'active'),
(19, 19, 'full_time', 9500.00, 1900.00, 500.00, 500.00, 16.00, '2022-08-15', 'active'),
(20, 20, 'full_time', 8800.00, 1760.00, 450.00, 400.00, 15.00, '2023-06-15', 'active'),
(21, 21, 'full_time', 6200.00, 1240.00, 300.00, 250.00, 10.00, '2023-02-01', 'active'),
(22, 22, 'full_time', 11500.00, 2300.00, 600.00, 800.00, 20.00, '2021-01-01', 'active');

INSERT INTO `attendance` (`employee_id`, `date`, `check_in`, `check_out`, `total_hours`, `status`, `notes`) VALUES
(1, '2026-09-01', '08:55:00', '17:35:00', 8.67, 'present', 'Sprint architecture review completed'),
(1, '2026-09-02', '09:05:00', '18:10:00', 9.08, 'present', 'Deployment to staging env'),
(1, '2026-09-03', '08:50:00', '17:45:00', 8.92, 'present', 'Code reviews and mentoring'),
(1, '2026-09-04', '09:00:00', '18:00:00', 9.00, 'present', 'Regular engineering hours'),
(2, '2026-09-01', '09:12:00', '17:45:00', 8.55, 'present', 'Q4 Product roadmap campaign'),
(2, '2026-09-02', '09:35:00', '18:15:00', 8.67, 'late', 'Public transit delay (Muni)'),
(2, '2026-09-03', '09:00:00', '17:30:00', 8.50, 'present', 'Analyst briefings'),
(3, '2026-09-01', '08:45:00', '18:30:00', 9.75, 'present', 'August payroll close and recon'),
(3, '2026-09-02', '08:50:00', '18:00:00', 9.17, 'present', 'Bank disbursement validation'),
(3, '2026-09-03', '09:00:00', '18:00:00', 9.00, 'present', 'Tax compliance documentation'),
(4, '2026-09-01', '09:00:00', '18:00:00', 9.00, 'present', 'Executive HR alignment'),
(4, '2026-09-02', '09:00:00', '18:00:00', 9.00, 'present', 'Talent pipeline interviews'),
(4, '2026-09-03', '09:15:00', '13:15:00', 4.00, 'half_day', 'Approved medical appointment'),
(5, '2026-09-01', '09:45:00', '19:15:00', 9.50, 'present', 'Distributed cache cluster setup'),
(5, '2026-09-02', '10:00:00', '20:30:00', 10.50, 'present', 'High-availability failover test'),
(5, '2026-09-03', '09:30:00', '18:45:00', 9.25, 'present', 'Elasticsearch cluster sync'),
(6, '2026-09-01', '08:30:00', '19:00:00', 10.50, 'present', 'Leadership strategic sync'),
(6, '2026-09-02', '08:45:00', '18:30:00', 9.75, 'present', 'Budget approvals'),
(7, '2026-09-01', '09:00:00', '18:30:00', 9.50, 'present', 'Core backend architecture review'),
(7, '2026-09-02', '09:10:00', '18:00:00', 8.83, 'present', 'Technical specs writeup'),
(8, '2026-09-01', '09:00:00', '17:30:00', 8.50, 'present', 'Enterprise client executive demo'),
(8, '2026-09-02', '09:00:00', '18:00:00', 9.00, 'present', 'Contract signing session'),
(16, '2026-09-01', '09:15:00', '18:45:00', 9.50, 'present', 'Kubernetes cluster maintenance'),
(16, '2026-09-02', '09:00:00', '18:00:00', 9.00, 'present', 'Terraform CI/CD pipelines'),
(18, '2026-09-01', '10:00:00', '19:30:00', 9.50, 'present', 'Fine-tuning semantic search model'),
(18, '2026-09-02', '09:30:00', '19:00:00', 9.50, 'present', 'Embedding vector index testing');

INSERT INTO `leave_requests` (`id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `total_days`, `reason`, `status`, `approved_by_user_id`) VALUES
(1, 1, 'casual', '2026-09-10', '2026-09-12', 3, 'Annual family reunion and travel', 'approved', 2),
(2, 2, 'sick', '2026-09-04', '2026-09-04', 1, 'Severe flu rest day', 'approved', 2),
(3, 4, 'paid', '2026-09-18', '2026-09-22', 5, 'Attending SHRM HR Leadership Summit', 'approved', 1),
(4, 5, 'casual', '2026-09-25', '2026-09-26', 2, 'Personal relocation duties', 'pending', NULL),
(5, 7, 'paid', '2026-08-14', '2026-08-18', 5, 'Summer holiday trip', 'approved', 2),
(6, 9, 'casual', '2026-09-08', '2026-09-09', 2, 'Family function in San Jose', 'approved', 2),
(7, 10, 'sick', '2026-08-20', '2026-08-21', 2, 'Dental surgery recovery', 'approved', 2),
(8, 14, 'casual', '2026-09-15', '2026-09-15', 1, 'Car service & DMV appointment', 'pending', NULL),
(9, 16, 'paid', '2026-10-01', '2026-10-05', 5, 'Scheduled autumn vacation', 'pending', NULL),
(10, 18, 'paid', '2026-09-28', '2026-09-30', 3, 'Presenting research at AI & Data Summit', 'approved', 1);

INSERT INTO `payrolls` (`id`, `period_month`, `period_year`, `status`, `total_gross_pay`, `total_deductions`, `total_net_pay`, `approved_by_user_id`, `paid_at`) VALUES
(1, 6, 2026, 'paid', 178500.00, 24990.00, 153510.00, 3, '2026-06-30 17:00:00'),
(2, 7, 2026, 'paid', 182400.00, 25536.00, 156864.00, 3, '2026-07-31 16:30:00'),
(3, 8, 2026, 'paid', 184900.00, 25886.00, 159014.00, 3, '2026-08-31 15:45:00'),
(4, 9, 2026, 'processing', 186200.00, 26068.00, 160132.00, NULL, NULL);

INSERT INTO `payslips` (`id`, `payroll_id`, `employee_id`, `contract_id`, `working_days`, `present_days`, `paid_leave_days`, `unpaid_leave_days`, `base_salary`, `allowances_total`, `gross_salary`, `tax_deductions`, `unpaid_deductions`, `total_deductions`, `net_salary`, `payment_status`, `payment_date`, `email_sent`) VALUES
(1, 3, 1, 1, 30, 29, 1, 0, 7500.00, 2200.00, 9700.00, 1164.00, 0.00, 1164.00, 8536.00, 'paid', '2026-08-31', 1),
(2, 3, 2, 2, 30, 30, 0, 0, 8000.00, 2400.00, 10400.00, 1456.00, 0.00, 1456.00, 8944.00, 'paid', '2026-08-31', 1),
(3, 3, 3, 3, 30, 30, 0, 0, 6500.00, 1900.00, 8400.00, 840.00, 0.00, 840.00, 7560.00, 'paid', '2026-08-31', 1),
(4, 3, 4, 4, 30, 28, 2, 0, 8500.00, 2600.00, 11100.00, 1665.00, 0.00, 1665.00, 9435.00, 'paid', '2026-08-31', 1),
(5, 3, 5, 5, 30, 30, 0, 0, 9200.00, 2800.00, 12000.00, 1920.00, 0.00, 1920.00, 10080.00, 'paid', '2026-08-31', 1),
(6, 3, 6, 6, 30, 30, 0, 0, 12500.00, 4000.00, 16500.00, 3300.00, 0.00, 3300.00, 13200.00, 'paid', '2026-08-31', 1),
(7, 3, 7, 7, 30, 25, 5, 0, 9000.00, 2700.00, 11700.00, 1755.00, 0.00, 1755.00, 9945.00, 'paid', '2026-08-31', 1),
(8, 3, 8, 8, 30, 30, 0, 0, 10500.00, 3300.00, 13800.00, 2484.00, 0.00, 2484.00, 11316.00, 'paid', '2026-08-31', 1),
(9, 3, 9, 9, 30, 30, 0, 0, 6000.00, 1800.00, 7800.00, 780.00, 0.00, 780.00, 7020.00, 'paid', '2026-08-31', 1),
(10, 3, 10, 10, 30, 28, 2, 0, 6800.00, 2010.00, 8810.00, 969.10, 0.00, 969.10, 7840.90, 'paid', '2026-08-31', 1),
(11, 3, 11, 11, 30, 30, 0, 0, 7200.00, 2190.00, 9390.00, 1126.80, 0.00, 1126.80, 8263.20, 'paid', '2026-08-31', 1),
(12, 3, 16, 16, 30, 30, 0, 0, 7500.00, 2200.00, 9700.00, 1164.00, 0.00, 1164.00, 8536.00, 'paid', '2026-08-31', 1),
(13, 3, 18, 18, 30, 30, 0, 0, 11000.00, 3500.00, 14500.00, 2755.00, 0.00, 2755.00, 11745.00, 'paid', '2026-08-31', 1),
(14, 3, 22, 22, 30, 30, 0, 0, 11500.00, 3700.00, 15200.00, 3040.00, 0.00, 3040.00, 12160.00, 'paid', '2026-08-31', 1);

INSERT INTO `payments` (`id`, `payroll_id`, `employee_id`, `amount`, `payment_method`, `transaction_ref`, `status`, `payment_date`) VALUES
(1, 3, 1, 8536.00, 'bank_transfer', 'TXN-20260831-CHAS-1001', 'completed', '2026-08-31'),
(2, 3, 2, 8944.00, 'bank_transfer', 'TXN-20260831-BOFA-1002', 'completed', '2026-08-31'),
(3, 3, 3, 7560.00, 'bank_transfer', 'TXN-20260831-WFBI-1003', 'completed', '2026-08-31'),
(4, 3, 4, 9435.00, 'bank_transfer', 'TXN-20260831-CITI-1004', 'completed', '2026-08-31'),
(5, 3, 5, 10080.00, 'bank_transfer', 'TXN-20260831-SVBK-1005', 'completed', '2026-08-31'),
(6, 3, 6, 13200.00, 'bank_transfer', 'TXN-20260831-FRBK-1006', 'completed', '2026-08-31'),
(7, 3, 7, 9945.00, 'bank_transfer', 'TXN-20260831-CHAS-1007', 'completed', '2026-08-31'),
(8, 3, 8, 11316.00, 'bank_transfer', 'TXN-20260831-BOFA-1008', 'completed', '2026-08-31'),
(9, 3, 9, 7020.00, 'bank_transfer', 'TXN-20260831-MSNY-1009', 'completed', '2026-08-31'),
(10, 3, 10, 7840.90, 'bank_transfer', 'TXN-20260831-WFBI-1010', 'completed', '2026-08-31');

INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`) VALUES
(4, 'August 2026 Payslip Ready', 'Your salary payslip for August 2026 has been generated and disbursed to JPMorgan Chase.', 'payroll'),
(2, 'New Leave Request Submitted', 'Priya Shah submitted a request for 2 days of casual leave (Sep 25 - Sep 26).', 'leave'),
(1, 'System Health: ElasticSearch Online', 'High-performance Elastic search index refreshed with 250+ enterprise documents.', 'info'),
(3, 'September 2026 Payrun Initiated', 'Monthly payrun calculation in progress for 22 active employees.', 'payroll');

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('company_name', 'PeoplePay360 Technologies Inc.'),
('working_days_per_month', '30'),
('default_currency', 'USD'),
('tax_rate_default', '12'),
('overtime_rate_multiplier', '1.5'),
('elasticsearch_enabled', 'true'),
('elasticsearch_index_version', 'v2.4');

-- Schedules seed data
INSERT INTO `schedules` (`id`, `name`, `type`, `weekly_hours`, `pattern`, `status`) VALUES
(1, 'Standard Full-Time (40h)', 'full_time', 40.0, '{"Monday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Tuesday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Wednesday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Thursday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Friday":{"active":true,"start":"09:00","end":"18:00","breakMinutes":60},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active'),
(2, 'Engineering Flex Shift (40h)', 'shift', 40.0, '{"Monday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Tuesday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Wednesday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Thursday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Friday":{"active":true,"start":"10:00","end":"19:00","breakMinutes":60},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active'),
(3, 'Part-Time Morning (20h)', 'part_time', 20.0, '{"Monday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Tuesday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Wednesday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Thursday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Friday":{"active":true,"start":"09:00","end":"13:00","breakMinutes":0},"Saturday":{"active":false},"Sunday":{"active":false}}', 'active');

-- Salary structures seed data
INSERT INTO `salary_structures` (`id`, `name`, `description`, `status`) VALUES
(1, 'Standard Regular Structure', 'Standard compensation structure for full-time employees including HRA, TA & PF', 'active'),
(2, 'Executive Leadership Structure', 'Specialized structure for department leads and senior management with performance bonus', 'active');

-- Salary rules seed data
INSERT INTO `salary_rules` (`id`, `structure_id`, `name`, `code`, `category`, `sequence`, `calculation_type`, `value`, `base_rule`, `status`) VALUES
(1, 1, 'Basic Salary', 'BASIC', 'basic', 1, 'fixed', 50000.00, NULL, 'active'),
(2, 1, 'House Rent Allowance', 'HRA', 'allowance', 2, 'percentage', 20.00, 'BASIC', 'active'),
(3, 1, 'Transport Allowance', 'TA', 'allowance', 3, 'fixed', 4000.00, NULL, 'active'),
(4, 1, 'Provident Fund', 'PF', 'deduction', 4, 'percentage', 12.00, 'BASIC', 'active'),
(5, 1, 'Net Salary', 'NET', 'net', 99, 'formula', 0.00, 'GROSS - DEDUCTION', 'active'),
(6, 2, 'Performance Bonus', 'BONUS', 'allowance', 5, 'fixed', 8000.00, NULL, 'active');

-- Leave types seed data
INSERT INTO `leave_types` (`id`, `name`, `unit`, `requires_approval`, `requires_allocation`, `payroll_integration`, `status`) VALUES
(1, 'Paid Vacation Leave', 'days', 1, 1, 1, 'active'),
(2, 'Sick Leave', 'days', 1, 1, 1, 'active'),
(3, 'Casual Leave', 'days', 1, 1, 1, 'active'),
(4, 'Maternity / Paternity Leave', 'days', 1, 1, 1, 'active'),
(5, 'Unpaid Leave (LWP)', 'days', 1, 0, 1, 'active');

-- Leave allocations seed data
INSERT INTO `leave_allocations` (`id`, `employee_id`, `leave_type_id`, `allocated`, `taken`, `remaining`, `valid_from`, `valid_to`, `status`) VALUES
(1, 1, 1, 20, 4, 16, '2026-01-01', '2026-12-31', 'active'),
(2, 1, 2, 12, 1, 11, '2026-01-01', '2026-12-31', 'active'),
(3, 3, 1, 20, 3, 17, '2026-01-01', '2026-12-31', 'active'),
(4, 5, 1, 20, 5, 15, '2026-01-01', '2026-12-31', 'active'),
(5, 5, 2, 12, 2, 10, '2026-01-01', '2026-12-31', 'active'),
(6, 18, 1, 20, 3, 17, '2026-01-01', '2026-12-31', 'active'),
(7, 2, 1, 20, 2, 18, '2026-01-01', '2026-12-31', 'active'),
(8, 4, 1, 20, 5, 15, '2026-01-01', '2026-12-31', 'active'),
(9, 6, 1, 20, 0, 20, '2026-01-01', '2026-12-31', 'active'),
(10, 7, 1, 20, 5, 15, '2026-01-01', '2026-12-31', 'active'),
(11, 8, 1, 20, 0, 20, '2026-01-01', '2026-12-31', 'active'),
(12, 16, 1, 20, 0, 20, '2026-01-01', '2026-12-31', 'active'),
(13, 22, 1, 20, 0, 20, '2026-01-01', '2026-12-31', 'active');

