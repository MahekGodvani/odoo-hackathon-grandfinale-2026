const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const contractRoutes = require('./routes/contractRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const payslipRoutes = require('./routes/payslipRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { setupSwagger } = require('./config/swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Setup Interactive Swagger API Documentation
setupSwagger(app);

// Root endpoint: API Overview
app.get('/', (req, res) => res.json({
  name: 'PeoplePay360 Backend API',
  version: '1.0.0',
  status: 'Running',
  swagger_ui: 'http://localhost:5000/api-docs',
  business_flow: 'Employee -> Contract -> Attendance & Leave -> Payroll -> Salary Calculation -> Payslip -> Payment -> Dashboard',
  endpoints: {
    docs: ['GET /api-docs', 'GET /api-docs.json'],
    auth: [
      'POST /api/auth/login',
      'POST /api/auth/refresh-token',
      'POST /api/auth/logout',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'GET /api/auth/me',
      'PUT /api/auth/profile'
    ],
    employees: ['GET /api/employees', 'POST /api/employees', 'GET /api/employees/:id', 'PUT /api/employees/:id'],
    contracts: ['GET /api/contracts/employee/:employeeId', 'POST /api/contracts/assign'],
    attendance: ['POST /api/attendance/log', 'GET /api/attendance'],
    leaves: ['GET /api/leaves', 'POST /api/leaves/apply', 'PUT /api/leaves/:id/status'],
    payroll: ['GET /api/payroll', 'POST /api/payroll/generate', 'PUT /api/payroll/:id/approve', 'PUT /api/payroll/:id/pay'],
    payslips: ['GET /api/payslips', 'GET /api/payslips/:id'],
    dashboard: ['GET /api/dashboard/stats']
  }
}));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res) => res.status(404).json({ 
  success: false, 
  message: `Route ${req.method} ${req.originalUrl} not found.` 
}));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  return res.status(500).json({ success: false, message: err?.message ?? 'Internal server error' });
});

module.exports = app;
