const db = require('../config/db');

// List all employees (with active contract summary)
const getAllEmployees = async (req, res) => {
  try {
    const { department, status, search, company_id } = req.query;
    let query = `
      SELECT e.*, 
             u.role,
             c.id AS contract_id, c.contract_type, c.base_salary, c.hra_allowance, 
             c.transport_allowance, c.other_allowance, c.tax_deduction_rate,
             c.status AS contract_status,
             b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code
      FROM employees e
      LEFT JOIN users u ON u.id = e.user_id
      LEFT JOIN contracts c ON c.employee_id = e.id AND c.status = 'active'
      LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
      WHERE 1=1
    `;
    const params = [];

    if (company_id) {
      query += ` AND e.company_id = ?`;
      params.push(company_id);
    }
    if (department) {
      query += ` AND e.department = ?`;
      params.push(department);
    }
    if (status) {
      query += ` AND e.status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.employee_code LIKE ? OR e.email LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ` ORDER BY e.id DESC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, employees: rows });
  } catch (error) {
    console.error('getAllEmployees error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const [employees] = await db.query(
      `SELECT e.*, u.email AS user_email, u.role,
              c.id AS contract_id, c.contract_type, c.base_salary, c.hra_allowance,
              c.transport_allowance, c.other_allowance, c.tax_deduction_rate, c.status AS contract_status,
              b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code
       FROM employees e
       LEFT JOIN users u ON u.id = e.user_id
       LEFT JOIN contracts c ON c.employee_id = e.id AND c.status = 'active'
       LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
       WHERE e.id = ?`,
      [id]
    );

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    return res.json({ success: true, employee: employees[0] });
  } catch (error) {
    console.error('getEmployeeById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      company_id = 1,
      employee_code,
      first_name,
      last_name,
      email,
      phone,
      department,
      designation,
      joining_date,
      bank_name,
      bank_account_no,
      bank_ifsc_code,
      role = 'employee',
      password = 'password123'
    } = req.body;

    if (!employee_code || !first_name || !last_name || !email || !department || !designation || !joining_date) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Missing required employee fields.' });
    }

    // 1. Create User
    const [userResult] = await conn.query(
      `INSERT INTO users (company_id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [company_id, email, `hash_${password}`, role]
    );
    const userId = userResult.insertId;

    // 2. Create Employee
    const [empResult] = await conn.query(
      `INSERT INTO employees 
       (company_id, user_id, employee_code, first_name, last_name, email, phone, department, designation, joining_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [company_id, userId, employee_code, first_name, last_name, email, phone, department, designation, joining_date]
    );
    const empId = empResult.insertId;

    // 3. Optional Bank Account
    if (bank_name && bank_account_no) {
      await conn.query(
        `INSERT INTO bank_accounts (employee_id, bank_name, account_number, ifsc_code, is_primary)
         VALUES (?, ?, ?, ?, 1)`,
        [empId, bank_name, bank_account_no, bank_ifsc_code ?? null]
      );
    }

    await conn.commit();
    return res.status(201).json({
      success: true,
      message: 'Employee and user profile created successfully.',
      employee_id: empId,
      user_id: userId
    });
  } catch (error) {
    await conn.rollback();
    console.error('createEmployee error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// Update employee details
const updateEmployee = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const {
      first_name,
      last_name,
      phone,
      department,
      designation,
      status,
      bank_name,
      bank_account_no,
      bank_ifsc_code
    } = req.body;

    const [result] = await conn.query(
      `UPDATE employees 
       SET first_name = COALESCE(?, first_name),
           last_name = COALESCE(?, last_name),
           phone = COALESCE(?, phone),
           department = COALESCE(?, department),
           designation = COALESCE(?, designation),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [first_name, last_name, phone, department, designation, status, id]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    // Update bank info if provided
    if (bank_name || bank_account_no) {
      await conn.query(
        `INSERT INTO bank_accounts (employee_id, bank_name, account_number, ifsc_code, is_primary)
         VALUES (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE 
         bank_name = VALUES(bank_name), 
         account_number = VALUES(account_number), 
         ifsc_code = VALUES(ifsc_code)`,
        [id, bank_name ?? '', bank_account_no ?? '', bank_ifsc_code ?? null]
      );
    }

    await conn.commit();
    return res.json({ success: true, message: 'Employee updated successfully.' });
  } catch (error) {
    await conn.rollback();
    console.error('updateEmployee error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM employees WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }
    return res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (error) {
    console.error('deleteEmployee error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
