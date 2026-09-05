const db = require('../config/db');

// Get overall company metrics & summary stats
const getDashboardStats = async (req, res) => {
  try {
    const [[empStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_employees,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_employees,
        SUM(CASE WHEN status = 'probation' THEN 1 ELSE 0 END) AS probation_employees
      FROM employees
    `);

    const [[leaveStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_requests,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_leaves,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_leaves
      FROM leave_requests
    `);

    const [latestPayrolls] = await db.query(`
      SELECT * FROM payrolls 
      ORDER BY period_year DESC, period_month DESC 
      LIMIT 1
    `);

    const [deptDistribution] = await db.query(`
      SELECT department, COUNT(*) AS count 
      FROM employees 
      GROUP BY department
    `);

    const [recentAttendance] = await db.query(`
      SELECT a.*, e.first_name, e.last_name, e.employee_code
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      ORDER BY a.date DESC, a.id DESC
      LIMIT 5
    `);

    return res.json({
      success: true,
      data: {
        employees: {
          total: empStats?.total_employees ?? 0,
          active: empStats?.active_employees ?? 0,
          probation: empStats?.probation_employees ?? 0
        },
        leaves: {
          pending: leaveStats?.pending_leaves ?? 0,
          approved: leaveStats?.approved_leaves ?? 0
        },
        latest_payroll: latestPayrolls.length > 0 ? latestPayrolls[0] : null,
        departments: deptDistribution,
        recent_attendance: recentAttendance
      }
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats
};
