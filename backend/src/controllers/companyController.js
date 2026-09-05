import db from '../config/db.js';

// GET /api/companies
export const getCompanies = async (req, res) => {
  try {
    const [companies] = await db.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM employees e WHERE e.company_id = c.id) AS total_employees
       FROM companies c
       ORDER BY c.id ASC`
    );
    return res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    console.error('getCompanies error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/companies/:id
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const [companies] = await db.query(`SELECT * FROM companies WHERE id = ?`, [id]);
    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    return res.json({ success: true, company: companies[0] });
  } catch (error) {
    console.error('getCompanyById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/companies
export const createCompany = async (req, res) => {
  try {
    const { name, email, phone, address, website, tax_id, currency = 'USD' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Company name and email are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO companies (name, email, phone, address, website, tax_id, currency)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, website, tax_id, currency]
    );

    return res.status(201).json({
      success: true,
      message: 'Company created successfully.',
      company_id: result.insertId
    });
  } catch (error) {
    console.error('createCompany error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/companies/:id
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, website, tax_id, currency } = req.body;

    const [result] = await db.query(
      `UPDATE companies 
       SET name = COALESCE(?, name),
           email = COALESCE(?, email),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           website = COALESCE(?, website),
           tax_id = COALESCE(?, tax_id),
           currency = COALESCE(?, currency)
       WHERE id = ?`,
      [name, email, phone, address, website, tax_id, currency, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    return res.json({ success: true, message: 'Company updated successfully.' });
  } catch (error) {
    console.error('updateCompany error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/companies/:id
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(`DELETE FROM companies WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    return res.json({ success: true, message: 'Company deleted successfully.' });
  } catch (error) {
    console.error('deleteCompany error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
