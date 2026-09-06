import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLES } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';

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
import BusinessModelPage from './pages/business/BusinessModelPage';
import BusinessFlowPage from './pages/business/BusinessFlowPage';
import B2BPortalPage from './pages/business/B2BPortalPage';
import LandingPage from './pages/landing/LandingPage';

/**
 * PEOPLEPAY360 - ROUTER APP ENTRY POINT
 * Configures all public, landing, and role-protected routes for the operational platform.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Layout Frame */}
          <Route
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MainLayout />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Employee Operational Hub Routes */}
            <Route
              path="/employees"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <EmployeesPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <EmployeeDetailPage />
                </RoleProtectedRoute>
              }
            />

            {/* HR Core Modules */}
            <Route
              path="/contracts"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <ContractsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/schedules"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <SchedulesPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/attendance" element={<AttendancePage />} />

            {/* Time Off Management */}
            <Route path="/time-off/requests" element={<TimeOffRequestsPage />} />
            <Route
              path="/time-off/allocations"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <TimeOffAllocationsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/time-off/types"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <TimeOffTypesPage />
                </RoleProtectedRoute>
              }
            />

            {/* Payroll Hero Workflows */}
            <Route
              path="/payroll/payruns"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_PAYROLL_USER]}>
                  <PayrunsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/payroll/payruns/:id"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_PAYROLL_USER]}>
                  <PayrunDetailPage />
                </RoleProtectedRoute>
              }
            />
            <Route path="/payroll/payslips" element={<PayslipsPage />} />
            <Route path="/payroll/payslips/:id" element={<PayslipDetailPage />} />
            <Route
              path="/payroll/salary-structures"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_PAYROLL_USER]}>
                  <SalaryStructuresPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/payroll/salary-rules"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_PAYROLL_USER]}>
                  <SalaryRulesPage />
                </RoleProtectedRoute>
              }
            />

            {/* Reports & System Administration */}
            <Route
              path="/reports"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.HR_MANAGER]}>
                  <ReportsPage />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <UsersPage />
                </RoleProtectedRoute>
              }
            />

            {/* Commercial & Business Strategy */}
            <Route path="/business-model" element={<BusinessModelPage />} />
            <Route path="/business-flow" element={<BusinessFlowPage />} />
            <Route path="/b2b-portal" element={<B2BPortalPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
