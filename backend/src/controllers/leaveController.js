import db from '../config/db.js';

// GET /api/leaves
const getLeaveRequests = async (req, res) => {
  try {
    const { employee_id, status } = req.query;

    let query = `
      SELECT lr.*, 
             e.first_name, e.last_name, e.employee_code, e.department,
             u.email AS approved_by_email
      FROM leave_requests lr
      JOIN employees e ON e.id = lr.employee_id
      LEFT JOIN users u ON u.id = lr.approved_by_user_id
      WHERE 1=1
    `;
    const params = [];

    if (req.user?.role === 'employee' && req.user?.employee_id) {
      query += ` AND lr.employee_id = ?`;
      params.push(req.user.employee_id);
    } else if (employee_id) {
      query += ` AND lr.employee_id = ?`;
      params.push(employee_id);
    }

    if (status) {
      query += ` AND lr.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY lr.id DESC`;

    const [rows] = await db.query(query, params);
    return res.json({ success: true, count: rows.length, leaves: rows });
  } catch (error) {
    console.error('getLeaveRequests error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/leaves/:id
const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT lr.*, e.first_name, e.last_name, e.employee_code, e.department
       FROM leave_requests lr
       JOIN employees e ON e.id = lr.employee_id
       WHERE lr.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    return res.json({ success: true, leave: rows[0] });
  } catch (error) {
    console.error('getLeaveById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leaves
const submitLeaveRequest = async (req, res) => {
  try {
    const { employee_id, leave_type = 'casual', start_date, end_date, total_days = 1, reason } = req.body;

    const empId = employee_id ?? req.user?.employee_id;
    if (!empId || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Employee ID, start date, and end date are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [empId, leave_type, start_date, end_date, total_days, reason]
    );

    return res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully.',
      leave_id: result.insertId
    });
  } catch (error) {
    console.error('submitLeaveRequest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/leaves/:id
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { leave_type, start_date, end_date, total_days, reason } = req.body;

    const [result] = await db.query(
      `UPDATE leave_requests 
       SET leave_type = COALESCE(?, leave_type),
           start_date = COALESCE(?, start_date),
           end_date = COALESCE(?, end_date),
           total_days = COALESCE(?, total_days),
           reason = COALESCE(?, reason)
       WHERE id = ? AND status = 'pending'`,
      [leave_type, start_date, end_date, total_days, reason, id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Leave not found or cannot be edited once reviewed.' });
    }

    return res.json({ success: true, message: 'Leave request updated successfully.' });
  } catch (error) {
    console.error('updateLeave error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leaves/:id/approve
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id ?? null;

    const [result] = await db.query(
      `UPDATE leave_requests 
       SET status = 'approved', approved_by_user_id = ?
       WHERE id = ?`,
      [userId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    return res.json({ success: true, message: 'Leave request approved successfully.' });
  } catch (error) {
    console.error('approveLeave error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/leaves/:id/reject
const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id ?? null;

    const [result] = await db.query(
      `UPDATE leave_requests 
       SET status = 'rejected', approved_by_user_id = ?
       WHERE id = ?`,
      [userId, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    return res.json({ success: true, message: 'Leave request rejected.' });
  } catch (error) {
    console.error('rejectLeave error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/leaves/:id
const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM leave_requests WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }
    return res.json({ success: true, message: 'Leave request deleted successfully.' });
  } catch (error) {
    console.error('deleteLeave error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getLeaveRequests,
  getLeaveById,
  submitLeaveRequest,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
};

export default {
  getLeaveRequests,
  getLeaveById,
  submitLeaveRequest,
  updateLeave,
  approveLeave,
  rejectLeave,
  deleteLeave
};
