import db from '../config/db.js';

// Helper to reliably parse date strings (e.g. YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY) into MySQL DATE format YYYY-MM-DD
const formatDateForDb = (dateVal) => {
  if (!dateVal) return null;
  const str = String(dateVal).trim();
  if (!str) return null;

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Format DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Format YYYY/MM/DD
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const year = ymdMatch[1];
    const month = ymdMatch[2].padStart(2, '0');
    const day = ymdMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Try Date parsing
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  return null;
};

// GET /api/contracts
const getAllContracts = async (req, res) => {
  try {
    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'payroll', 'hr'];
    const isPrivileged = privilegedRoles.includes(req.user?.role?.toLowerCase());
    if (!isPrivileged) {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden: Insufficient privileges to view all contracts.' 
      });
    }

    const { status, employee_id } = req.query;
    let query = `
      SELECT c.*, 
             e.first_name, e.last_name, e.employee_code, e.department, e.designation,
             ss.name AS structure_name,
             b.bank_name, b.account_number AS bank_account_no, b.ifsc_code AS bank_ifsc_code
      FROM contracts c
      JOIN employees e ON e.id = c.employee_id
      LEFT JOIN salary_structures ss ON ss.id = c.structure_id
      LEFT JOIN bank_accounts b ON b.employee_id = e.id AND b.is_primary = 1
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      query += ` AND c.status = ?`;
      params.push(status.toLowerCase());
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
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation,
              ss.name AS structure_name
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       LEFT JOIN salary_structures ss ON ss.id = c.structure_id
       WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    const contract = rows[0];
    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'payroll', 'hr'];
    const userRole = (req.user?.role || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
    const isPrivileged = privilegedRoles.includes(userRole);

    const callerEmpId = req.user?.employee_id ? parseInt(req.user.employee_id, 10) : null;
    const contractEmpId = contract.employee_id ? parseInt(contract.employee_id, 10) : null;

    if (!isPrivileged) {
      if (!callerEmpId || !contractEmpId || callerEmpId !== contractEmpId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden: You do not have permission to view another employee's contract." 
        });
      }
    }

    return res.json({ success: true, contract });
  } catch (error) {
    console.error('getContractById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get active contract for an employee
const getContractByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const targetEmpId = parseInt(employeeId, 10);

    const privilegedRoles = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'payroll', 'hr'];
    const userRole = (req.user?.role || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
    const isPrivileged = privilegedRoles.includes(userRole);

    const callerEmpId = req.user?.employee_id ? parseInt(req.user.employee_id, 10) : null;

    if (!isPrivileged) {
      if (!callerEmpId || !targetEmpId || callerEmpId !== targetEmpId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden: You do not have permission to view another employee's contract." 
        });
      }
    }

    const [contracts] = await db.query(
      `SELECT c.*, e.first_name, e.last_name, e.employee_code, e.department, e.designation,
              ss.name AS structure_name
       FROM contracts c
       JOIN employees e ON e.id = c.employee_id
       LEFT JOIN salary_structures ss ON ss.id = c.structure_id
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
      structure_id,
      contract_type = 'full_time',
      base_salary = 0,
      hra_allowance = 0,
      transport_allowance = 0,
      other_allowance = 0,
      tax_deduction_rate = 0,
      start_date,
      end_date = null,
      status = 'active'
    } = req.body;

    if (!employee_id || !start_date) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Employee ID and start date are required.' });
    }

    // Resolve employee_id if passed as numeric or employee_code
    let targetEmployeeId = employee_id;
    if (typeof employee_id === 'string' && isNaN(Number(employee_id))) {
      const [empRows] = await conn.query('SELECT id FROM employees WHERE employee_code = ?', [employee_id]);
      if (empRows.length > 0) {
        targetEmployeeId = empRows[0].id;
      }
    } else {
      targetEmployeeId = parseInt(employee_id, 10);
    }

    // Format start and end dates cleanly
    const parsedStartDate = formatDateForDb(start_date);
    const parsedEndDate = formatDateForDb(end_date);

    if (!parsedStartDate) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Invalid start date format. Please provide a valid date.' });
    }

    // Normalize status and contract_type
    const normalizedStatus = (status || 'active').toLowerCase();
    const validStatuses = ['active', 'draft', 'expired', 'terminated'];
    const finalStatus = validStatuses.includes(normalizedStatus) ? normalizedStatus : 'active';

    const normalizedContractType = (contract_type || 'full_time').toLowerCase().replace('-', '_').replace(' ', '_');
    const validContractTypes = ['full_time', 'part_time', 'contract'];
    const finalContractType = validContractTypes.includes(normalizedContractType) ? normalizedContractType : 'full_time';

    const finalStructureId = structure_id ? parseInt(structure_id, 10) || 1 : 1;

    // Set any previous active contract to expired if the new contract is active
    if (finalStatus === 'active') {
      await conn.query(
        `UPDATE contracts SET status = 'expired' WHERE employee_id = ? AND status = 'active'`,
        [targetEmployeeId]
      );
    }

    // Insert new contract
    const [result] = await conn.query(
      `INSERT INTO contracts 
       (employee_id, structure_id, contract_type, base_salary, hra_allowance, transport_allowance, other_allowance, tax_deduction_rate, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        targetEmployeeId,
        finalStructureId,
        finalContractType,
        Number(base_salary) || 0,
        Number(hra_allowance) || 0,
        Number(transport_allowance) || 0,
        Number(other_allowance) || 0,
        Number(tax_deduction_rate) || 0,
        parsedStartDate,
        parsedEndDate,
        finalStatus
      ]
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
      structure_id,
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

    const parsedStartDate = start_date !== undefined ? formatDateForDb(start_date) : undefined;
    const parsedEndDate = end_date !== undefined ? formatDateForDb(end_date) : undefined;

    const normalizedStatus = status ? status.toLowerCase() : undefined;
    const normalizedContractType = contract_type ? contract_type.toLowerCase().replace('-', '_').replace(' ', '_') : undefined;

    const fields = [];
    const values = [];

    if (structure_id !== undefined) { fields.push('structure_id = ?'); values.push(parseInt(structure_id, 10) || 1); }
    if (normalizedContractType !== undefined) { fields.push('contract_type = ?'); values.push(normalizedContractType); }
    if (base_salary !== undefined) { fields.push('base_salary = ?'); values.push(Number(base_salary)); }
    if (hra_allowance !== undefined) { fields.push('hra_allowance = ?'); values.push(Number(hra_allowance)); }
    if (transport_allowance !== undefined) { fields.push('transport_allowance = ?'); values.push(Number(transport_allowance)); }
    if (other_allowance !== undefined) { fields.push('other_allowance = ?'); values.push(Number(other_allowance)); }
    if (tax_deduction_rate !== undefined) { fields.push('tax_deduction_rate = ?'); values.push(Number(tax_deduction_rate)); }
    if (parsedStartDate !== undefined) { fields.push('start_date = ?'); values.push(parsedStartDate); }
    if (parsedEndDate !== undefined) { fields.push('end_date = ?'); values.push(parsedEndDate); }
    if (normalizedStatus !== undefined) { fields.push('status = ?'); values.push(normalizedStatus); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update.' });
    }

    values.push(id);
    const [result] = await db.query(
      `UPDATE contracts SET ${fields.join(', ')} WHERE id = ?`,
      values
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
