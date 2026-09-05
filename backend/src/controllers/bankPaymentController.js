const db = require('../config/db');

// -------------------------------------------------------------
// BANK ACCOUNTS
// -------------------------------------------------------------

// POST /api/bank-accounts
const createBankAccount = async (req, res) => {
  try {
    const { employee_id, bank_name, account_number, ifsc_code, account_type = 'salary', is_primary = 1 } = req.body;
    if (!employee_id || !bank_name || !account_number) {
      return res.status(400).json({ success: false, message: 'Employee ID, bank name, and account number are required.' });
    }

    if (is_primary) {
      await db.query(`UPDATE bank_accounts SET is_primary = 0 WHERE employee_id = ?`, [employee_id]);
    }

    const [result] = await db.query(
      `INSERT INTO bank_accounts (employee_id, bank_name, account_number, ifsc_code, account_type, is_primary)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_id, bank_name, account_number, ifsc_code ?? null, account_type, is_primary ? 1 : 0]
    );

    return res.status(201).json({
      success: true,
      message: 'Bank account added successfully.',
      bank_account_id: result.insertId
    });
  } catch (error) {
    console.error('createBankAccount error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bank-accounts/:employeeId
const getBankAccountsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [accounts] = await db.query(
      `SELECT * FROM bank_accounts WHERE employee_id = ? ORDER BY is_primary DESC, id DESC`,
      [employeeId]
    );
    return res.json({ success: true, count: accounts.length, bank_accounts: accounts });
  } catch (error) {
    console.error('getBankAccountsByEmployee error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/bank-accounts/:id
const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { bank_name, account_number, ifsc_code, account_type, is_primary } = req.body;

    const [result] = await db.query(
      `UPDATE bank_accounts 
       SET bank_name = COALESCE(?, bank_name),
           account_number = COALESCE(?, account_number),
           ifsc_code = COALESCE(?, ifsc_code),
           account_type = COALESCE(?, account_type),
           is_primary = COALESCE(?, is_primary)
       WHERE id = ?`,
      [bank_name, account_number, ifsc_code, account_type, is_primary, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Bank account not found.' });
    }

    return res.json({ success: true, message: 'Bank account updated successfully.' });
  } catch (error) {
    console.error('updateBankAccount error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// PAYMENTS
// -------------------------------------------------------------

// POST /api/payments
const recordPayment = async (req, res) => {
  try {
    const { payroll_id, employee_id, amount, payment_method = 'bank_transfer', transaction_ref, payment_date } = req.body;

    if (!employee_id || !amount) {
      return res.status(400).json({ success: false, message: 'Employee ID and payment amount are required.' });
    }

    const payDate = payment_date ?? new Date().toISOString().slice(0, 10);

    const [result] = await db.query(
      `INSERT INTO payments (payroll_id, employee_id, amount, payment_method, transaction_ref, status, payment_date)
       VALUES (?, ?, ?, ?, ?, 'completed', ?)`,
      [payroll_id ?? null, employee_id, amount, payment_method, transaction_ref ?? `TXN-${Date.now()}`, payDate]
    );

    return res.status(201).json({
      success: true,
      message: 'Payment recorded successfully.',
      payment_id: result.insertId
    });
  } catch (error) {
    console.error('recordPayment error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payments
const getPayments = async (req, res) => {
  try {
    const { employee_id, payroll_id } = req.query;
    let query = `
      SELECT p.*, e.first_name, e.last_name, e.employee_code, e.department
      FROM payments p
      JOIN employees e ON e.id = p.employee_id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ` AND p.employee_id = ?`;
      params.push(employee_id);
    }
    if (payroll_id) {
      query += ` AND p.payroll_id = ?`;
      params.push(payroll_id);
    }

    query += ` ORDER BY p.payment_date DESC, p.id DESC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, payments: rows });
  } catch (error) {
    console.error('getPayments error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/payments/:id
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, e.first_name, e.last_name, e.employee_code, e.department,
              b.bank_name, b.account_number AS bank_account_no
       FROM payments p
       JOIN employees e ON e.id = p.employee_id
       LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    return res.json({ success: true, payment: rows[0] });
  } catch (error) {
    console.error('getPaymentById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBankAccount,
  getBankAccountsByEmployee,
  updateBankAccount,
  recordPayment,
  getPayments,
  getPaymentById
};
