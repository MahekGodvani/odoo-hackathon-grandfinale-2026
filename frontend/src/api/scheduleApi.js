import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - WORKING SCHEDULE API SERVICE
 */

export const scheduleApi = {
  getSchedules: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/schedules');
        if (res.data?.schedules && Array.isArray(res.data.schedules) && res.data.schedules.length > 0) {
          return { data: res.data.schedules };
        }
      } catch (err) {
        console.warn('Live getSchedules fallback to default schedules:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const schedules = db.schedules || [
      { id: 'sch-1', name: 'Standard Full-Time (40h)', type: 'Full-time', weeklyHours: 40, status: 'Active' },
      { id: 'sch-2', name: 'Engineering Shift (40h)', type: 'Shift', weeklyHours: 40, status: 'Active' },
      { id: 'sch-3', name: 'Part-Time Morning (20h)', type: 'Part-time', weeklyHours: 20, status: 'Active' }
    ];
    return { data: schedules };
  },

  createSchedule: async (scheduleData) => {
    const db = mockDataStore.get();
    const newSchedule = {
      id: `sch-${db.schedules.length + 1}`,
      status: 'Active',
      ...scheduleData,
    };
    db.schedules.push(newSchedule);
    mockDataStore.save(db);
    return { data: newSchedule };
  },

  updateSchedule: async (id, scheduleData) => {
    const db = mockDataStore.get();
    const idx = db.schedules.findIndex((s) => s.id === id);
    if (idx !== -1) {
      db.schedules[idx] = { ...db.schedules[idx], ...scheduleData };
      mockDataStore.save(db);
      return { data: db.schedules[idx] };
    }
    throw new Error('Schedule not found');
  }
};
