const db = require('../config/db');

// GET /api/reports/payroll
const getPayrollReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const [rows] = await db.query(
      `SELECT period_year, period_month, total_gross_pay, total_deductions, total_net_pay, status, paid_at
       FROM payrolls
       WHERE period_year = ?
       ORDER BY period_month ASC`,
      [year]
    );
    return res.json({ success: true, year, report: rows });
  } catch (error) {
    console.error('getPayrollReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/attendance
const getAttendanceReport = async (req, res) => {
  try {
    const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;
    const [rows] = await db.query(
      `SELECT e.id AS employee_id, e.first_name, e.last_name, e.employee_code, e.department,
              SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS days_present,
              SUM(CASE WHEN a.status = 'half_day' THEN 1 ELSE 0 END) AS days_half_day,
              SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS days_absent,
              COALESCE(SUM(a.total_hours), 0) AS total_hours_worked
       FROM employees e
       LEFT JOIN attendance a ON a.employee_id = e.id AND MONTH(a.date) = ? AND YEAR(a.date) = ?
       WHERE e.status = 'active'
       GROUP BY e.id`,
      [month, year]
    );
    return res.json({ success: true, month, year, report: rows });
  } catch (error) {
    console.error('getAttendanceReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/leave
const getLeaveReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const [rows] = await db.query(
      `SELECT e.id AS employee_id, e.first_name, e.last_name, e.employee_code, e.department,
              lr.leave_type,
              SUM(lr.total_days) AS total_days_taken,
              lr.status
       FROM employees e
       JOIN leave_requests lr ON lr.employee_id = e.id
       WHERE YEAR(lr.start_date) = ?
       GROUP BY e.id, lr.leave_type, lr.status`,
      [year]
    );
    return res.json({ success: true, year, report: rows });
  } catch (error) {
    console.error('getLeaveReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/salary
const getSalaryReport = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.department,
              COUNT(e.id) AS total_employees,
              AVG(c.base_salary) AS avg_base_salary,
              SUM(c.base_salary) AS total_base_payroll,
              SUM(c.hra_allowance + c.transport_allowance + c.other_allowance) AS total_allowances
       FROM employees e
       JOIN contracts c ON c.employee_id = e.id AND c.status = 'active'
       GROUP BY e.department`
    );
    return res.json({ success: true, report: rows });
  } catch (error) {
    console.error('getSalaryReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/tax
const getTaxReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const [rows] = await db.query(
      `SELECT p.period_month, p.period_year,
              SUM(ps.tax_deductions) AS total_tax_withheld,
              SUM(ps.gross_salary) AS total_taxable_gross
       FROM payslips ps
       JOIN payrolls p ON p.id = ps.payroll_id
       WHERE p.period_year = ? AND p.status = 'paid'
       GROUP BY p.period_month, p.period_year
       ORDER BY p.period_month ASC`,
      [year]
    );
    return res.json({ success: true, year, report: rows });
  } catch (error) {
    console.error('getTaxReport error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reports/export (Exports dataset summary formatted for Excel/CSV)
const exportReports = async (req, res) => {
  try {
    const { type = 'payroll' } = req.query;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report-export.json"`);

    if (type === 'employees') {
      const [rows] = await db.query(`SELECT * FROM employees`);
      return res.json({ dataset: 'employees', count: rows.length, data: rows });
    }

    const [rows] = await db.query(`SELECT * FROM payslips ORDER BY id DESC`);
    return res.json({ dataset: 'payroll', count: rows.length, data: rows });
  } catch (error) {
    console.error('exportReports error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPayrollReport,
  getAttendanceReport,
  getLeaveReport,
  getSalaryReport,
  getTaxReport,
  exportReports
};
