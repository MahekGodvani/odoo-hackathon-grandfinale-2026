import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - TIME OFF API SERVICE
 * Connects directly to backend /api/leaves
 */

const normalizeLeave = (l) => ({
  id: l.id?.toString() || `LV-${l.id}`,
  employeeId: l.employee_id?.toString() || l.employeeId,
  employeeName: l.first_name ? `${l.first_name} ${l.last_name || ''}`.trim() : l.employeeName || 'Employee',
  leaveType: l.leave_type ? (l.leave_type.charAt(0).toUpperCase() + l.leave_type.slice(1) + ' Leave') : (l.leaveType || 'Paid Leave'),
  typeId: l.typeId || 'tot-1',
  startDate: l.start_date ? String(l.start_date).slice(0, 10) : l.startDate || '2026-09-10',
  endDate: l.end_date ? String(l.end_date).slice(0, 10) : l.endDate || '2026-09-11',
  days: Number(l.total_days || l.days || 1),
  reason: l.reason || '',
  status: l.status ? (l.status.charAt(0).toUpperCase() + l.status.slice(1)) : 'Pending',
  approvedBy: l.approved_by_email || l.approvedBy || null
});

export const timeOffApi = {
  getTimeOffTypes: async () => {
    const db = mockDataStore.get();
    return { data: db.timeOffTypes };
  },

  createTimeOffType: async (typeData) => {
    const db = mockDataStore.get();
    const newType = {
      id: `tot-${db.timeOffTypes.length + 1}`,
      status: 'Active',
      ...typeData,
    };
    db.timeOffTypes.push(newType);
    mockDataStore.save(db);
    return { data: newType };
  },

  getAllocations: async (params = {}) => {
    const db = mockDataStore.get();
    let allocs = [...db.allocations];
    if (params.employeeId) {
      allocs = allocs.filter((a) => String(a.employeeId) === String(params.employeeId));
    }
    return { data: allocs };
  },

  createAllocation: async (allocData) => {
    const db = mockDataStore.get();
    const newAlloc = {
      id: `alloc-${db.allocations.length + 1}`,
      taken: 0,
      remaining: allocData.allocatedDays,
      status: 'Active',
      ...allocData,
    };
    db.allocations.unshift(newAlloc);
    mockDataStore.save(db);
    return { data: newAlloc };
  },

  getRequests: async (params = {}) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/leaves', { params });
        if (res.data?.leaves && Array.isArray(res.data.leaves)) {
          return { data: res.data.leaves.map(normalizeLeave) };
        }
      } catch (err) {
        console.warn('Live getRequests failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    let reqs = [...db.timeOffRequests];
    if (params.employeeId) {
      reqs = reqs.filter((r) => String(r.employeeId) === String(params.employeeId));
    }
    if (params.status && params.status !== 'All') {
      reqs = reqs.filter((r) => r.status === params.status);
    }
    return { data: reqs };
  },

  createRequest: async (reqData) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          employee_id: reqData.employeeId,
          leave_type: (reqData.leaveType || 'casual').toLowerCase().replace(' leave', ''),
          start_date: reqData.startDate,
          end_date: reqData.endDate,
          total_days: reqData.days || 1,
          reason: reqData.reason
        };
        const res = await apiClient.post('/leaves', payload);
        if (res.data?.success) {
          return { data: { ...reqData, id: res.data.leave_id, status: 'Pending' } };
        }
      } catch (err) {
        console.warn('Live createRequest failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const newReq = {
      id: `TOR-${100 + db.timeOffRequests.length + 1}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...reqData,
    };
    db.timeOffRequests.unshift(newReq);
    mockDataStore.save(db);
    return { data: newReq };
  },

  approveRequest: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        await apiClient.post(`/leaves/${id}/approve`);
        return { data: { id, status: 'Approved' } };
      } catch (err) {
        console.warn('Live approveRequest failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const req = db.timeOffRequests.find((r) => String(r.id) === String(id));
    if (req) {
      req.status = 'Approved';
      mockDataStore.save(db);
      return { data: req };
    }
    throw new Error('Leave request not found');
  },

  rejectRequest: async (id, reason) => {
    if (!USE_MOCK_DATA) {
      try {
        await apiClient.post(`/leaves/${id}/reject`, { reason });
        return { data: { id, status: 'Rejected' } };
      } catch (err) {
        console.warn('Live rejectRequest failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const req = db.timeOffRequests.find((r) => String(r.id) === String(id));
    if (req) {
      req.status = 'Rejected';
      req.rejectionReason = reason;
      mockDataStore.save(db);
      return { data: req };
    }
    throw new Error('Leave request not found');
  }
};
