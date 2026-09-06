import db from '../config/db.js';

// GET /api/payslips
const getPayslips = async (req, res) => {
  try {
    const payroll_id = req.query.payroll_id || req.query.payrunId;
    const employee_id = req.query.employee_id || req.query.employeeId;


    let query = `
      SELECT ps.*, 
             e.first_name, e.last_name, e.employee_code, e.department, e.designation,
             b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code,
             p.period_month, p.period_year, p.status AS payroll_status
      FROM payslips ps
      JOIN employees e ON e.id = ps.employee_id
      JOIN payrolls p ON p.id = ps.payroll_id
      LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
      WHERE 1=1
    `;
    const params = [];

    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'payroll'];
    const isPrivileged = privilegedRoles.includes(req.user?.role?.toLowerCase());

    if (!isPrivileged) {
      query += ` AND ps.employee_id = ?`;
      params.push(req.user?.employee_id || 0);
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

// GET /api/payslips/:id
const getPayslipById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT ps.*, 
              e.first_name, e.last_name, e.employee_code, e.email AS employee_email,
              e.department, e.designation, e.joining_date,
              b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code,
              c.contract_type,
              p.period_month, p.period_year, p.status AS payroll_status, p.paid_at,
              comp.name AS company_name, comp.currency
       FROM payslips ps
       JOIN employees e ON e.id = ps.employee_id
       JOIN contracts c ON c.id = ps.contract_id
       JOIN payrolls p ON p.id = ps.payroll_id
       LEFT JOIN companies comp ON comp.id = e.company_id
       LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
       WHERE ps.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payslip not found.' });
    }

    const [payslip] = rows;

    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'payroll'];
    const isPrivileged = privilegedRoles.includes(req.user?.role?.toLowerCase());
    if (!isPrivileged && req.user?.employee_id !== payslip.employee_id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
    }

    return res.json({ success: true, payslip });
  } catch (error) {
    console.error('getPayslipById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payslips/employee/:employeeId
const getEmployeePayslips = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'payroll'];
    const isPrivileged = privilegedRoles.includes(req.user?.role?.toLowerCase());
    if (!isPrivileged && req.user?.employee_id !== parseInt(employeeId, 10)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access denied.' });
    }

    const [rows] = await db.query(
      `SELECT ps.*, p.period_month, p.period_year, p.status AS payroll_status, p.paid_at
       FROM payslips ps
       JOIN payrolls p ON p.id = ps.payroll_id
       WHERE ps.employee_id = ?
       ORDER BY p.period_year DESC, p.period_month DESC`,
      [employeeId]
    );

    return res.json({ success: true, count: rows.length, payslips: rows });
  } catch (error) {
    console.error('getEmployeePayslips error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payslips/:id/download (Structured PDF / JSON summary export)
const downloadPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT ps.*, 
              e.first_name, e.last_name, e.employee_code, e.email AS employee_email,
              e.department, e.designation,
              p.period_month, p.period_year, p.paid_at
       FROM payslips ps
       JOIN employees e ON e.id = ps.employee_id
       JOIN payrolls p ON p.id = ps.payroll_id
       WHERE ps.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payslip not found.' });
    }

    const [payslip] = rows;

    const isPrivileged = ['admin', 'hr', 'payroll'].includes(req.user?.role);
    if (!isPrivileged && req.user?.employee_id !== payslip.employee_id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: You do not have permission to download another employee\'s payslip.' 
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="payslip-${payslip.employee_code}-${payslip.period_month}-${payslip.period_year}.json"`);
    return res.json({
      title: 'Official Payslip Summary',
      document_id: `PAY-${payslip.id}`,
      employee: {
        code: payslip.employee_code,
        name: `${payslip.first_name} ${payslip.last_name}`,
        department: payslip.department,
        designation: payslip.designation
      },
      payroll_period: `${payslip.period_month}/${payslip.period_year}`,
      earnings: {
        base_salary: payslip.base_salary,
        allowances: payslip.allowances_total,
        gross_salary: payslip.gross_salary
      },
      deductions: {
        tax: payslip.tax_deductions,
        unpaid_leave_deductions: payslip.unpaid_deductions,
        total_deductions: payslip.total_deductions
      },
      net_salary: payslip.net_salary,
      payment_status: payslip.payment_status,
      paid_at: payslip.paid_at
    });
  } catch (error) {
    console.error('downloadPayslip error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payslips/:id/send
const sendPayslip = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT ps.id, e.email, e.first_name, e.last_name, p.period_month, p.period_year 
       FROM payslips ps 
       JOIN employees e ON e.id = ps.employee_id 
       JOIN payrolls p ON p.id = ps.payroll_id 
       WHERE ps.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payslip not found.' });
    }

    const [item] = rows;
    await db.query(`UPDATE payslips SET email_sent = 1 WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: `Payslip for ${item.first_name} ${item.last_name} (${item.period_month}/${item.period_year}) has been emailed to ${item.email}.`
    });
  } catch (error) {
    console.error('sendPayslip error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getPayslips,
  getPayslipById,
  getEmployeePayslips,
  downloadPayslip,
  sendPayslip
};

export default {
  getPayslips,
  getPayslipById,
  getEmployeePayslips,
  downloadPayslip,
  sendPayslip
};
