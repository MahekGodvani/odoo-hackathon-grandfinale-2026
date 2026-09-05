import db from '../config/db.js';

// GET /api/roles
const getRoles = async (req, res) => {
  try {
    const [roles] = await db.query(`SELECT * FROM roles ORDER BY id ASC`);
    return res.json({ success: true, count: roles.length, roles });
  } catch (error) {
    console.error('getRoles error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/roles
const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Role name is required.' });
    }

    const [result] = await db.query(
      `INSERT INTO roles (name, description) VALUES (?, ?)`,
      [name.toLowerCase(), description ?? null]
    );

    return res.status(201).json({
      success: true,
      message: 'Role created successfully.',
      role_id: result.insertId
    });
  } catch (error) {
    console.error('createRole error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/roles/:id
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [result] = await db.query(
      `UPDATE roles 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description)
       WHERE id = ?`,
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }

    return res.json({ success: true, message: 'Role updated successfully.' });
  } catch (error) {
    console.error('updateRole error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/roles/:id
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM roles WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }
    return res.json({ success: true, message: 'Role deleted successfully.' });
  } catch (error) {
    console.error('deleteRole error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/permissions
const getPermissions = async (req, res) => {
  try {
    const [permissions] = await db.query(`SELECT * FROM permissions ORDER BY module ASC, id ASC`);
    return res.json({ success: true, count: permissions.length, permissions });
  } catch (error) {
    console.error('getPermissions error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'hr', 'payroll', 'employee'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be admin, hr, payroll, or employee.' });
    }

    const [result] = await db.query(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: `User role updated to ${role}.` });
  } catch (error) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateUserRole
};

export default {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  updateUserRole
};
