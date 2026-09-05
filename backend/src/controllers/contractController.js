import db from '../config/db.js';

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

// Step 2: Assign / Create or Update contract
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

export {
  getContractByEmployee,
  assignContract
};

export default {
  getContractByEmployee,
  assignContract
};
