import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import ContractsPage from './pages/contracts/ContractsPage';
import SchedulesPage from './pages/schedules/SchedulesPage';
import AttendancePage from './pages/attendance/AttendancePage';
import TimeOffRequestsPage from './pages/timeoff/TimeOffRequestsPage';
import TimeOffAllocationsPage from './pages/timeoff/TimeOffAllocationsPage';
import TimeOffTypesPage from './pages/timeoff/TimeOffTypesPage';
import SalaryStructuresPage from './pages/payroll/SalaryStructuresPage';
import SalaryRulesPage from './pages/payroll/SalaryRulesPage';
import PayrunsPage from './pages/payroll/PayrunsPage';
import PayrunDetailPage from './pages/payroll/PayrunDetailPage';
import PayslipsPage from './pages/payroll/PayslipsPage';
import PayslipDetailPage from './pages/payroll/PayslipDetailPage';
import ReportsPage from './pages/reports/ReportsPage';
import UsersPage from './pages/users/UsersPage';

/**
 * PEOPLEPAY360 - ROUTER APP ENTRY POINT
 * Configures all public and role-protected routes for the operational platform.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Layout Frame */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Employee Operational Hub Routes */}
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />

            {/* HR Core Modules */}
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />

            {/* Time Off Management */}
            <Route path="/time-off/requests" element={<TimeOffRequestsPage />} />
            <Route path="/time-off/allocations" element={<TimeOffAllocationsPage />} />
            <Route path="/time-off/types" element={<TimeOffTypesPage />} />

            {/* Payroll Hero Workflows */}
            <Route path="/payroll/payruns" element={<PayrunsPage />} />
            <Route path="/payroll/payruns/:id" element={<PayrunDetailPage />} />
            <Route path="/payroll/payslips" element={<PayslipsPage />} />
            <Route path="/payroll/payslips/:id" element={<PayslipDetailPage />} />
            <Route path="/payroll/salary-structures" element={<SalaryStructuresPage />} />
            <Route path="/payroll/salary-rules" element={<SalaryRulesPage />} />

            {/* Reports & System Administration */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
