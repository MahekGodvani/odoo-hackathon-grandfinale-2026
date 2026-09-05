import db from '../config/db.js';

// GET /api/contracts
const getAllContracts = async (req, res) => {
  try {
    const { status, employee_id } = req.query;
    let query = `
      SELECT c.*, 
             e.first_name, e.last_name, e.employee_code, e.department, e.designation,
             b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code
      FROM contracts c
      JOIN employees e ON e.id = c.employee_id
      LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      query += ` AND c.status = ?`;
      params.push(status);
    }
    if (employee_id) {
      query += ` AND c.employee_id = ?`;
      params.push(employee_id);
    }
    query += ` ORDER BY c.id DESC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, contracts: rows });
  } catch (error) {
    console.error('getAllContracts error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/contracts/:id
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }
    return res.json({ success: true, contract: rows[0] });
  } catch (error) {
    console.error('getContractById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get active contract for an employee
const getContractByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [contracts] = await db.query(
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       WHERE c.employee_id = ?
       ORDER BY c.id DESC`,
      [employeeId]
    );

    if (contracts.length === 0) {
      return res.status(404).json({ success: false, message: 'No contract found for this employee.' });
    }

    return res.json({ success: true, contracts });
  } catch (error) {
    console.error('getContractByEmployee error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Step 2: Assign / Create contract
const assignContract = async (req, res) => {
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

    // Set any previous active contract to expired
    await conn.query(
      `UPDATE contracts SET status = 'expired' WHERE employee_id = ? AND status = 'active'`,
      [employee_id]
    );

    // Insert new contract
    const [result] = await conn.query(
      `INSERT INTO contracts 
       (employee_id, contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [employee_id, contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, start_date, end_date]
    );

    await conn.commit();
    return res.status(201).json({
      success: true,
      message: 'Contract assigned successfully.',
      contract_id: result.insertId
    });
  } catch (error) {
    await conn.rollback();
    console.error('assignContract error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// PUT /api/contracts/:id
const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      contract_type,
      base_salary,
      hra_allowance,
      transport_allowance,
      other_allowance,
      tax_deduction_rate,
      start_date,
      end_date,
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
           start_date = COALESCE(?, start_date),
           end_date = COALESCE(?, end_date),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        contract_type,
        base_salary,
        hra_allowance,
        transport_allowance,
        other_allowance,
        tax_deduction_rate,
        start_date,
        end_date,
        status,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    return res.json({ success: true, message: 'Contract updated successfully.' });
  } catch (error) {
    console.error('updateContract error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllContracts,
  getContractById,
  getContractByEmployee,
  assignContract,
  updateContract
};

export default {
  getAllContracts,
  getContractById,
  getContractByEmployee,
  assignContract,
  updateContract
};

