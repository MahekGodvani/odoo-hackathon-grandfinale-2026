import express from 'express';
import { searchAll, getSuggestions, getStats, reindex } from '../controllers/searchController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Enforce strict JWT authentication across all Search API endpoints
router.use(authenticate);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Unified Elastic Search across Employees, Payslips, Contracts, Attendance, Leaves, Payruns, Navigation
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query term (supports typo tolerance, fuzzy matching, and multi-field scoring)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, employees, payslips, contracts, attendance, leaves, payruns, modules]
 *         description: Category filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Elastic search results with relevance scores, highlight snippets, and aggregations
 *       401:
 *         description: Unauthorized - Authentication required
 */
router.get('/', searchAll);

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: Instant autocomplete suggestions
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Autocomplete suggestions list
 *       401:
 *         description: Unauthorized - Authentication required
 */
router.get('/suggestions', getSuggestions);

/**
 * @swagger
 * /api/search/stats:
 *   get:
 *     summary: Elastic search index health, document count, and cluster status
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Engine stats
 *       401:
 *         description: Unauthorized - Authentication required
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/search/reindex:
 *   post:
 *     summary: Trigger real-time re-indexing of all data (Admin & HR only)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Re-indexing status
 *       401:
 *         description: Unauthorized - Authentication required
 *         description: Forbidden - Requires admin role
 */
router.post('/reindex', authorize(['admin']), reindex);

export default router;
