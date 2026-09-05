# 🚀 PeoplePay360 - Complete HR & Payroll Management Platform

> **Full-Stack Enterprise-Grade HR & Payroll Operational Suite (React + Node.js/Express + MySQL + Swagger)**

PeoplePay360 seamlessly connects **Company → Employees → Contracts → Attendance → Leaves → Payroll Execution → Payslip Generation → Bank Payments & Reports**.

---

## 🏗️ Architecture & Monorepo Structure

```
.
├── backend/                       # Node.js + Express + MySQL REST API
│   ├── src/
│   │   ├── config/                # Database pool (db.js), DB Initializer (initDb.js), Swagger (swagger.js)
│   │   ├── controllers/           # 15 Controller modules (Auth, Employee, Attendance, Payroll, Payslip, etc.)
│   │   ├── middlewares/           # JWT Authentication & RBAC Authorization
│   │   ├── routes/                # 15 Express Router definitions
│   │   ├── app.js                 # Express Application & Middleware pipeline
│   │   └── server.js              # Server bootstrapper (Port 5000)
│   ├── package.json               # Backend dependencies & scripts
│   └── .env.example               # Backend environment variables template
│
├── frontend/                      # React 19 + Vite + Tailwind CSS + Lucide + Recharts
│   ├── src/
│   │   ├── api/                   # Centralized Axios API services with token interception
│   │   ├── components/            # Reusable UI components, Layouts, Protected Routes
│   │   ├── context/               # AuthContext & RBAC management
│   │   ├── pages/                 # Full suite of HR & Payroll pages (Dashboard, Employees, Payroll, etc.)
│   │   ├── services/              # Mock store fallback
│   │   ├── App.jsx                # Router & Page routes
│   │   └── main.jsx               # Entry point
│   ├── index.html                 # HTML template
│   ├── vite.config.js             # Vite configuration (Port 3000)
│   ├── package.json               # Frontend dependencies & scripts
│   └── .env.example               # Frontend environment variables template
│
├── package.json                   # Unified Root Scripts (concurrent dev, build, db init)
└── README.md                      # Complete Project Documentation
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server** (running locally or remotely)

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=demo
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=false
```

### 3. Initialize the Database
Populates the schema, default companies, roles, admin credentials, sample employees, and mock datasets:
```bash
npm run init:db
```

### 4. Run Both Frontend & Backend Concurrently
From the root directory:
```bash
# Install all dependencies across root, backend, and frontend
npm run install:all

# Run backend (Port 5000) + frontend (Port 3000) simultaneously
npm run dev
```

Alternatively, run them in separate terminals:
- **Backend**: `npm run dev:backend` (accessible at `http://localhost:5000`)
- **Frontend**: `npm run dev:frontend` (accessible at `http://localhost:3000`)

---

## 📖 Interactive Swagger API Documentation

Once the backend is running, open the interactive Swagger UI in your browser:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

Explore and test all 15 operational REST API modules directly with built-in JWT bearer authorization!

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@demo.com` | `admin123` |
| **HR Payroll Manager** | `rahul.patel@peoplepay360.com` | `password123` |
| **HR Manager** | `amit.shah@peoplepay360.com` | `password123` |
| **Employee** | `priya.shah@peoplepay360.com` | `password123` |

---

## 🛠️ Key Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs backend (5000) and frontend (3000) concurrently |
| `npm run dev:backend` | Starts the Node.js backend with file watching |
| `npm run dev:frontend` | Starts the Vite React frontend server |
| `npm run init:db` | Automatically creates MySQL tables and seeds initial data |
| `npm run build` | Builds the frontend for production distribution |

---

## 📄 License
MIT License
