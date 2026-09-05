import db from '../config/db.js';

// GET /api/payroll
const getPayrolls = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.email AS approved_by_email,
              (SELECT COUNT(*) FROM payslips ps WHERE ps.payroll_id = p.id) AS total_payslips
       FROM payrolls p
       LEFT JOIN users u ON u.id = p.approved_by_user_id
       ORDER BY p.period_year DESC, p.period_month DESC`
    );

    return res.json({ success: true, count: rows.length, payrolls: rows });
  } catch (error) {
    console.error('getPayrolls error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payroll/:id
const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const [payrolls] = await db.query(
      `SELECT p.*, u.email AS approved_by_email 
       FROM payrolls p 
       LEFT JOIN users u ON u.id = p.approved_by_user_id 
       WHERE p.id = ?`,
      [id]
    );

    if (payrolls.length === 0) {
      return res.status(404).json({ success: false, message: 'Payroll run not found.' });
    }

    const [payslips] = await db.query(
      `SELECT ps.*, e.first_name, e.last_name, e.employee_code, e.department
       FROM payslips ps
       JOIN employees e ON e.id = ps.employee_id
       WHERE ps.payroll_id = ?`,
      [id]
    );

    return res.json({
      success: true,
      payroll: payrolls[0],
      payslips
    });
  } catch (error) {
    console.error('getPayrollById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payroll/employee/:employeeId
const getEmployeePayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [payslips] = await db.query(
      `SELECT ps.*, p.period_month, p.period_year, p.status AS payroll_status, p.paid_at
       FROM payslips ps
       JOIN payrolls p ON p.id = ps.payroll_id
       WHERE ps.employee_id = ?
       ORDER BY p.period_year DESC, p.period_month DESC`,
      [employeeId]
    );

    return res.json({ success: true, count: payslips.length, payrolls: payslips });
  } catch (error) {
    console.error('getEmployeePayroll error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payroll/generate
const generatePayroll = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { period_month, period_year } = req.body;
    const month = parseInt(period_month, 10);
    const year = parseInt(period_year, 10);

    if (!month || !year || month < 1 || month > 12) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Valid period_month (1-12) and period_year required.' });
    }

    let payrollId;
    const [existing] = await conn.query(
      `SELECT id, status FROM payrolls WHERE period_month = ? AND period_year = ?`,
      [month, year]
    );

    if (existing.length > 0) {
      if (existing[0].status === 'paid') {
        await conn.rollback();
        return res.status(400).json({ success: false, message: 'This payroll period is already finalized and paid.' });
      }
      payrollId = existing[0].id;
      await conn.query(`DELETE FROM payslips WHERE payroll_id = ?`, [payrollId]);
    } else {
      const [insertPayroll] = await conn.query(
        `INSERT INTO payrolls (period_month, period_year, status) VALUES (?, ?, 'draft')`,
        [month, year]
      );
      payrollId = insertPayroll.insertId;
    }

    const [employees] = await conn.query(
      `SELECT e.id AS employee_id, e.first_name, e.last_name,
              c.id AS contract_id, c.base_salary, c.hra_allowance, 
              c.transport_allowance, c.other_allowance, c.tax_deduction_rate
       FROM employees e
       JOIN contracts c ON c.employee_id = e.id AND c.status = 'active'
       WHERE e.status != 'inactive' AND e.status != 'terminated'`
    );

    if (employees.length === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'No active employees with active contracts found.' });
    }

    const workingDaysInMonth = new Date(year, month, 0).getDate();

    let totalPayrollGross = 0;
    let totalPayrollDeductions = 0;
    let totalPayrollNet = 0;
    let payslipsCreated = 0;

    for (const emp of employees) {
      const [attRows] = await conn.query(
        `SELECT COUNT(*) AS present_count 
         FROM attendance 
         WHERE employee_id = ? 
           AND MONTH(date) = ? 
           AND YEAR(date) = ? 
           AND (status = 'present' OR status = 'half_day')`,
        [emp.employee_id, month, year]
      );
      const presentDays = attRows[0]?.present_count ?? workingDaysInMonth;

      const [leaveRows] = await conn.query(
        `SELECT leave_type, SUM(total_days) AS total_leave_days
         FROM leave_requests 
         WHERE employee_id = ? 
           AND status = 'approved'
           AND ((MONTH(start_date) = ? AND YEAR(start_date) = ?) OR (MONTH(end_date) = ? AND YEAR(end_date) = ?))
         GROUP BY leave_type`,
        [emp.employee_id, month, year, month, year]
      );

      let paidLeaveDays = 0;
      let unpaidLeaveDays = 0;

      for (const l of leaveRows) {
        if (l.leave_type === 'unpaid') {
          unpaidLeaveDays += Number(l.total_leave_days);
        } else {
          paidLeaveDays += Number(l.total_leave_days);
        }
      }

      // Salary Calculation Formula
      const baseSalary = parseFloat(emp.base_salary) || 0;
      const hra = parseFloat(emp.hra_allowance) || 0;
      const transport = parseFloat(emp.transport_allowance) || 0;
      const other = parseFloat(emp.other_allowance) || 0;
      const allowancesTotal = hra + transport + other;
      const grossSalary = baseSalary + allowancesTotal;

      const perDaySalary = baseSalary / workingDaysInMonth;
      const unpaidDeductions = parseFloat((perDaySalary * unpaidLeaveDays).toFixed(2));
      const taxRate = parseFloat(emp.tax_deduction_rate) || 0;
      const taxDeductions = parseFloat(((grossSalary - unpaidDeductions) * (taxRate / 100)).toFixed(2));
      const totalDeductions = parseFloat((unpaidDeductions + taxDeductions).toFixed(2));
      const netSalary = parseFloat((grossSalary - totalDeductions).toFixed(2));

      await conn.query(
        `INSERT INTO payslips 
         (payroll_id, employee_id, contract_id, working_days, present_days, paid_leave_days, unpaid_leave_days, 
          base_salary, allowances_total, gross_salary, tax_deductions, unpaid_deductions, total_deductions, net_salary, payment_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          payrollId, emp.employee_id, emp.contract_id, workingDaysInMonth, presentDays, paidLeaveDays, unpaidLeaveDays,
          baseSalary, allowancesTotal, grossSalary, taxDeductions, unpaidDeductions, totalDeductions, netSalary
        ]
      );

      totalPayrollGross += grossSalary;
      totalPayrollDeductions += totalDeductions;
      totalPayrollNet += netSalary;
      payslipsCreated++;
    }

    await conn.query(
      `UPDATE payrolls 
       SET total_gross_pay = ?, total_deductions = ?, total_net_pay = ?
       WHERE id = ?`,
      [totalPayrollGross, totalPayrollDeductions, totalPayrollNet, payrollId]
    );

    await conn.commit();

    return res.status(201).json({
      success: true,
      message: `Payroll cycle generated successfully. ${payslipsCreated} payslips computed.`,
      payroll_id: payrollId,
      summary: {
        period: `${month}/${year}`,
        working_days: workingDaysInMonth,
        employees_processed: payslipsCreated,
        total_gross_pay: totalPayrollGross.toFixed(2),
        total_deductions: totalPayrollDeductions.toFixed(2),
        total_net_pay: totalPayrollNet.toFixed(2)
      }
    });
  } catch (error) {
    await conn.rollback();
    console.error('generatePayroll error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// POST /api/payroll/:id/process
const processPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      `UPDATE payrolls SET status = 'processing' WHERE id = ? AND status = 'draft'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Payroll not found or not in draft status.' });
    }

    return res.json({ success: true, message: 'Payroll run set to processing.' });
  } catch (error) {
    console.error('processPayroll error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/payroll/:id/approve
const approvePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id ?? null;
    const [result] = await db.query(
      `UPDATE payrolls 
       SET status = 'approved', approved_by_user_id = ?
       WHERE id = ? AND (status = 'draft' OR status = 'processing')`,
      [userId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Payroll not found or is already finalized.' });
    }

    return res.json({ success: true, message: 'Payroll cycle approved successfully.' });
  } catch (error) {
    console.error('approvePayroll error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/payroll/:id/pay
const markPayrollPaid = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const today = new Date().toISOString().slice(0, 10);

    const [payResult] = await conn.query(
      `UPDATE payrolls 
       SET status = 'paid', paid_at = NOW()
       WHERE id = ? AND status = 'approved'`,
      [id]
    );

    if (payResult.affectedRows === 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Payroll not found or must be approved first.' });
    }

    await conn.query(
      `UPDATE payslips 
       SET payment_status = 'paid', payment_date = ?, email_sent = 1
       WHERE payroll_id = ?`,
      [today, id]
    );

    await conn.commit();
    return res.json({
      success: true,
      message: 'Payroll successfully marked as Paid. Payslips marked as disbursed.'
    });
  } catch (error) {
    await conn.rollback();
    console.error('markPayrollPaid error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

export {
  getPayrolls,
  getPayrollById,
  getEmployeePayroll,
  generatePayroll,
  processPayroll,
  approvePayroll,
  markPayrollPaid
};

export default {
  getPayrolls,
  getPayrollById,
  getEmployeePayroll,
  generatePayroll,
  processPayroll,
  approvePayroll,
  markPayrollPaid
};
