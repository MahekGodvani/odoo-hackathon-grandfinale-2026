import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - DASHBOARD API SERVICE
 * Derives operational KPI cards, payroll warnings, and department salary costs from current mock state.
 */

export const dashboardApi = {
  getDashboardStats: async (filters = {}) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      
      // Calculate KPI card numbers dynamically from store
      const totalEmployees = db.employees.length;
      
      const totalNetSalary = db.payslips.reduce((sum, p) => sum + (p.net || 0), 0) || 693000;
      const payslipsGenerated = db.payslips.length;
      const approvedTimeOff = db.timeOffRequests.filter((r) => r.status === 'Approved').length;
      
      const presentCount = db.attendance.filter((a) => a.status === 'Present' || a.status === 'Overtime').length;
      const attendanceHealth = Math.round((presentCount / Math.max(1, db.attendance.length)) * 100) || 94;

      // Payroll Alerts
      const alerts = [];
      
      // Check missing bank details
      const missingBankEmps = db.employees.filter((e) => !e.bankDetails || !e.bankDetails.accountNo);
      missingBankEmps.forEach((e) => {
        alerts.push({ id: `alt-bank-${e.id}`, type: 'warning', text: `${e.name} has missing bank details`, link: `/employees/${e.id}` });
      });

      // Check missing active contract
      const empWithActiveContract = new Set(db.contracts.filter((c) => c.status === 'Active').map((c) => c.employeeId));
      db.employees.forEach((e) => {
        if (!empWithActiveContract.has(e.id)) {
          alerts.push({ id: `alt-ctr-${e.id}`, type: 'error', text: `${e.name} has no active contract assigned`, link: `/employees/${e.id}` });
        }
      });

      // Attendance summary counts
      const attendanceSummary = {
        present: db.attendance.filter((a) => a.status === 'Present').length,
        late: db.attendance.filter((a) => a.status === 'Late').length,
        absent: db.attendance.filter((a) => a.status === 'Absent').length,
        overtime: db.attendance.filter((a) => a.status === 'Overtime').length,
        missingCheckout: db.attendance.filter((a) => a.status === 'Missing Checkout').length,
      };

      // Time off summary counts
      const timeOffSummary = {
        approved: db.timeOffRequests.filter((r) => r.status === 'Approved').length,
        pending: db.timeOffRequests.filter((r) => r.status === 'Pending').length,
        remainingLeave: db.allocations.reduce((sum, a) => sum + (a.remaining || 0), 0),
      };

      // Department cost chart data
      const deptCostMap = {};
      db.contracts.forEach((c) => {
        if (c.status === 'Active') {
          deptCostMap[c.department] = (deptCostMap[c.department] || 0) + (c.wage || 0);
        }
      });
      
      const salaryByDepartment = Object.keys(deptCostMap).map((dept) => ({
        department: dept,
        cost: deptCostMap[dept],
      }));

      return {
        data: {
          kpis: {
            totalEmployees,
            totalNetSalary,
            payslipsGenerated,
            approvedTimeOff,
            attendanceHealth,
          },
          alerts,
          attendanceSummary,
          timeOffSummary,
          salaryByDepartment,
        }
      };
    }
    return apiClient.get('/dashboard/stats', { params: filters });
  }
};
