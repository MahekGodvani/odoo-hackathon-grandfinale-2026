import pool from '../config/db.js';

// GET /api/schedules
export const getSchedules = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules ORDER BY id');
    const schedules = rows.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type === 'full_time' ? 'Full-time' : s.type === 'part_time' ? 'Part-time' : s.type === 'shift' ? 'Shift' : 'Flexible',
      weeklyHours: Number(s.weekly_hours),
      pattern: typeof s.pattern === 'string' ? JSON.parse(s.pattern) : s.pattern,
      status: s.status === 'active' ? 'Active' : 'Inactive',
      createdAt: s.created_at
    }));
    res.json({ success: true, schedules });
  } catch (err) {
    console.error('getSchedules error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/schedules/:id
export const getSchedule = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM schedules WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Schedule not found' });
    const s = rows[0];
    res.json({
      success: true,
      schedule: {
        id: s.id,
        name: s.name,
        type: s.type === 'full_time' ? 'Full-time' : s.type === 'part_time' ? 'Part-time' : s.type === 'shift' ? 'Shift' : 'Flexible',
        weeklyHours: Number(s.weekly_hours),
        pattern: typeof s.pattern === 'string' ? JSON.parse(s.pattern) : s.pattern,
        status: s.status === 'active' ? 'Active' : 'Inactive'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/schedules
export const createSchedule = async (req, res) => {
  try {
    const { name, type, weekly_hours, pattern } = req.body;
    const dbType = (type || 'full_time').toLowerCase().replace('-', '_').replace(' ', '_');
    const [result] = await pool.query(
      'INSERT INTO schedules (name, type, weekly_hours, pattern) VALUES (?, ?, ?, ?)',
      [name, dbType, weekly_hours || 40, JSON.stringify(pattern || {})]
    );
    res.status(201).json({ success: true, schedule_id: result.insertId, message: 'Schedule created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/schedules/:id
export const updateSchedule = async (req, res) => {
  try {
    const { name, type, weekly_hours, pattern, status } = req.body;
    const fields = [];
    const values = [];
    if (name) { fields.push('name = ?'); values.push(name); }
    if (type) { fields.push('type = ?'); values.push(type.toLowerCase().replace('-', '_').replace(' ', '_')); }
    if (weekly_hours) { fields.push('weekly_hours = ?'); values.push(weekly_hours); }
    if (pattern) { fields.push('pattern = ?'); values.push(JSON.stringify(pattern)); }
    if (status) { fields.push('status = ?'); values.push(status.toLowerCase()); }
    if (fields.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Schedule updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
