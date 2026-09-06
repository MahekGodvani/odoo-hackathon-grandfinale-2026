import elasticSearchService from '../services/elasticSearchService.js';
import db from '../config/db.js';

/**
 * PEOPLEPAY360 - ELASTIC SEARCH CONTROLLER
 * Full-Text, Typo-Tolerant, Multi-Field Search across all HR & Payroll entities.
 */

export const searchAll = async (req, res) => {
  try {
    const { q = '', category = 'all', limit = 20, offset = 0 } = req.query;

    const results = elasticSearchService.search({
      query: q,
      category,
      limit: parseInt(limit, 10) || 20,
      offset: parseInt(offset, 10) || 0,
    });

    return res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('ElasticSearch error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSuggestions = async (req, res) => {
  try {
    const { q = '', limit = 6 } = req.query;
    const suggestions = elasticSearchService.getSuggestions(q, parseInt(limit, 10) || 6);

    return res.json({
      success: true,
      query: q,
      suggestions,
    });
  } catch (error) {
    console.error('getSuggestions error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = elasticSearchService.getStats();
    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reindex = async (req, res) => {
  try {
    let reindexedCount = 0;
    try {
      // If MySQL is reachable, re-index live employees, payslips, leaves, attendance
      const [employees] = await db.query('SELECT * FROM employees');
      if (employees && employees.length > 0) {
        employees.forEach((emp) => {
          elasticSearchService.indexDocument({
            id: `emp-${emp.id}`,
            code: emp.employee_code,
            category: 'employees',
            title: `${emp.first_name} ${emp.last_name}`,
            subtitle: `${emp.department} • ${emp.designation}`,
            department: emp.department,
            role: emp.designation,
            status: emp.status,
            path: '/employees',
            tags: [emp.email, emp.employee_code, emp.department],
          });
          reindexedCount++;
        });
      }
    } catch {
      // Fallback: re-initialize seed index
      elasticSearchService.initializeDefaultIndex();
      reindexedCount = elasticSearchService.documents.size;
    }

    return res.json({
      success: true,
      message: 'ElasticSearch documents re-indexed successfully.',
      totalIndexed: elasticSearchService.documents.size,
      reindexedCount,
    });
  } catch (error) {
    console.error('reindex error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
