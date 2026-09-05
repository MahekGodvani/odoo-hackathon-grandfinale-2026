import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - EMPLOYEE API SERVICE
 * 
 * For HTML/JS Developers:
 * Service functions abstract away HTTP calls. Your React components simply call
 * `employeeApi.getEmployees()`. If back-end is running, Axios sends REST requests;
 * otherwise it seamlessly fallback-reads from `mockDataStore`.
 */

export const employeeApi = {
  getEmployees: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.employees };
    }
    return apiClient.get('/employees');
  },

  getEmployee: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const emp = db.employees.find((e) => e.id === id);
      if (!emp) throw new Error('Employee not found');
      return { data: emp };
    }
    return apiClient.get(`/employees/${id}`);
  },

  createEmployee: async (empData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newId = `EMP-${100 + db.employees.length + 1}`;
      const newEmp = {
        id: newId,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        ...empData,
      };
      db.employees.unshift(newEmp);

      // Auto-generate active contract for employee if wage is supplied
      if (empData.wage) {
        db.contracts.unshift({
          id: `CTR-2026-${db.contracts.length + 1}`,
          employeeId: newId,
          employeeName: newEmp.name,
          startDate: new Date().toISOString().split('T')[0],
          endDate: '2026-12-31',
          wage: Number(empData.wage),
          department: newEmp.department,
          position: newEmp.position,
          structureId: 'struct-1',
          structureName: 'Standard Regular Structure',
          status: 'Active'
        });
      }

      mockDataStore.save(db);
      return { data: newEmp };
    }
    return apiClient.post('/employees', empData);
  },

  updateEmployee: async (id, empData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const idx = db.employees.findIndex((e) => e.id === id);
      if (idx !== -1) {
        db.employees[idx] = { ...db.employees[idx], ...empData };
        mockDataStore.save(db);
        return { data: db.employees[idx] };
      }
      throw new Error('Employee not found');
    }
    return apiClient.put(`/employees/${id}`, empData);
  },

  deleteEmployee: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      db.employees = db.employees.filter((e) => e.id !== id);
      db.contracts = db.contracts.filter((c) => c.employeeId !== id);
      mockDataStore.save(db);
      return { data: { success: true } };
    }
    return apiClient.delete(`/employees/${id}`);
  }
};
