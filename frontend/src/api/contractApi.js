import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - CONTRACT API SERVICE
 * Connects directly to backend /api/contracts and /api/salaries
 */

const normalizeContract = (c) => ({
  id: c.id?.toString() || `CTR-${c.id}`,
  employeeId: c.employee_id?.toString() || c.employeeId,
  employeeName: c.first_name ? `${c.first_name} ${c.last_name || ''}`.trim() : c.employeeName || 'Employee',
  department: c.department || 'Engineering',
  position: c.designation || c.position || 'Staff',
  startDate: c.start_date ? String(c.start_date).slice(0, 10) : c.startDate || '2025-01-01',
  endDate: c.end_date ? String(c.end_date).slice(0, 10) : c.endDate || null,
  wage: Number(c.base_salary ?? c.wage ?? 5000),
  baseSalary: Number(c.base_salary ?? c.wage ?? 5000),
  hraAllowance: Number(c.hra_allowance ?? 0),
  transportAllowance: Number(c.transport_allowance ?? 0),
  otherAllowance: Number(c.other_allowance ?? 0),
  taxDeductionRate: Number(c.tax_deduction_rate ?? 10),
  structureId: c.structureId || 'struct-1',
  structureName: c.structureName || 'Standard Regular Structure',
  status: c.status ? (c.status.charAt(0).toUpperCase() + c.status.slice(1)) : 'Active'
});

export const contractApi = {
  getContracts: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/salaries');
        if (res.data?.salaries && Array.isArray(res.data.salaries)) {
          return { data: res.data.salaries.map(normalizeContract) };
        }
      } catch (err) {
        console.warn('Live getContracts failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    return { data: db.contracts };
  },

  getContractByEmployee: async (employeeId) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get(`/contracts/employee/${employeeId}`);
        if (res.data?.contracts && res.data.contracts.length > 0) {
          return { data: normalizeContract(res.data.contracts[0]) };
        }
      } catch (err) {
        console.warn('Live getContractByEmployee failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const contract = db.contracts.find((c) => String(c.employeeId) === String(employeeId) && c.status === 'Active');
    return { data: contract || null };
  },

  createContract: async (contractData) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          employee_id: contractData.employeeId || contractData.employee_id,
          contract_type: contractData.contractType || 'full_time',
          base_salary: contractData.wage || contractData.baseSalary || 5000,
          hra_allowance: contractData.hraAllowance || 0,
          transport_allowance: contractData.transportAllowance || 0,
          other_allowance: contractData.otherAllowance || 0,
          tax_deduction_rate: contractData.taxDeductionRate || 10,
          start_date: contractData.startDate || new Date().toISOString().slice(0, 10),
          end_date: contractData.endDate || null
        };
        const res = await apiClient.post('/contracts/assign', payload);
        if (res.data?.success) {
          return { data: { ...contractData, id: res.data.contract_id, status: 'Active' } };
        }
      } catch (err) {
        console.warn('Live createContract failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const newContract = {
      id: `CTR-2026-${db.contracts.length + 10}`,
      status: 'Active',
      ...contractData,
    };
    if (newContract.status === 'Active') {
      db.contracts.forEach((c) => {
        if (String(c.employeeId) === String(newContract.employeeId)) {
          c.status = 'Expired';
        }
      });
    }
    db.contracts.unshift(newContract);
    mockDataStore.save(db);
    return { data: newContract };
  },

  updateContract: async (id, contractData) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          base_salary: contractData.wage || contractData.baseSalary,
          hra_allowance: contractData.hraAllowance,
          transport_allowance: contractData.transportAllowance,
          other_allowance: contractData.otherAllowance,
          tax_deduction_rate: contractData.taxDeductionRate
        };
        await apiClient.put(`/salaries/${id}`, payload);
        return { data: { ...contractData, id } };
      } catch (err) {
        console.warn('Live updateContract failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const idx = db.contracts.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      db.contracts[idx] = { ...db.contracts[idx], ...contractData };
      mockDataStore.save(db);
      return { data: db.contracts[idx] };
    }
    throw new Error('Contract not found');
  }
};
