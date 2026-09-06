import apiClient from './axios';

/**
 * PEOPLEPAY360 - TIME OFF API SERVICE
 * Connects directly to backend /api/leaves, /api/leave/types, /api/leave/allocations — no mock fallback.
 */

const normalizeLeave = (l) => ({
  id: l.id?.toString() || `LV-${l.id}`,
  employeeId: l.employee_id?.toString() || l.employeeId,
  employeeName: l.first_name ? `${l.first_name} ${l.last_name || ''}`.trim() : l.employeeName || 'Employee',
  leaveType: l.leave_type ? (l.leave_type.charAt(0).toUpperCase() + l.leave_type.slice(1) + ' Leave') : (l.leaveType || l.typeName || 'Paid Leave'),
  typeId: l.typeId || l.leave_type_id || null,
  typeName: l.typeName || l.leave_type_name || '',
  startDate: l.start_date ? String(l.start_date).slice(0, 10) : l.startDate || '',
  endDate: l.end_date ? String(l.end_date).slice(0, 10) : l.endDate || '',
  days: Number(l.total_days || l.days || l.duration || 1),
  duration: Number(l.total_days || l.days || l.duration || 1),
  reason: l.reason || '',
  status: l.status ? (l.status.charAt(0).toUpperCase() + l.status.slice(1)) : 'Pending',
  approvedBy: l.approved_by_email || l.approvedBy || null
});

export const timeOffApi = {
  getTimeOffTypes: async () => {
    const res = await apiClient.get('/leave/types');
    if (res.data?.success && res.data.leaveTypes) {
      return { data: res.data.leaveTypes };
    }
    return { data: [] };
  },

  createTimeOffType: async (typeData) => {
    const payload = {
      name: typeData.name,
      unit: (typeData.unit || 'days').toLowerCase(),
      requires_approval: typeData.requiresApproval ?? true,
      requires_allocation: typeData.requiresAllocation ?? true,
      payroll_integration: typeData.payrollIntegration ?? true
    };
    const res = await apiClient.post('/leave/types', payload);
    return { data: { ...typeData, id: res.data.leave_type_id } };
  },

  getAllocations: async (params = {}) => {
    const queryParams = {};
    if (params.employeeId) queryParams.employee_id = params.employeeId;
    const res = await apiClient.get('/leave/allocations', { params: queryParams });
    if (res.data?.success && res.data.allocations) {
      return { data: res.data.allocations };
    }
    return { data: [] };
  },

  createAllocation: async (allocData) => {
    const payload = {
      employee_id: allocData.employeeId || allocData.employee_id,
      leave_type_id: allocData.typeId || allocData.leave_type_id,
      allocated: allocData.allocatedDays || allocData.allocated || 0,
      valid_from: allocData.validFrom || '2026-01-01',
      valid_to: allocData.validTo || '2026-12-31'
    };
    const res = await apiClient.post('/leave/allocations', payload);
    return { data: { ...allocData, id: res.data.allocation_id } };
  },

  getRequests: async (params = {}) => {
    const res = await apiClient.get('/leaves', { params });
    if (res.data?.leaves && Array.isArray(res.data.leaves)) {
      return { data: res.data.leaves.map(normalizeLeave) };
    }
    return { data: [] };
  },

  getTimeOffRequests: async (params = {}) => {
    return timeOffApi.getRequests(params);
  },

  createRequest: async (reqData) => {
    const payload = {
      employee_id: reqData.employeeId || reqData.employee_id || reqData.rawId,
      leave_type: (reqData.typeName || reqData.leaveType || reqData.leave_type || 'casual').toLowerCase().replace(' leave', '').trim() || 'casual',
      start_date: reqData.startDate || reqData.start_date,
      end_date: reqData.endDate || reqData.end_date,
      total_days: Number(reqData.duration || reqData.days || reqData.total_days || 1),
      reason: reqData.reason || 'Personal leave'
    };
    const res = await apiClient.post('/leaves', payload);
    return { data: { ...reqData, id: res.data.leave_id, status: 'Pending' } };
  },

  createTimeOffRequest: async (reqData) => {
    return timeOffApi.createRequest(reqData);
  },

  approveRequest: async (id) => {
    await apiClient.post(`/leaves/${id}/approve`);
    return { data: { id, status: 'Approved' } };
  },

  approveTimeOffRequest: async (id) => {
    return timeOffApi.approveRequest(id);
  },

  rejectRequest: async (id, reason) => {
    await apiClient.post(`/leaves/${id}/reject`, { reason });
    return { data: { id, status: 'Rejected' } };
  },

  refuseRequest: async (id, reason) => {
    return timeOffApi.rejectRequest(id, reason);
  },

  rejectTimeOffRequest: async (id, reason) => {
    return timeOffApi.rejectRequest(id, reason);
  }
};
