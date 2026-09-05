# PeoplePay360 — Integrated HR & Payroll Management Platform

> **Odoo Hackathon Grand Finale 2026 — Phase 1**

PeoplePay360 is an enterprise-grade Human Resource Management and Payroll automation platform designed to streamline employee lifecycle management, attendance tracking, leave workflows, and configurable multi-rule salary processing.

---

## 🚀 Phase 1 Features & Capabilities

### 1. 👥 Employee Management
- Complete employee directory with profile information, departments, and job titles.
- Role-based access control (Admin, HR Manager, Payroll User, Payroll Manager, Employee).
- Contract management with salary structure linkage, wage details, and employment terms.

### 2. 🕒 Attendance & Work Schedules
- Configurable work schedules and shift assignments.
- Check-in/check-out time tracking and attendance auditing.
- Multi-state attendance tracking (Present, Late, Absent, Half Day).

### 3. 🏖️ Leave & Time-Off Management
- Customizable leave types (Paid Time Off, Sick Leave, Casual Leave, etc.).
- Time-off allocations and real-time balance tracking.
- Multi-tier approval workflow for leave requests.

### 4. 💰 Payroll & Salary Structures
- Flexible salary rules engine (Basic, HRA, Allowances, PF, Professional Tax, TDS).
- Salary structure templates linked directly to employee contracts.
- Automated payrun generation, batch processing, and individual payslip calculation.

### 5. 📊 Analytics & Reporting
- Executive dashboard with payroll distribution, headcount metrics, and department breakdowns.
- Visual charts and salary trends.

---

## 🔑 Demo Credentials

All test accounts use the password: `password123`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@peoplepay360.com` | `password123` |
| **HR Manager** | `hr.manager@peoplepay360.com` | `password123` |
| **Payroll Manager** | `payroll.manager@peoplepay360.com` | `password123` |
| **Payroll User** | `payroll.user@peoplepay360.com` | `password123` |
| **Employee** | `employee1@peoplepay360.com` | `password123` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript
- **Database & ORM**: SQLite (zero-config local dev) / PostgreSQL (production ready) via Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS & Lucide Icons
- **Charts**: Recharts
- **PDF Generation**: @react-pdf/renderer

---

## ⚙️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, `.env.example` is configured with zero-dependency SQLite `file:./dev.db`)*

### 3. Generate Prisma Client & Seed Database
```bash
npx prisma generate
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and log in with any demo credentials above.
