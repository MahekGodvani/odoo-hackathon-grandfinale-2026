import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - CONTRACT API SERVICE
 * Manages employment contracts, active wage settings, and salary structure linking.
 */

export const contractApi = {
  getContracts: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.contracts };
    }
    return apiClient.get('/contracts');
  },

  getContractByEmployee: async (employeeId) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const contract = db.contracts.find((c) => c.employeeId === employeeId && c.status === 'Active');
      return { data: contract || null };
    }
    return apiClient.get(`/contracts/employee/${employeeId}`);
  },

  createContract: async (contractData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newContract = {
        id: `CTR-2026-${db.contracts.length + 10}`,
        status: 'Active',
        ...contractData,
      };
      
      // If setting to active, update previous contracts for employee to expired
      if (newContract.status === 'Active') {
        db.contracts.forEach((c) => {
          if (c.employeeId === newContract.employeeId) {
            c.status = 'Expired';
          }
        });
      }

      db.contracts.unshift(newContract);
      mockDataStore.save(db);
      return { data: newContract };
    }
    return apiClient.post('/contracts', contractData);
  },

  updateContract: async (id, contractData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const idx = db.contracts.findIndex((c) => c.id === id);
      if (idx !== -1) {
        db.contracts[idx] = { ...db.contracts[idx], ...contractData };
        mockDataStore.save(db);
        return { data: db.contracts[idx] };
      }
      throw new Error('Contract not found');
    }
    return apiClient.put(`/contracts/${id}`, contractData);
  }
};
