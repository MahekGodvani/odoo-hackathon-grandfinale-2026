const db = require('../config/db');

// List all payroll cycles
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

// Step 6, 7 & 8: Generate Payroll Run with Automatic Salary Calculation
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

    // 1. Create or get existing draft payroll
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
      // Clear previous draft payslips to recalculate
      await conn.query(`DELETE FROM payslips WHERE payroll_id = ?`, [payrollId]);
    } else {
      const [insertPayroll] = await conn.query(
        `INSERT INTO payrolls (period_month, period_year, status) VALUES (?, ?, 'draft')`,
        [month, year]
      );
      payrollId = insertPayroll.insertId;
    }

    // 2. Fetch all active employees who have an active contract
    const [employees] = await conn.query(
      `SELECT e.id AS employee_id, e.first_name, e.last_name,
              c.id AS contract_id, c.base_salary, c.hra_allowance, 
              c.transport_allowance, c.other_allowance, c.tax_deduction_rate
       FROM employees e
       JOIN contracts c ON c.employee_id = e.id AND c.status = 'active'
       WHERE e.status != 'inactive'`
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
      // 3. Attendance: Count present/half days
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

      // 4. Leave Calculation: Count approved paid and unpaid leaves
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

      // 5. 🧮 Salary Calculation Engine
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

      // 6. 🧾 Insert Payslip
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

    // Update payroll totals
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

// Step 9: Approve Payroll
const approvePayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      `UPDATE payrolls 
       SET status = 'approved', approved_by_user_id = ?
       WHERE id = ? AND status = 'draft'`,
      [req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Payroll not found or is not in draft status.' });
    }

    return res.json({ success: true, message: 'Payroll cycle approved successfully.' });
  } catch (error) {
    console.error('approvePayroll error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Step 10 & 11: Mark Salary as Paid & Disburse Payslips
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

module.exports = {
  getPayrolls,
  generatePayroll,
  approvePayroll,
  markPayrollPaid
};
