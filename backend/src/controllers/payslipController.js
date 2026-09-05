const db = require('../config/db');

// List payslips (filterable by payroll_id, employee_id)
const getPayslips = async (req, res) => {
  try {
    const { payroll_id, employee_id } = req.query;

    let query = `
      SELECT ps.*, 
             e.first_name, e.last_name, e.employee_code, e.department, e.designation,
             e.bank_name, e.bank_account_no, e.bank_ifsc_code,
             p.period_month, p.period_year, p.status AS payroll_status
      FROM payslips ps
      JOIN employees e ON e.id = ps.employee_id
      JOIN payrolls p ON p.id = ps.payroll_id
      WHERE 1=1
    `;
    const params = [];

    if (req.user?.role === 'employee' && req.user?.employee_id) {
      query += ` AND ps.employee_id = ?`;
      params.push(req.user.employee_id);
    } else if (employee_id) {
      query += ` AND ps.employee_id = ?`;
      params.push(employee_id);
    }

    if (payroll_id) {
      query += ` AND ps.payroll_id = ?`;
      params.push(payroll_id);
    }

    query += ` ORDER BY p.period_year DESC, p.period_month DESC, ps.id ASC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, payslips: rows });
  } catch (error) {
    console.error('getPayslips error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single payslip by ID
const getPayslipById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT ps.*, 
              e.first_name, e.last_name, e.employee_code, e.email AS employee_email,
              e.department, e.designation, e.joining_date,
              e.bank_name, e.bank_account_no, e.bank_ifsc_code,
              c.contract_type,
              p.period_month, p.period_year, p.status AS payroll_status, p.paid_at
       FROM payslips ps
       JOIN employees e ON e.id = ps.employee_id
       JOIN contracts c ON c.id = ps.contract_id
       JOIN payrolls p ON p.id = ps.payroll_id
       WHERE ps.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payslip not found.' });
    }

    const [payslip] = rows;

    if (req.user?.role === 'employee' && req.user?.employee_id !== payslip.employee_id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, payslip });
  } catch (error) {
    console.error('getPayslipById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPayslips,
  getPayslipById
};
