const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/check-in', authenticate, attendanceController.checkIn);
router.post('/check-out', authenticate, attendanceController.checkOut);
router.post('/log', authenticate, attendanceController.logAttendance);

router.get('/', authenticate, attendanceController.getAttendanceLogs);
router.get('/:employeeId', authenticate, attendanceController.getEmployeeAttendance);
router.get('/:employeeId/monthly', authenticate, attendanceController.getMonthlyAttendance);

router.put('/:id', authenticate, authorize(['admin', 'hr']), attendanceController.updateAttendance);
router.delete('/:id', authenticate, authorize(['admin', 'hr']), attendanceController.deleteAttendance);

module.exports = router;
