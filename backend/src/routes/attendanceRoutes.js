const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate } = require('../middlewares/auth');

router.post('/log', authenticate, attendanceController.logAttendance);
router.get('/', authenticate, attendanceController.getAttendanceLogs);

module.exports = router;
