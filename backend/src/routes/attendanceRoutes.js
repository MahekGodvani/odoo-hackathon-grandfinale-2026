import express from 'express';
import attendanceController from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.post('/check-in', authenticate, attendanceController.checkIn);
router.post('/check-out', authenticate, attendanceController.checkOut);
router.post('/log', authenticate, attendanceController.logAttendance);

router.get('/', authenticate, attendanceController.getAttendanceLogs);
router.get('/:employeeId', authenticate, attendanceController.getEmployeeAttendance);
router.get('/:employeeId/monthly', authenticate, attendanceController.getMonthlyAttendance);

router.put('/:id', authenticate, authorize(['admin', 'hr']), attendanceController.updateAttendance);
router.delete('/:id', authenticate, authorize(['admin', 'hr']), attendanceController.deleteAttendance);

export default router;
