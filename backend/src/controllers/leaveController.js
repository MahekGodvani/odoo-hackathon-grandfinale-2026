const db = require('../config/db');

// List leave requests (all for HR/Admin, or filtered by employee)
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

    // If regular employee, only show their own leaves
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

// Step 4: Submit Leave Request
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

// Step 5: HR Approves or Rejects Leave
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved, rejected, or pending.' });
    }

    const [result] = await db.query(
      `UPDATE leave_requests 
       SET status = ?, approved_by_user_id = ?
       WHERE id = ?`,
      [status, req.user.id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    return res.json({ success: true, message: `Leave request status updated to ${status}.` });
  } catch (error) {
    console.error('updateLeaveStatus error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeaveRequests,
  submitLeaveRequest,
  updateLeaveStatus
};
