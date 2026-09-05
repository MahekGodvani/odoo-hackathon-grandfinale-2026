import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - ATTENDANCE API SERVICE
 */

export const attendanceApi = {
  getAttendance: async (params = {}) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      let records = [...db.attendance];
      if (params.employeeId) {
        records = records.filter((r) => r.employeeId === params.employeeId);
      }
      return { data: records };
    }
    return apiClient.get('/attendance', { params });
  },

  createAttendance: async (data) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newRecord = {
        id: `ATT-${100 + db.attendance.length + 1}`,
        status: 'Present',
        ...data,
      };
      db.attendance.unshift(newRecord);
      mockDataStore.save(db);
      return { data: newRecord };
    }
    return apiClient.post('/attendance', data);
  },

  updateAttendance: async (id, data) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const idx = db.attendance.findIndex((a) => a.id === id);
      if (idx !== -1) {
        db.attendance[idx] = { ...db.attendance[idx], ...data, status: 'Corrected' };
        mockDataStore.save(db);
        return { data: db.attendance[idx] };
      }
      throw new Error('Attendance record not found');
    }
    return apiClient.put(`/attendance/${id}`, data);
  }
};
