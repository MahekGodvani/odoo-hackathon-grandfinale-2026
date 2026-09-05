import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - WORKING SCHEDULE API SERVICE
 */

export const scheduleApi = {
  getSchedules: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.schedules };
    }
    return apiClient.get('/schedules');
  },

  createSchedule: async (scheduleData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newSchedule = {
        id: `sch-${db.schedules.length + 1}`,
        status: 'Active',
        ...scheduleData,
      };
      db.schedules.push(newSchedule);
      mockDataStore.save(db);
      return { data: newSchedule };
    }
    return apiClient.post('/schedules', scheduleData);
  },

  updateSchedule: async (id, scheduleData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const idx = db.schedules.findIndex((s) => s.id === id);
      if (idx !== -1) {
        db.schedules[idx] = { ...db.schedules[idx], ...scheduleData };
        mockDataStore.save(db);
        return { data: db.schedules[idx] };
      }
      throw new Error('Schedule not found');
    }
    return apiClient.put(`/schedules/${id}`, scheduleData);
  }
};
