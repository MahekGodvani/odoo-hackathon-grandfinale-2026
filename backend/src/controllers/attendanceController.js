const db = require('../config/db');

// Log or update daily attendance
const logAttendance = async (req, res) => {
  try {
    const { employee_id, date, check_in, check_out, status = 'present' } = req.body;

    if (!employee_id || !date) {
      return res.status(400).json({ success: false, message: 'Employee ID and date are required.' });
    }

    let total_hours = 0;
    if (check_in && check_out) {
      const [hIn, mIn] = check_in.split(':').map(Number);
      const [hOut, mOut] = check_out.split(':').map(Number);
      const minutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
      total_hours = Math.max(0, (minutes / 60)).toFixed(2);
    }

    await db.query(
      `INSERT INTO attendance (employee_id, date, check_in, check_out, total_hours, status)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       check_in = VALUES(check_in),
       check_out = VALUES(check_out),
       total_hours = VALUES(total_hours),
       status = VALUES(status)`,
      [employee_id, date, check_in ?? null, check_out ?? null, total_hours, status]
    );

    return res.json({
      success: true,
      message: 'Attendance recorded successfully.'
    });
  } catch (error) {
    console.error('logAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance logs for month/year
const getAttendanceLogs = async (req, res) => {
  try {
    const { employee_id, month, year, date } = req.query;

    let query = `
      SELECT a.*, e.first_name, e.last_name, e.employee_code, e.department
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE 1=1
    `;
    const params = [];

    if (employee_id) {
      query += ` AND a.employee_id = ?`;
      params.push(employee_id);
    }
    if (date) {
      query += ` AND a.date = ?`;
      params.push(date);
    }
    if (month && year) {
      query += ` AND MONTH(a.date) = ? AND YEAR(a.date) = ?`;
      params.push(month, year);
    }

    query += ` ORDER BY a.date DESC, a.employee_id ASC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, attendance: rows });
  } catch (error) {
    console.error('getAttendanceLogs error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logAttendance,
  getAttendanceLogs
};
