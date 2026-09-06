import pool from '../config/db.js';

// GET /api/leave-types
export const getLeaveTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM leave_types ORDER BY id');
    const types = rows.map(t => ({
      id: t.id,
      name: t.name,
      unit: t.unit === 'days' ? 'Days' : 'Hours',
      requiresApproval: !!t.requires_approval,
      requiresAllocation: !!t.requires_allocation,
      payrollIntegration: !!t.payroll_integration,
      status: t.status === 'active' ? 'Active' : 'Inactive'
    }));
    res.json({ success: true, leaveTypes: types });
  } catch (err) {
    console.error('getLeaveTypes error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/leave-types
export const createLeaveType = async (req, res) => {
  try {
    const { name, unit, requires_approval, requires_allocation, payroll_integration } = req.body;
    const [result] = await pool.query(
      'INSERT INTO leave_types (name, unit, requires_approval, requires_allocation, payroll_integration) VALUES (?, ?, ?, ?, ?)',
      [name, (unit || 'days').toLowerCase(), requires_approval ?? 1, requires_allocation ?? 1, payroll_integration ?? 1]
    );
    res.status(201).json({ success: true, leave_type_id: result.insertId, message: 'Leave type created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/leave-types/:id
export const updateLeaveType = async (req, res) => {
  try {
    const { name, unit, requires_approval, requires_allocation, payroll_integration, status } = req.body;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (unit) { fields.push('unit = ?'); values.push(unit.toLowerCase()); }
    if (requires_approval !== undefined) { fields.push('requires_approval = ?'); values.push(requires_approval ? 1 : 0); }
    if (requires_allocation !== undefined) { fields.push('requires_allocation = ?'); values.push(requires_allocation ? 1 : 0); }
    if (payroll_integration !== undefined) { fields.push('payroll_integration = ?'); values.push(payroll_integration ? 1 : 0); }
    if (status) { fields.push('status = ?'); values.push(status.toLowerCase()); }
    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE leave_types SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Leave type updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/leave-allocations
export const getAllocations = async (req, res) => {
  try {
    const { employee_id } = req.query;
    let query = `
      SELECT la.*, lt.name as leave_type_name, 
        e.first_name, e.last_name, e.employee_code
      FROM leave_allocations la
      JOIN leave_types lt ON la.leave_type_id = lt.id
      JOIN employees e ON la.employee_id = e.id
    `;
    const params = [];

    // Employees can only view their own allocations; Admins, HR & Payroll can view all or filter
    if (req.user?.role === 'employee') {
      query += ' WHERE la.employee_id = ?';
      params.push(req.user.employee_id);
    } else if (employee_id) {
      query += ' WHERE la.employee_id = ?';
      params.push(employee_id);
    }
    query += ' ORDER BY la.id';
    const [rows] = await pool.query(query, params);
    const allocations = rows.map(a => ({
      id: a.id,
      employeeId: a.employee_id,
      employeeName: `${a.first_name} ${a.last_name}`.trim(),
      employeeCode: a.employee_code,
      typeId: a.leave_type_id,
      typeName: a.leave_type_name,
      allocated: a.allocated,
      taken: a.taken,
      remaining: a.remaining,
      validFrom: a.valid_from ? String(a.valid_from).slice(0, 10) : null,
      validTo: a.valid_to ? String(a.valid_to).slice(0, 10) : null,
      status: a.status === 'active' ? 'Active' : 'Expired'
    }));
    res.json({ success: true, allocations });
  } catch (err) {
    console.error('getAllocations error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/leave-allocations
export const createAllocation = async (req, res) => {
  try {
    const { employee_id, leave_type_id, allocated, valid_from, valid_to } = req.body;
    const [result] = await pool.query(
      'INSERT INTO leave_allocations (employee_id, leave_type_id, allocated, taken, remaining, valid_from, valid_to) VALUES (?, ?, ?, 0, ?, ?, ?)',
      [employee_id, leave_type_id, allocated || 0, allocated || 0, valid_from || '2026-01-01', valid_to || '2026-12-31']
    );
    res.status(201).json({ success: true, allocation_id: result.insertId, message: 'Leave allocation created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/leave-allocations/:id
export const updateAllocation = async (req, res) => {
  try {
    const { allocated, taken, remaining, status } = req.body;
    const fields = [];
    const values = [];
    if (allocated !== undefined) { fields.push('allocated = ?'); values.push(allocated); }
    if (taken !== undefined) { fields.push('taken = ?'); values.push(taken); }
    if (remaining !== undefined) { fields.push('remaining = ?'); values.push(remaining); }
    if (status) { fields.push('status = ?'); values.push(status.toLowerCase()); }
    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE leave_allocations SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Allocation updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
