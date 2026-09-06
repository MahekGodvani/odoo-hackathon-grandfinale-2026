import apiClient from './axios';

/**
 * PEOPLEPAY360 - CONTRACT API SERVICE
 * Connects directly to backend /api/contracts and /api/salaries — no mock fallback.
 */

const normalizeContract = (c) => ({
  id: c.id?.toString() || `CTR-${c.id}`,
  employeeId: c.employee_id?.toString() || c.employeeId,
  employeeName: c.first_name ? `${c.first_name} ${c.last_name || ''}`.trim() : c.employeeName || 'Employee',
  department: c.department || '',
  position: c.designation || c.position || '',
  startDate: c.start_date ? String(c.start_date).slice(0, 10) : c.startDate || '',
  endDate: c.end_date ? String(c.end_date).slice(0, 10) : c.endDate || null,
  wage: Number(c.base_salary ?? c.wage ?? 0),
  baseSalary: Number(c.base_salary ?? c.wage ?? 0),
  hraAllowance: Number(c.hra_allowance ?? 0),
  transportAllowance: Number(c.transport_allowance ?? 0),
  otherAllowance: Number(c.other_allowance ?? 0),
  taxDeductionRate: Number(c.tax_deduction_rate ?? 10),
  structureId: c.structure_id || c.structureId || 1,
  structureName: c.structure_name || c.structureName || 'Standard Regular Structure',
  status: c.status ? (c.status.charAt(0).toUpperCase() + c.status.slice(1)) : 'Active'
});

export const contractApi = {
  getContracts: async () => {
    try {
      const res = await apiClient.get('/contracts');
      if (res.data?.contracts && Array.isArray(res.data.contracts)) {
        return { data: res.data.contracts.map(normalizeContract) };
      }
    } catch {
      // Try salaries endpoint as fallback
      const res = await apiClient.get('/salaries');
      if (res.data?.salaries && Array.isArray(res.data.salaries)) {
        return { data: res.data.salaries.map(normalizeContract) };
      }
    }
    return { data: [] };
  },

  getContractByEmployee: async (employeeId) => {
    const res = await apiClient.get(`/contracts/employee/${employeeId}`);
    if (res.data?.contracts && res.data.contracts.length > 0) {
      return { data: normalizeContract(res.data.contracts[0]) };
    }
    return { data: null };
  },

  createContract: async (contractData) => {
    const payload = {
      employee_id: contractData.employeeId || contractData.employee_id,
      structure_id: contractData.structureId || contractData.structure_id || 1,
      contract_type: contractData.contractType || 'full_time',
      base_salary: Number(contractData.wage || contractData.baseSalary || 0),
      hra_allowance: Number(contractData.hraAllowance || 0),
      transport_allowance: Number(contractData.transportAllowance || 0),
      other_allowance: Number(contractData.otherAllowance || 0),
      tax_deduction_rate: Number(contractData.taxDeductionRate || 10),
      start_date: contractData.startDate || new Date().toISOString().slice(0, 10),
      end_date: contractData.endDate || null,
      status: (contractData.status || 'active').toLowerCase()
    };
    const res = await apiClient.post('/contracts/assign', payload);
    return { data: { ...contractData, id: res.data.contract_id, status: contractData.status || 'Active' } };
  },

  updateContract: async (id, contractData) => {
    const payload = {
      structure_id: contractData.structureId || contractData.structure_id,
      base_salary: contractData.wage !== undefined ? Number(contractData.wage) : Number(contractData.baseSalary),
      hra_allowance: contractData.hraAllowance !== undefined ? Number(contractData.hraAllowance) : undefined,
      transport_allowance: contractData.transportAllowance !== undefined ? Number(contractData.transportAllowance) : undefined,
      other_allowance: contractData.otherAllowance !== undefined ? Number(contractData.otherAllowance) : undefined,
      tax_deduction_rate: contractData.taxDeductionRate !== undefined ? Number(contractData.taxDeductionRate) : undefined,
      start_date: contractData.startDate,
      end_date: contractData.endDate,
      status: contractData.status?.toLowerCase()
    };
    try {
      await apiClient.put(`/contracts/${id}`, payload);
    } catch {
      await apiClient.put(`/salaries/${id}`, payload);
    }
    return { data: { ...contractData, id } };
  }
};
