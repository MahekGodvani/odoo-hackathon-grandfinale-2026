const db = require('../config/db');

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT setting_key, setting_value FROM settings`);
    const settings = rows.reduce((acc, curr) => {
      acc[curr.setting_key] = curr.setting_value;
      return acc;
    }, {});
    return res.json({ success: true, settings });
  } catch (error) {
    console.error('getSettings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    const settings = req.body; // e.g. { "working_days_per_month": "30", "default_currency": "USD" }

    for (const [key, val] of Object.entries(settings)) {
      await db.query(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(val)]
      );
    }

    return res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/company/settings
const getCompanySettings = async (req, res) => {
  try {
    const companyId = req.user?.company_id ?? 1;
    const [companies] = await db.query(`SELECT * FROM companies WHERE id = ?`, [companyId]);
    if (companies.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }
    return res.json({ success: true, company: companies[0] });
  } catch (error) {
    console.error('getCompanySettings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/company/settings
const updateCompanySettings = async (req, res) => {
  try {
    const companyId = req.user?.company_id ?? 1;
    const { name, email, phone, address, website, tax_id, currency } = req.body;

    await db.query(
      `UPDATE companies 
       SET name = COALESCE(?, name),
           email = COALESCE(?, email),
           phone = COALESCE(?, phone),
           address = COALESCE(?, address),
           website = COALESCE(?, website),
           tax_id = COALESCE(?, tax_id),
           currency = COALESCE(?, currency)
       WHERE id = ?`,
      [name, email, phone, address, website, tax_id, currency, companyId]
    );

    return res.json({ success: true, message: 'Company settings updated successfully.' });
  } catch (error) {
    console.error('updateCompanySettings error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getCompanySettings,
  updateCompanySettings
};
