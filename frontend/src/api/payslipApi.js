import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - PAYSLIP API SERVICE
 */

export const payslipApi = {
  getPayslips: async (params = {}) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      let records = [...db.payslips];
      if (params.employeeId) {
        records = records.filter((p) => p.employeeId === params.employeeId);
      }
      if (params.payrunId) {
        records = records.filter((p) => p.payrunId === params.payrunId);
      }
      return { data: records };
    }
    return apiClient.get('/payslips', { params });
  },

  getPayslip: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payslip = db.payslips.find((p) => p.id === id);
      if (!payslip) throw new Error('Payslip not found');
      return { data: payslip };
    }
    return apiClient.get(`/payslips/${id}`);
  },

  downloadPayslipPdf: async (id) => {
    if (USE_MOCK_DATA) {
      // Mock PDF trigger feedback
      return { data: { success: true, message: `Payslip #${id} printed/downloaded successfully` } };
    }
    return apiClient.get(`/payslips/${id}/pdf`, { responseType: 'blob' });
  }
};
