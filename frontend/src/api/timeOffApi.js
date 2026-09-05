import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - TIME OFF API SERVICE
 * Manages Leave Types, Allocations, and Requests with dynamic balance deductions.
 */

export const timeOffApi = {
  getTimeOffTypes: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.timeOffTypes };
    }
    return apiClient.get('/time-off/types');
  },

  createTimeOffType: async (typeData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newType = {
        id: `tot-${db.timeOffTypes.length + 1}`,
        status: 'Active',
        ...typeData,
      };
      db.timeOffTypes.push(newType);
      mockDataStore.save(db);
      return { data: newType };
    }
    return apiClient.post('/time-off/types', typeData);
  },

  getAllocations: async (params = {}) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      let allocs = [...db.allocations];
      if (params.employeeId) {
        allocs = allocs.filter((a) => a.employeeId === params.employeeId);
      }
      return { data: allocs };
    }
    return apiClient.get('/time-off/allocations', { params });
  },

  createAllocation: async (allocData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newAlloc = {
        id: `alloc-${db.allocations.length + 1}`,
        taken: 0,
        remaining: Number(allocData.allocated),
        status: 'Active',
        ...allocData,
      };
      db.allocations.push(newAlloc);
      mockDataStore.save(db);
      return { data: newAlloc };
    }
    return apiClient.post('/time-off/allocations', allocData);
  },

  getTimeOffRequests: async (params = {}) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      let reqs = [...db.timeOffRequests];
      if (params.employeeId) {
        reqs = reqs.filter((r) => r.employeeId === params.employeeId);
      }
      return { data: reqs };
    }
    return apiClient.get('/time-off/requests', { params });
  },

  createTimeOffRequest: async (reqData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const alloc = db.allocations.find(
        (a) => a.employeeId === reqData.employeeId && a.typeId === reqData.typeId
      );
      const balanceBefore = alloc ? alloc.remaining : 10;
      const duration = Number(reqData.duration || 1);

      const newReq = {
        id: `TOR-${100 + db.timeOffRequests.length + 1}`,
        status: 'Pending',
        balanceBefore,
        balanceRemaining: Math.max(0, balanceBefore - duration),
        ...reqData,
      };

      db.timeOffRequests.unshift(newReq);
      mockDataStore.save(db);
      return { data: newReq };
    }
    return apiClient.post('/time-off/requests', reqData);
  },

  approveRequest: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const req = db.timeOffRequests.find((r) => r.id === id);
      if (!req) throw new Error('Request not found');

      req.status = 'Approved';
      // Deduct from allocation balance
      const alloc = db.allocations.find(
        (a) => a.employeeId === req.employeeId && a.typeId === req.typeId
      );
      if (alloc) {
        alloc.taken += Number(req.duration);
        alloc.remaining = Math.max(0, alloc.allocated - alloc.taken);
      }

      mockDataStore.save(db);
      return { data: req };
    }
    return apiClient.put(`/time-off/requests/${id}/approve`);
  },

  refuseRequest: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const req = db.timeOffRequests.find((r) => r.id === id);
      if (!req) throw new Error('Request not found');
      req.status = 'Refused';
      mockDataStore.save(db);
      return { data: req };
    }
    return apiClient.put(`/time-off/requests/${id}/refuse`);
  }
};
