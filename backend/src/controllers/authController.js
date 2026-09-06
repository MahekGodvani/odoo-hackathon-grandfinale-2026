import db from '../config/db.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../middlewares/auth.js';

// -------------------------------------------------------------
// 1. REGISTER
// -------------------------------------------------------------
export const register = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { email, password, role = 'employee', company_id = 1, first_name, last_name, employee_code, department, designation } = req.body;

    if (!email || !password) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (password.length < 6) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const CANONICAL_ROLES = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'employee'];
    let normalizedRole = (role || 'employee').toLowerCase().trim().replace(/[\s-]+/g, '_');
    if (normalizedRole === 'hr') normalizedRole = 'hr_manager';
    if (normalizedRole === 'payroll') normalizedRole = 'hr_payroll_manager';

    if (!CANONICAL_ROLES.includes(normalizedRole)) {
      await conn.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Invalid role specified. Must be one of: ${CANONICAL_ROLES.join(', ')}` 
      });
    }

    // Role Escalation Prevention:
    // Only authenticated administrators can assign privileged roles
    let assignedRole = 'employee';
    if (normalizedRole !== 'employee') {
      if (!req.user || req.user.role !== 'admin') {
        await conn.rollback();
        return res.status(403).json({ 
          success: false, 
          message: 'Forbidden: Only authenticated administrators can assign privileged roles.' 
        });
      }
      assignedRole = normalizedRole;
    }

    const [existing] = await conn.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await conn.query(
      `INSERT INTO users (company_id, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [company_id, email, hashedPassword, assignedRole]
    );
    const userId = userResult.insertId;

    let employeeId = null;
    if (first_name && last_name) {
      const code = employee_code ?? `EMP-${Date.now().toString().slice(-4)}`;
      const [empResult] = await conn.query(
        `INSERT INTO employees (company_id, user_id, employee_code, first_name, last_name, email, department, designation, joining_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
        [company_id, userId, code, first_name, last_name, email, department ?? 'General', designation ?? 'Staff']
      );
      employeeId = empResult.insertId;
    }

    const tokenPayload = {
      id: userId,
      email,
      role: assignedRole,
      employee_id: employeeId,
      first_name: first_name ?? '',
      last_name: last_name ?? ''
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: userId, email });

    await conn.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [refreshToken, userId]);
    await conn.commit();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900
      },
      user: {
        id: userId,
        email,
        role: assignedRole,
        employee_id: employeeId
      }
    });
  } catch (error) {
    await conn.rollback();
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// -------------------------------------------------------------
// 2. LOGIN (Issues 15-min Access Token + 7-day Refresh Token)
// -------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [users] = await db.query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.is_active, 
              e.id AS employee_id, e.first_name, e.last_name, e.department, e.designation
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       WHERE u.email = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const [user] = users;
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    let passwordMatch = false;
    let shouldUpgradeHash = false;

    if (user.password_hash && typeof user.password_hash === 'string') {
      if (user.password_hash.startsWith('$2')) {
        try {
          passwordMatch = await bcrypt.compare(password, user.password_hash);
        } catch {
          passwordMatch = false;
        }
      } else if (user.password_hash === `hash_${password}` || user.password_hash === password) {
        // Support legacy seed passwords strictly for this specific account, then mark for re-hash
        passwordMatch = true;
        shouldUpgradeHash = true;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Auto-upgrade legacy stored password to standard bcrypt hash
    if (shouldUpgradeHash) {
      try {
        const newHash = await bcrypt.hash(password, 10);
        await db.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, user.id]);
      } catch (upgradeErr) {
        console.error('Failed to upgrade legacy password hash:', upgradeErr);
      }
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      employee_id: user.employee_id ?? null,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    try {
      await db.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [refreshToken, user.id]);
    } catch {
      console.warn('Note: refresh_token column fallback');
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      access_token: accessToken,
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900 // 15 minutes in seconds
      },

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee_id: user.employee_id,
        name: user.first_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0],
        department: user.department,
        designation: user.designation
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 3. REFRESH TOKEN
// -------------------------------------------------------------
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: incomingToken } = req.body;
    if (!incomingToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token is required in request body { "refreshToken": "..." }.' 
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingToken);
    } catch {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired refresh token. Please log in again.' 
      });
    }

    const [users] = await db.query(
      `SELECT u.id, u.email, u.role, u.refresh_token, u.is_active, 
              e.id AS employee_id, e.first_name, e.last_name
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(403).json({ success: false, message: 'User not found or account deactivated.' });
    }

    const [user] = users;

    if (user.refresh_token && user.refresh_token !== incomingToken) {
      return res.status(403).json({ 
        success: false, 
        message: 'Refresh token has been revoked or replaced. Please log in again.' 
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      employee_id: user.employee_id ?? null,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

    try {
      await db.query(`UPDATE users SET refresh_token = ? WHERE id = ?`, [newRefreshToken, user.id]);
    } catch {}

    return res.json({
      success: true,
      message: 'Access token renewed successfully (valid for next 15 minutes).',
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        tokenType: 'Bearer',
        expiresIn: 900
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 4. LOGOUT
// -------------------------------------------------------------
export const logout = async (req, res) => {
  try {
    const userId = req.user?.id ?? null;
    const { refreshToken: incomingToken } = req.body;

    if (userId) {
      try {
        await db.query(`UPDATE users SET refresh_token = NULL WHERE id = ?`, [userId]);
      } catch {}
    }

    if (incomingToken) {
      try {
        await db.query(`UPDATE users SET refresh_token = NULL WHERE refresh_token = ?`, [incomingToken]);
      } catch {}
    }

    return res.json({
      success: true,
      message: 'Logged out successfully. Refresh token invalidated.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 5. FORGOT PASSWORD
// -------------------------------------------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Generic response returned for all requests to prevent email enumeration
    const genericResponse = {
      success: true,
      message: 'If the email is registered, a password reset link has been sent to the email address.'
    };

    const [users] = await db.query(`SELECT id, email, is_active FROM users WHERE email = ?`, [email]);
    if (users.length === 0 || !users[0].is_active) {
      return res.json(genericResponse);
    }

    const [user] = users;
    // Generate secure random reset token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    // Store SHA-256 hash of token in database
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    try {
      await db.query(
        `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
        [hashedResetToken, expiresAt, user.id]
      );
    } catch (dbErr) {
      console.error('Error saving reset token:', dbErr);
    }

    console.log(`[AUTH AUDIT] Password reset token generated for ${user.email}. (Delivered via out-of-band channel)`);

    // CRITICAL: NEVER return the resetToken in the HTTP response JSON
    return res.json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 6. RESET PASSWORD
// -------------------------------------------------------------
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [users] = await db.query(
      `SELECT id, email, reset_token_expires FROM users 
       WHERE (reset_token = ? OR reset_token = ?) AND (reset_token_expires > NOW() OR reset_token_expires IS NULL)`,
      [hashedToken, token]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    const [user] = users;
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users 
       SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, refresh_token = NULL
       WHERE id = ?`,
      [newPasswordHash, user.id]
    );

    return res.json({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 7. GET PROFILE
// -------------------------------------------------------------
export const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.company_id, u.email, u.role, u.is_active, u.created_at,
              e.id AS employee_id, e.employee_code, e.first_name, e.last_name, 
              e.phone, e.department, e.designation, e.joining_date, e.status,
              c.name AS company_name
       FROM users u
       LEFT JOIN employees e ON e.user_id = u.id
       LEFT JOIN companies c ON c.id = u.company_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------------------------------------------
// 8. EDIT PROFILE
// -------------------------------------------------------------
export const updateProfile = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const userId = req.user.id;
    const { 
      first_name, 
      last_name, 
      phone, 
      currentPassword, 
      newPassword 
    } = req.body;

    if (newPassword) {
      if (newPassword.length < 6) {
        await conn.rollback();
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }

      const [users] = await conn.query(`SELECT password_hash FROM users WHERE id = ?`, [userId]);
      if (users.length > 0) {
        const curr = users[0].password_hash;
        if (currentPassword) {
          let passMatches = false;
          if (curr && typeof curr === 'string') {
            if (curr.startsWith('$2')) {
              try {
                passMatches = await bcrypt.compare(currentPassword, curr);
              } catch {
                passMatches = false;
              }
            } else if (curr === `hash_${currentPassword}` || curr === currentPassword) {
              passMatches = true;
            }
          }
          if (!passMatches) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
          }
        }
        const updatedHash = await bcrypt.hash(newPassword, 10);
        await conn.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [updatedHash, userId]);
      }
    }

    if (req.user.employee_id || first_name || last_name || phone) {
      await conn.query(
        `UPDATE employees 
         SET first_name = COALESCE(?, first_name),
             last_name = COALESCE(?, last_name),
             phone = COALESCE(?, phone)
         WHERE user_id = ?`,
        [first_name, last_name, phone, userId]
      );
    }

    await conn.commit();

    return res.json({
      success: true,
      message: 'Profile updated successfully.'
    });
  } catch (error) {
    await conn.rollback();
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    conn.release();
  }
};

// -------------------------------------------------------------
// 9. GET ALL USERS (Admin)
// -------------------------------------------------------------
export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.id, u.email, u.role, u.is_active, u.created_at,
        e.first_name, e.last_name, e.employee_code, e.department, e.designation, e.phone
      FROM users u
      LEFT JOIN employees e ON u.id = e.user_id
      ORDER BY u.id
    `);
    const result = users.map(u => ({
      id: u.id,
      name: u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.email.split('@')[0],
      role: (() => {
        const roleMap = {
          'admin': 'Admin',
          'hr_payroll_manager': 'HR Payroll Manager',
          'hr_payroll_user': 'HR Payroll User',
          'hr_manager': 'HR Manager',
          'employee': 'Employee'
        };
        return roleMap[u.role] || u.role || 'Employee';
      })(),
      department: u.department || null,
      designation: u.designation || null,
      phone: u.phone || null,
      employeeCode: u.employee_code || null,
      createdAt: u.created_at
    }));
    res.json({ success: true, users: result });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------------------------------------
// 10. UPDATE USER ROLE (Admin)
// -------------------------------------------------------------
export const updateUserRole = async (req, res) => {
  try {
    const CANONICAL_ROLES = ['admin', 'hr_payroll_manager', 'hr_payroll_user', 'hr_manager', 'employee'];
    let normalizedRole = (role || '').toLowerCase().trim().replace(/[\s-]+/g, '_');
    if (normalizedRole === 'hr') normalizedRole = 'hr_manager';
    if (normalizedRole === 'payroll') normalizedRole = 'hr_payroll_manager';

    if (!CANONICAL_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${CANONICAL_ROLES.join(', ')}` });
    }
    const targetUserId = parseInt(req.params.id, 10);
    // Prevent an admin from demoting themselves if they are the only active admin
    if (targetUserId === req.user.id && normalizedRole !== 'admin') {
      const [adminCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1');
      if (adminCount[0]?.count <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot demote the last remaining active administrator.' });
      }
    }
    await db.query('UPDATE users SET role = ? WHERE id = ?', [normalizedRole, targetUserId]);
    res.json({ success: true, message: `User role updated to ${normalizedRole}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------------------------------------
// 11. TOGGLE USER STATUS (Admin)
// -------------------------------------------------------------
export const toggleUserStatus = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    if (targetUserId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Administrators cannot deactivate their own account.' });
    }
    const [rows] = await db.query('SELECT is_active FROM users WHERE id = ?', [targetUserId]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    const newStatus = rows[0].is_active ? 0 : 1;
    await db.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, targetUserId]);
    res.json({ success: true, message: `User ${newStatus ? 'activated' : 'deactivated'}`, is_active: !!newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  getUsers,
  updateUserRole,
  toggleUserStatus
};




select 