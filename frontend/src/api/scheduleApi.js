import apiClient from './axios';

/**
 * PEOPLEPAY360 - WORKING SCHEDULE API SERVICE
 * Connects directly to backend /api/schedules — no mock fallback.
 */

const normalizeSchedule = (s) => ({
  id: s.id?.toString() || `sch-${s.id}`,
  name: s.name || '',
  type: s.type || 'Full-time',
  weeklyHours: Number(s.weeklyHours || s.weekly_hours || 40),
  pattern: s.pattern || {},
  status: s.status || 'Active'
});

export const scheduleApi = {
  getSchedules: async () => {
    const res = await apiClient.get('/schedules');
    if (res.data?.success && res.data.schedules) {
      return { data: res.data.schedules.map(normalizeSchedule) };
    }
    return { data: [] };
  },

  createSchedule: async (scheduleData) => {
    const payload = {
      name: scheduleData.name,
      type: scheduleData.type,
      weekly_hours: scheduleData.weeklyHours || 40,
      pattern: scheduleData.pattern
    };
    const res = await apiClient.post('/schedules', payload);
    return { data: { ...scheduleData, id: res.data.schedule_id, status: 'Active' } };
  },

  updateSchedule: async (id, scheduleData) => {
    const payload = {
      name: scheduleData.name,
      type: scheduleData.type,
      weekly_hours: scheduleData.weeklyHours,
      pattern: scheduleData.pattern,
      status: scheduleData.status
    };
    await apiClient.put(`/schedules/${id}`, payload);
    return { data: { ...scheduleData, id } };
  }
};
