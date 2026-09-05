const db = require('../config/db');

// GET /api/salaries
const getSalaries = async (req, res) => {
  try {
    const [salaries] = await db.query(
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       ORDER BY c.id DESC`
    );
    return res.json({ success: true, count: salaries.length, salaries });
  } catch (error) {
    console.error('getSalaries error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/salaries/:employeeId
const getSalaryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [salaries] = await db.query(
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       WHERE c.employee_id = ?
       ORDER BY c.status = 'active' DESC, c.id DESC`,
      [employeeId]
    );

    if (salaries.length === 0) {
      return res.status(404).json({ success: false, message: 'No salary structure found for this employee.' });
    }

    return res.json({ success: true, salaries });
  } catch (error) {
    console.error('getSalaryByEmployeeId error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/salaries
const createSalary = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      employee_id,
      contract_type = 'full_time',
      base_salary = 0,
      hra_allowance = 0,
      transport_allowance = 0,
      other_allowance = 0,
      tax_deduction_rate = 0,
      start_date,
      end_date = null
    } = req.body;

    if (!employee_id || !start_date) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Employee ID and start date are required.' });
    }

    await conn.query(
      `UPDATE contracts SET status = 'expired' WHERE employee_id = ? AND status = 'active'`,
      [employee_id]
    );

    const [result] = await conn.query(
      `INSERT INTO contracts 
       (employee_id, contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [employee_id, contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, start_date, end_date]
    );

    await conn.commit();
    return res.status(201).json({
      success: true,
      message: 'Salary structure assigned successfully.',
      salary_id: result.insertId
    });
  } catch (error) {
    await conn.rollback();
    console.error('createSalary error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// PUT /api/salaries/:id
const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      contract_type,
      base_salary,
      hra_allowance,
      transport_allowance,
      other_allowance,
      tax_deduction_rate,
      status
    } = req.body;

    const [result] = await db.query(
      `UPDATE contracts 
       SET contract_type = COALESCE(?, contract_type),
           base_salary = COALESCE(?, base_salary),
           hra_allowance = COALESCE(?, hra_allowance),
           transport_allowance = COALESCE(?, transport_allowance),
           other_allowance = COALESCE(?, other_allowance),
           tax_deduction_rate = COALESCE(?, tax_deduction_rate),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found.' });
    }

    return res.json({ success: true, message: 'Salary structure updated successfully.' });
  } catch (error) {
    console.error('updateSalary error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/salaries/:id
const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM contracts WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Salary record not found.' });
    }
    return res.json({ success: true, message: 'Salary structure deleted successfully.' });
  } catch (error) {
    console.error('deleteSalary error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSalaries,
  getSalaryByEmployeeId,
  createSalary,
  updateSalary,
  deleteSalary
};
