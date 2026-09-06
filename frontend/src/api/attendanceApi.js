import apiClient from './axios';

/**
 * PEOPLEPAY360 - ATTENDANCE API SERVICE
 * Connects directly to backend /api/attendance — no mock fallback.
 */

const normalizeAttendance = (a) => ({
  id: a.id?.toString() || `ATT-${a.id}`,
  employeeId: a.employee_id?.toString() || a.employeeId,
  employeeName: a.first_name ? `${a.first_name} ${a.last_name || ''}`.trim() : a.employeeName || 'Employee',
  employeeCode: a.employee_code || a.employeeCode,
  department: a.department || '',
  date: a.date ? String(a.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
  checkIn: a.check_in || a.checkIn || '',
  checkOut: a.check_out || a.checkOut || '',
  totalHours: Number(a.total_hours ?? a.totalHours ?? 0),
  workedHours: Number(a.total_hours ?? a.workedHours ?? 0),
  status: a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1).replace('_', ' ') : 'Present',
  notes: a.notes || ''
});

export const attendanceApi = {
  getAttendance: async (params = {}) => {
    const res = await apiClient.get('/attendance', { params });
    if (res.data?.attendance && Array.isArray(res.data.attendance)) {
      return { data: res.data.attendance.map(normalizeAttendance) };
    }
    return { data: [] };
  },

  checkIn: async (employeeId) => {
    const res = await apiClient.post('/attendance/check-in', { employee_id: employeeId });
    return res.data;
  },

  checkOut: async (employeeId) => {
    const res = await apiClient.post('/attendance/check-out', { employee_id: employeeId });
    return res.data;
  },

  createAttendance: async (data) => {
    const payload = {
      employee_id: data.employeeId || data.employee_id,
      date: data.date,
      check_in: data.checkIn || data.check_in,
      check_out: data.checkOut || data.check_out,
      status: (data.status || 'present').toLowerCase(),
      notes: data.notes
    };
    const res = await apiClient.post('/attendance/log', payload);
    return { data: { ...data, id: res.data.attendance_id } };
  },

  updateAttendance: async (id, data) => {
    const payload = {
      check_in: data.checkIn || data.check_in,
      check_out: data.checkOut || data.check_out,
      status: (data.status || 'present').toLowerCase(),
      notes: data.notes
    };
    await apiClient.put(`/attendance/${id}`, payload);
    return { data: { ...data, id, status: 'Corrected' } };
  },

  deleteAttendance: async (id) => {
    await apiClient.delete(`/attendance/${id}`);
    return { success: true };
  }
};
