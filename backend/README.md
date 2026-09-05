# PeoplePay360 - Node.js Backend API

Simple, clean, and robust RESTful API built with **Node.js, Express, and MySQL (phpMyAdmin)** for the **PeoplePay360** HR & Payroll Management System.

---

## 🔄 Business Flow Implemented

```text
👤 Employee Created (/api/employees)
        ↓
📄 Contract Assigned (/api/contracts/assign)
        ↓
🕐 Work & Attendance (/api/attendance/log)
        ↓
🌴 Leave Request (/api/leaves/apply)
        ↓
✅ HR Approves Leave (/api/leaves/:id/status)
        ↓
💰 Payroll Created (/api/payroll/generate)
        ↓
🧮 Salary Calculated (Automated: Base + Allowances - Unpaid Leaves - Tax)
        ↓
🧾 Payslip Generated (/api/payslips)
        ↓
✅ Payroll Approved (/api/payroll/:id/approve)
        ↓
💵 Salary Paid (/api/payroll/:id/pay)
        ↓
📧 Payslip Sent to Employee
        ↓
📊 Dashboard Updated (/api/dashboard/stats)
```

---

## 🛠️ Quick Setup & Run

### 1. Database Setup
1. Ensure MySQL / Apache is running in XAMPP / WAMP / Laragon.
2. Open [phpMyAdmin](http://localhost/phpmyadmin/index.php?route=/database/structure&db=demo).
3. Select database `demo`, go to **SQL**, and run the SQL code from [`schema.sql`](file:///d:/demo/schema.sql).

### 2. Configure Environment
Check `.env` (already prepared for you):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=demo
DB_PORT=3306
JWT_SECRET=peoplepay360_super_secret_jwt_key_2026
```

### 3. Start Backend Server
```bash
# In your terminal inside d:\demo\backend
npm start
# or development mode with auto-reload:
npm run dev
```

---

## 📖 Interactive Swagger API Documentation

Once the server is running, open your browser and navigate to:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

- **Interactive Testing**: Click "Try it out" on any endpoint to test live requests directly from your browser.
- **Bearer Token Auth**: Click the **Authorize 🔓** button at the top to paste your `accessToken`.
- **Raw OpenAPI Specification**: Available at [`http://localhost:5000/api-docs.json`](http://localhost:5000/api-docs.json).

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email & password (returns 15-min `accessToken` + 7-day `refreshToken`) |
| `POST` | `/api/auth/refresh-token` | Public | **Invoked after 15 minutes**: Re-issues a fresh 15-min `accessToken` using `refreshToken` |
| `POST` | `/api/auth/logout` | Optional Auth | **Logout**: Clears & revokes refresh token in database (works even if 15-min token is expired) |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token by email |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token & new password |
| `GET` | `/api/auth/me` | Authenticated | Get current logged-in user profile |
| `PUT` | `/api/auth/profile` | Authenticated | **Edit Profile** (name, phone, bank info, change password) |

#### 🔄 15-Minute Token Refresh Flow
1. Upon login, the client receives `accessToken` (`expiresIn: 900` = 15 minutes) and `refreshToken`.
2. When the 15 minutes elapse, protected endpoints return `401 Unauthorized`:
   ```json
   {
     "success": false,
     "message": "Access token expired (15m elapsed). Please invoke POST /api/auth/refresh-token.",
     "tokenExpired": true
   }
   ```
3. Frontend interceptor automatically calls `POST /api/auth/refresh-token` with `{ "refreshToken": "..." }`.
4. A new 15-minute `accessToken` is issued without logging out the user!

> **Demo Login Credentials:**
> - **Admin:** `admin@peoplepay360.com` / `admin123`
> - **HR:** `hr@peoplepay360.com` / `hr123`
> - **Payroll:** `payroll@peoplepay360.com` / `payroll123`
> - **Employee:** `alex.johnson@peoplepay360.com` / `emp123`

---

### 👤 Employees (`/api/employees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/employees` | All Auth | List all employees (filter by `department`, `status`, `search`) |
| `GET` | `/api/employees/:id` | All Auth | Get employee details with active contract |
| `POST` | `/api/employees` | Admin, HR | Create employee & user account |
| `PUT` | `/api/employees/:id` | Admin, HR | Update employee details |

---

### 📄 Contracts (`/api/contracts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/contracts/employee/:employeeId` | All Auth | Get contract history for an employee |
| `POST` | `/api/contracts/assign` | Admin, HR | Assign/renew salary contract (Base + HRA + Allowances + Tax %) |

---

### 🕐 Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/attendance/log` | All Auth | Clock in / out or log daily attendance |
| `GET` | `/api/attendance` | All Auth | View logs (filter by `employee_id`, `month`, `year`, `date`) |

---

### 🌴 Leaves (`/api/leaves`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leaves` | All Auth | List leave requests |
| `POST` | `/api/leaves/apply` | All Auth | Apply for leave (casual, sick, paid, unpaid) |
| `PUT` | `/api/leaves/:id/status` | Admin, HR | Approve or reject leave request |

---

### 💰 Payroll Engine (`/api/payroll`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/payroll` | Admin, HR, Payroll | List all payroll periods |
| `POST` | `/api/payroll/generate` | Admin, Payroll | **Auto-calculate salaries & generate payslips** for month/year |
| `PUT` | `/api/payroll/:id/approve` | Admin, Payroll | Approve draft payroll run |
| `PUT` | `/api/payroll/:id/pay` | Admin, Payroll | Mark salaries as Paid & send payslips |

---

### 🧾 Payslips (`/api/payslips`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/payslips` | All Auth | List payslips (Employees see only their own) |
| `GET` | `/api/payslips/:id` | All Auth | View detailed payslip breakdown |

---

### 📊 Dashboard (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | All Auth | Employee counts, pending leaves, latest payroll, dept charts |
