import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import payslipRoutes from './routes/payslipRoutes.js';
import bankPaymentRoutes from './routes/bankPaymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import { setupSwagger } from './config/swagger.js';

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

export default app;
