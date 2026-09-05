# 🚀 PeoplePay360 - Integrated HR & Payroll Operational Suite

> **Enterprise-Grade HR & Payroll Operational Platform built for 24-Hour Hackathon.**

PeoplePay360 seamlessly connects **Employee → Contract → Working Schedule → Attendance → Time Off → Salary Structure & Rules → Payrun Execution → Itemized Printable Payslips**.

---

## ✨ Features & Highlights

- **Hero Employee Operational Hub**: Single-page 360-degree operational hub connecting an employee's personal info, work info, active contract, working schedule, attendance history, leave balances, and payslips.
- **2-Step Payrun Creation Wizard**:
  - **Step 1**: Structure & period setup.
  - **Step 2**: Multi-select eligible employees.
- **Payrun Processing Hub & Audit Warnings**:
  - Sequential workflow execution (`Draft` → `Compute` → `Validate` → `Mark Paid` → `Send Payslips`).
  - Prominent visual warning alerts for missing bank details, duplicate payslips, and contract expirations.
- **Live Rule Engine & Formula Preview**: Salary structures with ordered execution flow (`BASIC`, `HRA 20%`, `TA`, `PF 12%`) and real-time formula calculation previews.
- **Printable Itemized Payslip**: Print-optimized layout (`@media print`) for instant browser PDF export.
- **Time Off & Attendance Engine**:
  - Working schedule net weekly hours calculator (`40h`).
  - Attendance log with overtime and late triggers.
  - Leave approval modal with **Balance Impact Preview Box** (`Balance Before → Deducted → Balance Remaining`).
- **Role-Based Access Control (RBAC)**: Support for 5 enterprise roles (*Employee*, *HR Manager*, *HR Payroll User*, *HR Payroll Manager*, *Admin*) with top header role switcher for presentation testing.
- **Backend-Ready Service Layer**: Axios client configured to seamlessly toggle between LocalStorage mock database and Node.js / Express REST API endpoints via `VITE_USE_MOCK`.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios (Centralized API service architecture)
- **Routing**: React Router DOM (v6)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/peoplepay360.git
   cd peoplepay360
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔑 Demo Account Credentials

Use any of the registered accounts below to log in:

| Role | Email | Password |
|---|---|---|
| **HR Payroll Manager** | `rahul.patel@peoplepay360.com` | `password123` |
| **HR Manager** | `amit.shah@peoplepay360.com` | `password123` |
| **HR Payroll User** | `neha.patel@peoplepay360.com` | `password123` |
| **Employee** | `priya.shah@peoplepay360.com` | `password123` |
| **System Admin** | `karan.mehta@peoplepay360.com` | `password123` |

---

## 📁 Repository Structure

```
src/
  api/          # Centralized service layer (employeeApi, payrollApi, etc.)
  components/   # Common design system components, layout, & auth guards
  context/      # AuthContext with RBAC role switching
  pages/        # Feature modules (Dashboard, Employees, Contracts, Schedules, Attendance, TimeOff, Payroll, Reports, Users)
  services/     # Mock data store with LocalStorage persistence
```

---

## 📄 License
This project is open-source under the MIT License.
