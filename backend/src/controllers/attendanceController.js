import db from '../config/db.js';

// Helper to compute total hours
const calculateHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const [hIn, mIn] = checkIn.split(':').map(Number);
  const [hOut, mOut] = checkOut.split(':').map(Number);
  const minutes = (hOut * 60 + mOut) - (hIn * 60 + mIn);
  return Math.max(0, (minutes / 60)).toFixed(2);
};

// POST /api/attendance/check-in
const checkIn = async (req, res) => {
  try {
    const employee_id = req.body.employee_id ?? req.user?.employee_id;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 8);

    await db.query(
      `INSERT INTO attendance (employee_id, date, check_in, status)
       VALUES (?, ?, ?, 'present')
       ON DUPLICATE KEY UPDATE check_in = COALESCE(check_in, VALUES(check_in)), status = 'present'`,
      [employee_id, today, nowTime]
    );

    return res.json({
      success: true,
      message: 'Check-in recorded successfully.',
      check_in: nowTime,
      date: today
    });
  } catch (error) {
    console.error('checkIn error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/attendance/check-out
const checkOut = async (req, res) => {
  try {
    const employee_id = req.body.employee_id ?? req.user?.employee_id;
    if (!employee_id) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 8);

    const [existing] = await db.query(
      `SELECT check_in FROM attendance WHERE employee_id = ? AND date = ?`,
      [employee_id, today]
    );

    const checkInTime = existing[0]?.check_in ?? null;
    const totalHours = calculateHours(checkInTime, nowTime);

    await db.query(
      `INSERT INTO attendance (employee_id, date, check_out, total_hours, status)
       VALUES (?, ?, ?, ?, 'present')
       ON DUPLICATE KEY UPDATE check_out = VALUES(check_out), total_hours = ?`,
      [employee_id, today, nowTime, totalHours, totalHours]
    );

    return res.json({
      success: true,
      message: 'Check-out recorded successfully.',
      check_out: nowTime,
      total_hours: totalHours
    });
  } catch (error) {
    console.error('checkOut error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/attendance
const getAttendanceLogs = async (req, res) => {
  try {
    const employee_id = req.query.employee_id || req.query.employeeId;
    const { month, year, date } = req.query;


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

// GET /api/attendance/:employeeId
const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const [rows] = await db.query(
      `SELECT a.*, e.first_name, e.last_name, e.employee_code
       FROM attendance a
       JOIN employees e ON e.id = a.employee_id
       WHERE a.employee_id = ?
       ORDER BY a.date DESC`,
      [employeeId]
    );
    return res.json({ success: true, count: rows.length, attendance: rows });
  } catch (error) {
    console.error('getEmployeeAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/attendance/:employeeId/monthly
const getMonthlyAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const month = parseInt(req.query.month ?? (new Date().getMonth() + 1), 10);
    const year = parseInt(req.query.year ?? new Date().getFullYear(), 10);

    const [rows] = await db.query(
      `SELECT a.*, e.first_name, e.last_name 
       FROM attendance a
       JOIN employees e ON e.id = a.employee_id
       WHERE a.employee_id = ? AND MONTH(a.date) = ? AND YEAR(a.date) = ?
       ORDER BY a.date ASC`,
      [employeeId, month, year]
    );

    const presentDays = rows.filter(r => r.status === 'present' || r.status === 'half_day').length;
    const totalHours = rows.reduce((acc, r) => acc + parseFloat(r.total_hours || 0), 0);

    return res.json({
      success: true,
      summary: {
        employee_id: employeeId,
        month,
        year,
        total_present_days: presentDays,
        total_hours_worked: totalHours.toFixed(2)
      },
      attendance: rows
    });
  } catch (error) {
    console.error('getMonthlyAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { check_in, check_out, status, notes } = req.body;

    const totalHours = calculateHours(check_in, check_out);

    const [result] = await db.query(
      `UPDATE attendance 
       SET check_in = COALESCE(?, check_in),
           check_out = COALESCE(?, check_out),
           total_hours = CASE WHEN ? IS NOT NULL THEN ? ELSE total_hours END,
           status = COALESCE(?, status),
           notes = COALESCE(?, notes)
       WHERE id = ?`,
      [check_in, check_out, check_out, totalHours, status, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    return res.json({ success: true, message: 'Attendance record updated successfully.' });
  } catch (error) {
    console.error('updateAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM attendance WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }
    return res.json({ success: true, message: 'Attendance record deleted successfully.' });
  } catch (error) {
    console.error('deleteAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generic log attendance
const logAttendance = async (req, res) => {
  try {
    const { employee_id, date, check_in, check_out, status = 'present' } = req.body;
    if (!employee_id || !date) {
      return res.status(400).json({ success: false, message: 'Employee ID and date are required.' });
    }

    const total_hours = calculateHours(check_in, check_out);

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

    return res.json({ success: true, message: 'Attendance recorded successfully.' });
  } catch (error) {
    console.error('logAttendance error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  checkIn,
  checkOut,
  logAttendance,
  getAttendanceLogs,
  getEmployeeAttendance,
  getMonthlyAttendance,
  updateAttendance,
  deleteAttendance
};

export default {
  checkIn,
  checkOut,
  logAttendance,
  getAttendanceLogs,
  getEmployeeAttendance,
  getMonthlyAttendance,
  updateAttendance,
  deleteAttendance
};
