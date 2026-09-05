import db from '../config/db.js';

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [notifications] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return res.json({
      success: true,
      unread_count: unreadCount,
      notifications
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await db.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    return res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    console.error('markNotificationRead error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notifications/send
const sendNotification = async (req, res) => {
  try {
    const { user_id, title, message, type = 'info' } = req.body;
    if (!user_id || !title || !message) {
      return res.status(400).json({ success: false, message: 'user_id, title, and message are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)`,
      [user_id, title, message, type]
    );

    return res.status(201).json({
      success: true,
      message: 'Notification sent successfully.',
      notification_id: result.insertId
    });
  } catch (error) {
    console.error('sendNotification error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getNotifications,
  markNotificationRead,
  sendNotification
};

export default {
  getNotifications,
  markNotificationRead,
  sendNotification
};
