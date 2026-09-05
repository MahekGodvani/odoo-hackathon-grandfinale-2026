# PeoplePay360 - Complete HR & Payroll REST API

A modular, scalable, and robust RESTful API built with **Node.js, Express, and MySQL** for the **PeoplePay360** HR & Payroll Management System.

---

## 🔄 Complete Business Flow

```text
🏢 Company Setup (/api/companies)
        ↓
👤 Create Employees (/api/employees)
        ↓
💰 Set Salary & Compensation (/api/salaries)
        ↓
⏰ Employee Check-In / Check-Out (/api/attendance/check-in, /check-out)
        ↓
🕐 Attendance & Timesheet Calculation (/api/attendance)
        ↓
🏖️ Leave Management & Approvals (/api/leaves)
        ↓
🧮 Monthly Payroll Processing (/api/payroll/generate)
        ↓
💵 Salary Calculation (Base + Allowances - Unpaid Leaves - Tax)
        ↓
✅ Payroll Approval (/api/payroll/:id/approve)
        ↓
🏦 Salary Payment & Disbursement (/api/payments)
        ↓
🧾 Payslip Generation & Delivery (/api/payslips/:id/send)
        ↓
📥 Employee Downloads Payslip (/api/payslips/:id/download)
        ↓
📊 Analytics & Reporting (/api/dashboard, /api/reports)
```

---

## 🛠️ Quick Setup & Run

### 1. Database Setup
1. Ensure MySQL / Apache is running in XAMPP / WAMP / Laragon.
2. Open [phpMyAdmin](http://localhost/phpmyadmin/index.php?route=/database/structure&db=demo).
3. Select database `demo`, open the **SQL** tab, and run [`schema.sql`](file:///d:/demo/backend/schema.sql).

### 2. Configure Environment
Check `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=demo
DB_PORT=3306
JWT_ACCESS_SECRET=peoplepay360_access_secret_key_2026
JWT_REFRESH_SECRET=peoplepay360_refresh_secret_key_2026
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Start Backend Server
```bash
cd backend
npm install
npm run dev
```

---

## 📖 Interactive Swagger API Documentation

Once the server is running, open your browser:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**  
👉 Raw OpenAPI Specification: [`http://localhost:5000/api-docs.json`](http://localhost:5000/api-docs.json)

---

## 📡 Complete API Endpoints Reference

### 👤 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user & optional employee profile |
| `POST` | `/api/auth/login` | Public | Login with email & password (returns 15-min `accessToken` + 7-day `refreshToken`) |
| `POST` | `/api/auth/logout` | Optional Auth | Logout & revoke refresh token in database |
| `POST` | `/api/auth/refresh-token` | Public | Re-issue fresh 15-min `accessToken` using `refreshToken` |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using reset token |
| `GET` | `/api/auth/me` | Authenticated | Get current logged-in user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update user name, phone, bank details, & password |

---

### 🏢 2. Company APIs (`/api/companies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/companies` | Admin | Create company profile |
| `GET` | `/api/companies` | Authenticated | List all companies |
| `GET` | `/api/companies/:id` | Authenticated | Get company details by ID |
| `PUT` | `/api/companies/:id` | Admin | Update company profile |
| `DELETE` | `/api/companies/:id` | Admin | Delete company |

---

### 👤 3. Employee APIs (`/api/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/employees` | Admin, HR | Create employee & user credentials |
| `GET` | `/api/employees` | Authenticated | List employees (filters: `department`, `status`, `search`) |
| `GET` | `/api/employees/:id` | Authenticated | Get employee profile & active salary structure |
| `PUT` | `/api/employees/:id` | Admin, HR | Update employee details |
| `DELETE` | `/api/employees/:id` | Admin, HR | Remove employee record |

---

### ⏰ 4. Attendance APIs (`/api/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/attendance/check-in` | Authenticated | Clock in / Check in |
| `POST` | `/api/attendance/check-out` | Authenticated | Clock out / Check out (auto-computes total hours) |
| `POST` | `/api/attendance/log` | Authenticated | Manually log daily attendance record |
| `GET` | `/api/attendance` | Authenticated | List attendance logs (filters: `date`, `month`, `year`) |
| `GET` | `/api/attendance/:employeeId` | Authenticated | Get attendance records for specific employee |
| `GET` | `/api/attendance/:employeeId/monthly` | Authenticated | Get monthly attendance metrics & hours worked |
| `PUT` | `/api/attendance/:id` | Admin, HR | Edit attendance entry |
| `DELETE` | `/api/attendance/:id` | Admin, HR | Delete attendance entry |

---

### 💰 5. Salary APIs (`/api/salaries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/salaries` | Admin, HR, Payroll | Assign / Update base salary & allowances structure |
| `GET` | `/api/salaries` | Admin, HR, Payroll | List all employee salary structures |
| `GET` | `/api/salaries/:employeeId` | Authenticated | Get active salary structure for employee |
| `PUT` | `/api/salaries/:id` | Admin, HR, Payroll | Update salary breakdown |
| `DELETE` | `/api/salaries/:id` | Admin, HR, Payroll | Delete salary structure |

---

### 🧮 6. Payroll APIs (`/api/payroll`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payroll/generate` | Admin, Payroll | **Auto-calculate salaries & generate monthly payslips** |
| `GET` | `/api/payroll` | Admin, HR, Payroll | List all payroll cycle runs |
| `GET` | `/api/payroll/:id` | Admin, HR, Payroll | Get payroll run details & itemized employee summary |
| `GET` | `/api/payroll/employee/:employeeId` | Authenticated | Get payroll history for specific employee |
| `POST` | `/api/payroll/:id/process` | Admin, Payroll | Transition payroll to processing status |
| `POST` | `/api/payroll/:id/approve` | Admin, Payroll | Approve payroll run |
| `PUT` | `/api/payroll/:id/pay` | Admin, Payroll | Mark payroll as Paid & trigger disbursement |

---

### 🧾 7. Payslip APIs (`/api/payslips`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/payslips` | Authenticated | List payslips (Employees see only their own) |
| `GET` | `/api/payslips/:id` | Authenticated | Get itemized payslip breakdown |
| `GET` | `/api/payslips/employee/:employeeId` | Authenticated | List all payslips for an employee |
| `GET` | `/api/payslips/:id/download` | Authenticated | Download official payslip summary JSON/document |
| `POST` | `/api/payslips/:id/send` | Admin, Payroll, HR | Email payslip to employee |

---

### 🏖️ 8. Leave APIs (`/api/leaves`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/leaves` | Authenticated | Submit leave request (casual, sick, paid, unpaid) |
| `GET` | `/api/leaves` | Authenticated | List leave requests |
| `GET` | `/api/leaves/:id` | Authenticated | Get leave request details |
| `PUT` | `/api/leaves/:id` | Authenticated | Update pending leave request |
| `POST` | `/api/leaves/:id/approve` | Admin, HR | Approve leave request |
| `POST` | `/api/leaves/:id/reject` | Admin, HR | Reject leave request |
| `DELETE` | `/api/leaves/:id` | Authenticated | Cancel leave application |

---

### 🏦 9. Bank & Payment APIs (`/api/bank-accounts`, `/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bank-accounts` | Authenticated | Add employee bank account details |
| `GET` | `/api/bank-accounts/:employeeId` | Authenticated | Get bank accounts for employee |
| `PUT` | `/api/bank-accounts/:id` | Authenticated | Update bank account |
| `POST` | `/api/payments` | Admin, Payroll | Record salary payment disbursement |
| `GET` | `/api/payments` | Admin, Payroll, HR | List payment transaction logs |
| `GET` | `/api/payments/:id` | Authenticated | Get payment transaction details |

---

### 📊 10. Dashboard APIs (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/admin` | Admin | Company-wide executive KPI metrics |
| `GET` | `/api/dashboard/hr` | Admin, HR | HR staffing metrics, probation & pending leave queues |
| `GET` | `/api/dashboard/employee` | Authenticated | Employee self-service dashboard |
| `GET` | `/api/dashboard/payroll-summary` | Admin, Payroll, HR | Monthly financial payout analytics |
| `GET` | `/api/dashboard/attendance-summary` | Admin, HR, Payroll | Today's present/absent/on-leave breakdown |

---

### 🔔 11. Notification APIs (`/api/notifications`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Authenticated | Get user notifications & unread count |
| `PUT` | `/api/notifications/:id/read` | Authenticated | Mark notification as read |
| `POST` | `/api/notifications/send` | Admin, HR | Dispatch notification to employee |

---

### ⚙️ 12. Settings APIs (`/api/settings`, `/api/company/settings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/settings` | Authenticated | Get application configuration settings |
| `PUT` | `/api/settings` | Admin | Update application configuration |
| `GET` | `/api/company/settings` | Authenticated | Get company profile settings |
| `PUT` | `/api/company/settings` | Admin | Update company profile settings |

---

### 📑 13. Reports APIs (`/api/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/payroll` | Admin, Payroll, HR | Annual payroll summary report |
| `GET` | `/api/reports/attendance` | Admin, HR | Monthly employee attendance summary |
| `GET` | `/api/reports/leave` | Admin, HR | Annual leave utilization report |
| `GET` | `/api/reports/salary` | Admin, Payroll, HR | Department salary distribution report |
| `GET` | `/api/reports/tax` | Admin, Payroll | Tax withholding report |
| `GET` | `/api/reports/export` | Admin, Payroll, HR | Export payroll/employee data |

---

### 🔐 14. Roles & Permissions (`/api/roles`, `/api/permissions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/roles` | Authenticated | List all system roles |
| `POST` | `/api/roles` | Admin | Create custom role |
| `PUT` | `/api/roles/:id` | Admin | Update role |
| `DELETE` | `/api/roles/:id` | Admin | Delete custom role |
| `GET` | `/api/permissions` | Authenticated | List permissions |
| `PUT` | `/api/users/:id/role` | Admin | Assign role to user |
