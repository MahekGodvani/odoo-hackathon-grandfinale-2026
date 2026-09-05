import db from '../config/db.js';

// GET /api/dashboard/admin
const getAdminDashboard = async (req, res) => {
  try {
    const [[empStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_employees,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_employees,
        SUM(CASE WHEN status = 'probation' THEN 1 ELSE 0 END) AS probation_employees
      FROM employees
    `);

    const [[payrollStats]] = await db.query(`
      SELECT 
        COALESCE(SUM(total_net_pay), 0) AS ytd_payout,
        COUNT(*) AS total_payruns
      FROM payrolls
      WHERE status = 'paid'
    `);

    const [deptDistribution] = await db.query(`
      SELECT department, COUNT(*) AS count 
      FROM employees 
      GROUP BY department
    `);

    const [latestPayrolls] = await db.query(`
      SELECT * FROM payrolls ORDER BY period_year DESC, period_month DESC LIMIT 3
    `);

    return res.json({
      success: true,
      data: {
        total_employees: empStats?.total_employees ?? 0,
        active_employees: empStats?.active_employees ?? 0,
        ytd_payroll_payout: parseFloat(payrollStats?.ytd_payout ?? 0).toFixed(2),
        total_payroll_runs: payrollStats?.total_payruns ?? 0,
        departments: deptDistribution,
        recent_payrolls: latestPayrolls
      }
    });
  } catch (error) {
    console.error('getAdminDashboard error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/hr
const getHrDashboard = async (req, res) => {
  try {
    const [[empStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_employees,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_employees,
        SUM(CASE WHEN status = 'probation' THEN 1 ELSE 0 END) AS probation_employees,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_employees
      FROM employees
    `);

    const [[leaveStats]] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_leaves,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_leaves,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_leaves
      FROM leave_requests
    `);

    const [pendingLeaveDetails] = await db.query(`
      SELECT lr.*, e.first_name, e.last_name, e.employee_code, e.department
      FROM leave_requests lr
      JOIN employees e ON e.id = lr.employee_id
      WHERE lr.status = 'pending'
      ORDER BY lr.created_at DESC
      LIMIT 10
    `);

    return res.json({
      success: true,
      data: {
        employees: empStats,
        leaves: leaveStats,
        pending_leaves_queue: pendingLeaveDetails
      }
    });
  } catch (error) {
    console.error('getHrDashboard error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/employee
const getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'No employee profile linked to this user.' });
    }

    const [employees] = await db.query(`SELECT * FROM employees WHERE id = ?`, [employeeId]);
    const [contracts] = await db.query(`SELECT * FROM contracts WHERE employee_id = ? AND status = 'active'`, [employeeId]);
    const [leaves] = await db.query(`SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY id DESC LIMIT 5`, [employeeId]);
    const [payslips] = await db.query(`SELECT * FROM payslips WHERE employee_id = ? ORDER BY id DESC LIMIT 6`, [employeeId]);
    const [todayAttendance] = await db.query(`SELECT * FROM attendance WHERE employee_id = ? AND date = CURDATE()`, [employeeId]);

    return res.json({
      success: true,
      data: {
        profile: employees[0] ?? null,
        active_contract: contracts[0] ?? null,
        today_attendance: todayAttendance[0] ?? null,
        recent_leaves: leaves,
        recent_payslips: payslips
      }
    });
  } catch (error) {
    console.error('getEmployeeDashboard error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/payroll-summary
const getPayrollSummary = async (req, res) => {
  try {
    const [monthlyPayroll] = await db.query(`
      SELECT 
        period_year, 
        period_month, 
        total_gross_pay, 
        total_deductions, 
        total_net_pay, 
        status
      FROM payrolls
      ORDER BY period_year DESC, period_month DESC
      LIMIT 12
    `);

    return res.json({ success: true, count: monthlyPayroll.length, summary: monthlyPayroll });
  } catch (error) {
    console.error('getPayrollSummary error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/dashboard/attendance-summary
const getAttendanceSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [[todayStats]] = await db.query(`
      SELECT 
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_today,
        SUM(CASE WHEN status = 'half_day' THEN 1 ELSE 0 END) AS half_day_today,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent_today,
        SUM(CASE WHEN status = 'on_leave' THEN 1 ELSE 0 END) AS on_leave_today
      FROM attendance
      WHERE date = ?`,
      [today]
    );

    const [[totalActive]] = await db.query(`SELECT COUNT(*) AS total FROM employees WHERE status = 'active'`);

    return res.json({
      success: true,
      date: today,
      data: {
        total_active_employees: totalActive?.total ?? 0,
        present: todayStats?.present_today ?? 0,
        half_day: todayStats?.half_day_today ?? 0,
        absent: todayStats?.absent_today ?? 0,
        on_leave: todayStats?.on_leave_today ?? 0
      }
    });
  } catch (error) {
    console.error('getAttendanceSummary error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Legacy alias
const getDashboardStats = getAdminDashboard;

export {
  getAdminDashboard,
  getHrDashboard,
  getEmployeeDashboard,
  getPayrollSummary,
  getAttendanceSummary,
  getDashboardStats
};

export default {
  getAdminDashboard,
  getHrDashboard,
  getEmployeeDashboard,
  getPayrollSummary,
  getAttendanceSummary,
  getDashboardStats
};
