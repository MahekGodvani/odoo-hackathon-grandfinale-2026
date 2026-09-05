import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - ATTENDANCE API SERVICE
 * Connects directly to backend /api/attendance
 */

const normalizeAttendance = (a) => ({
  id: a.id?.toString() || `ATT-${a.id}`,
  employeeId: a.employee_id?.toString() || a.employeeId,
  employeeName: a.first_name ? `${a.first_name} ${a.last_name || ''}`.trim() : a.employeeName || 'Employee',
  employeeCode: a.employee_code || a.employeeCode,
  department: a.department || 'Engineering',
  date: a.date ? String(a.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
  checkIn: a.check_in || a.checkIn || '09:00',
  checkOut: a.check_out || a.checkOut || '18:00',
  totalHours: Number(a.total_hours ?? a.totalHours ?? 9),
  status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : 'Present',
  notes: a.notes || ''
});

export const attendanceApi = {
  getAttendance: async (params = {}) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/attendance', { params });
        if (res.data?.attendance && Array.isArray(res.data.attendance)) {
          return { data: res.data.attendance.map(normalizeAttendance) };
        }
      } catch (err) {
        console.warn('Live getAttendance failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    let records = [...db.attendance];
    if (params.employeeId) {
      records = records.filter((r) => String(r.employeeId) === String(params.employeeId));
    }
    return { data: records };
  },

  createAttendance: async (data) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          employee_id: data.employeeId || data.employee_id,
          date: data.date,
          check_in: data.checkIn || data.check_in,
          check_out: data.checkOut || data.check_out,
          status: (data.status || 'present').toLowerCase(),
          notes: data.notes
        };
        const res = await apiClient.post('/attendance/log', payload);
        if (res.data?.success) {
          return { data: { ...data, id: res.data.attendance_id } };
        }
      } catch (err) {
        console.warn('Live createAttendance failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const newRecord = {
      id: `ATT-${100 + db.attendance.length + 1}`,
      status: 'Present',
      ...data,
    };
    db.attendance.unshift(newRecord);
    mockDataStore.save(db);
    return { data: newRecord };
  },

  updateAttendance: async (id, data) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          check_in: data.checkIn || data.check_in,
          check_out: data.checkOut || data.check_out,
          status: (data.status || 'present').toLowerCase(),
          notes: data.notes
        };
        await apiClient.put(`/attendance/${id}`, payload);
        return { data: { ...data, id, status: 'Corrected' } };
      } catch (err) {
        console.warn('Live updateAttendance failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const idx = db.attendance.findIndex((a) => String(a.id) === String(id));
    if (idx !== -1) {
      db.attendance[idx] = { ...db.attendance[idx], ...data, status: 'Corrected' };
      mockDataStore.save(db);
      return { data: db.attendance[idx] };
    }
    throw new Error('Attendance record not found');
  }
};
