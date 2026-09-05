const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const contractRoutes = require('./routes/contractRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const payslipRoutes = require('./routes/payslipRoutes');
const bankPaymentRoutes = require('./routes/bankPaymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const roleRoutes = require('./routes/roleRoutes');
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
  name: 'PeoplePay360 Complete HR & Payroll REST API',
  version: '1.0.0',
  status: 'Running',
  swagger_ui: 'http://localhost:5000/api-docs',
  business_flow: 'Company -> Create Employees -> Set Salary -> Check-In/Out -> Attendance -> Leave -> Monthly Payroll -> Salary Calculation -> Payroll Approval -> Payment -> Payslip Generation -> Employee Downloads Payslip',
  modules: [
    'Auth (/api/auth)',
    'Companies (/api/companies)',
    'Employees (/api/employees)',
    'Attendance (/api/attendance)',
    'Salaries (/api/salaries)',
    'Payroll (/api/payroll)',
    'Payslips (/api/payslips)',
    'Leaves (/api/leaves)',
    'Bank Accounts (/api/bank-accounts)',
    'Payments (/api/payments)',
    'Dashboard (/api/dashboard)',
    'Notifications (/api/notifications)',
    'Settings (/api/settings, /api/company/settings)',
    'Reports (/api/reports)',
    'Roles & Permissions (/api/roles, /api/permissions)'
  ]
}));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/payslips', payslipRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api', bankPaymentRoutes);
app.use('/api', settingsRoutes);
app.use('/api', roleRoutes);

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
