import apiClient from './axios';

/**
 * PEOPLEPAY360 - DASHBOARD API SERVICE
 * Connects directly to backend /api/dashboard/stats — no mock fallback.
 */

export const dashboardApi = {
  getDashboardStats: async (filters = {}) => {
    try {
      const res = await apiClient.get('/dashboard/stats', { params: filters });
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        const kpis = {
          totalEmployees: d.kpis?.totalEmployees ?? d.total_employees ?? 0,
          activeEmployees: d.kpis?.activeEmployees ?? d.active_employees ?? 0,
          totalNetSalary: Number(d.kpis?.totalNetSalary ?? d.ytd_payroll_payout ?? 0),
          payslipsGenerated: d.kpis?.payslipsGenerated ?? d.total_payroll_runs ?? 0,
          approvedTimeOff: d.kpis?.approvedTimeOff ?? 0,
          attendanceHealth: d.kpis?.attendanceHealth ?? 100,
        };
        const salaryByDepartment = Array.isArray(d.salaryByDepartment) && d.salaryByDepartment.length > 0
          ? d.salaryByDepartment
          : (Array.isArray(d.departments)
              ? d.departments.map(dept => ({ department: dept.department || 'General', cost: Number(dept.cost || 0) }))
              : []);
        const alerts = Array.isArray(d.alerts) ? d.alerts : [];
        const attendanceSummary = d.attendanceSummary || {
          present: 0, late: 0, absent: 0, overtime: 0, missingCheckout: 0
        };
        const timeOffSummary = d.timeOffSummary || {
          approved: 0, pending: 0, remainingLeave: 0
        };
        return {
          data: {
            kpis,
            alerts,
            attendanceSummary,
            timeOffSummary,
            salaryByDepartment
          }
        };
      }
    } catch (err) {
      console.warn('Backend dashboard stats request failed:', err?.message);
    }
    return {
      data: {
        kpis: { totalEmployees: 0, activeEmployees: 0, totalNetSalary: 0, payslipsGenerated: 0, approvedTimeOff: 0, attendanceHealth: 100 },
        alerts: [],
        attendanceSummary: { present: 0, late: 0, absent: 0, overtime: 0, missingCheckout: 0 },
        timeOffSummary: { approved: 0, pending: 0, remainingLeave: 0 },
        salaryByDepartment: []
      }
    };
  },

  getTopRankings: async (filters = {}) => {
    try {
      const res = await apiClient.get('/dashboard/rankings', { params: filters });
      if (res.data?.success && res.data.data) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend rankings request failed:', err?.message);
    }
    return {
      success: false,
      data: {
        topWorkingHours: [],
        topAttendance: [],
        topPayroll: []
      }
    };
  }
};
