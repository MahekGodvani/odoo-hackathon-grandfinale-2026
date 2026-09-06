import pool from '../config/db.js';

// GET /api/salary-structures
export const getSalaryStructures = async (req, res) => {
  try {
    const [structures] = await pool.query(`
      SELECT ss.*, 
        (SELECT COUNT(*) FROM contracts c WHERE c.status = 'active') as employee_count
      FROM salary_structures ss 
      ORDER BY ss.id
    `);
    const result = structures.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      employeeCount: Number(s.employee_count || 0),
      status: s.status === 'active' ? 'Active' : 'Inactive',
      createdAt: s.created_at
    }));
    res.json({ success: true, structures: result });
  } catch (err) {
    console.error('getSalaryStructures error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/salary-structures
export const createSalaryStructure = async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      'INSERT INTO salary_structures (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({ success: true, structure_id: result.insertId, message: 'Salary structure created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/salary-structures/:id
export const updateSalaryStructure = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (status) { fields.push('status = ?'); values.push(status.toLowerCase()); }
    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE salary_structures SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Salary structure updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/salary-rules
export const getSalaryRules = async (req, res) => {
  try {
    const { structure_id } = req.query;
    let query = 'SELECT * FROM salary_rules';
    const params = [];
    if (structure_id) {
      query += ' WHERE structure_id = ?';
      params.push(structure_id);
    }
    query += ' ORDER BY sequence';
    const [rows] = await pool.query(query, params);
    const rules = rows.map(r => ({
      id: r.id,
      structureId: r.structure_id,
      name: r.name,
      code: r.code,
      category: r.category.charAt(0).toUpperCase() + r.category.slice(1),
      sequence: r.sequence,
      calculationType: r.calculation_type === 'fixed' ? 'Fixed Amount' : r.calculation_type === 'percentage' ? 'Percentage' : 'Formula',
      value: Number(r.value),
      baseRule: r.base_rule || '',
      status: r.status === 'active' ? 'Active' : 'Inactive'
    }));
    res.json({ success: true, rules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/salary-rules
export const createSalaryRule = async (req, res) => {
  try {
    const { structure_id, name, code, category, sequence, calculation_type, value, base_rule } = req.body;
    const dbCategory = (category || 'basic').toLowerCase();
    const dbCalcType = (calculation_type || 'fixed').toLowerCase().replace(' amount', '').replace(' ', '_');
    const [result] = await pool.query(
      'INSERT INTO salary_rules (structure_id, name, code, category, sequence, calculation_type, value, base_rule) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [structure_id || null, name, code, dbCategory, sequence || 1, dbCalcType, value || 0, base_rule || null]
    );
    res.status(201).json({ success: true, rule_id: result.insertId, message: 'Salary rule created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/salary-rules/:id
export const updateSalaryRule = async (req, res) => {
  try {
    const { name, code, category, sequence, calculation_type, value, base_rule, status } = req.body;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (code) { fields.push('code = ?'); values.push(code); }
    if (category) { fields.push('category = ?'); values.push(category.toLowerCase()); }
    if (sequence) { fields.push('sequence = ?'); values.push(sequence); }
    if (calculation_type) { fields.push('calculation_type = ?'); values.push(calculation_type.toLowerCase().replace(' amount', '').replace(' ', '_')); }
    if (value !== undefined) { fields.push('value = ?'); values.push(value); }
    if (base_rule !== undefined) { fields.push('base_rule = ?'); values.push(base_rule); }
    if (status) { fields.push('status = ?'); values.push(status.toLowerCase()); }
    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE salary_rules SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Salary rule updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
