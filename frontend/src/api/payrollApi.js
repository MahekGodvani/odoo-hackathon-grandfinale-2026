import apiClient from './axios';

/**
 * PEOPLEPAY360 - PAYROLL & PAYRUN API SERVICE
 * Connects directly to backend /api/payroll and /api/salary — no mock fallback.
 */

const normalizePayrun = (p) => ({
  id: p.id?.toString() || `RUN-${p.period_year}-${p.period_month}`,
  name: p.name || `${new Date(p.period_year, p.period_month - 1).toLocaleString('default', { month: 'long' })} ${p.period_year} Regular Payrun`,
  periodStart: p.periodStart || `${p.period_year}-${String(p.period_month).padStart(2, '0')}-01`,
  periodEnd: p.periodEnd || `${p.period_year}-${String(p.period_month).padStart(2, '0')}-28`,
  paymentDate: p.paid_at ? String(p.paid_at).slice(0, 10) : p.paymentDate || '',
  period: p.period || `${new Date(p.period_year, p.period_month - 1).toLocaleString('default', { month: 'long' })} ${p.period_year}`,
  periodMonth: p.period_month,
  periodYear: p.period_year,
  status: p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1)) : 'Draft',
  totalGross: Number(p.total_gross_pay ?? p.totalGross ?? 0),
  totalDeductions: Number(p.total_deductions ?? p.totalDeductions ?? 0),
  totalNet: Number(p.total_net_pay ?? p.totalNet ?? 0),
  employeeCount: Number(p.total_payslips ?? p.employeeCount ?? 0),
  totalEmployees: Number(p.total_payslips ?? p.totalEmployees ?? 0),
  payslipCount: Number(p.total_payslips ?? p.payslipCount ?? 0),
  createdDate: p.created_at ? String(p.created_at).slice(0, 10) : p.createdDate || ''
});

export const payrollApi = {
  getSalaryStructures: async () => {
    const res = await apiClient.get('/salary/structures');
    if (res.data?.success && res.data.structures) {
      return { data: res.data.structures };
    }
    return { data: [] };
  },

  createSalaryStructure: async (data) => {
    const res = await apiClient.post('/salary/structures', {
      name: data.name,
      description: data.description
    });
    return { data: { ...data, id: res.data.structure_id, status: 'Active' } };
  },

  getSalaryRules: async (structureId) => {
    const params = structureId ? { structure_id: structureId } : {};
    const res = await apiClient.get('/salary/rules', { params });
    if (res.data?.success && res.data.rules) {
      return { data: res.data.rules };
    }
    return { data: [] };
  },

  createSalaryRule: async (data) => {
    const payload = {
      structure_id: data.structureId || data.structure_id,
      name: data.name,
      code: data.code,
      category: data.category,
      sequence: data.sequence,
      calculation_type: data.calculationType || data.calculation_type,
      value: data.value,
      base_rule: data.baseRule || data.base_rule
    };
    const res = await apiClient.post('/salary/rules', payload);
    return { data: { ...data, id: res.data.rule_id, status: 'Active' } };
  },

  updateSalaryRule: async (id, data) => {
    const payload = {
      name: data.name,
      code: data.code,
      category: data.category,
      sequence: data.sequence,
      calculation_type: data.calculationType || data.calculation_type,
      value: data.value,
      base_rule: data.baseRule || data.base_rule,
      status: data.status
    };
    await apiClient.put(`/salary/rules/${id}`, payload);
    return { data: { ...data, id } };
  },

  getPayruns: async () => {
    const res = await apiClient.get('/payroll');
    if (res.data?.payrolls && Array.isArray(res.data.payrolls)) {
      return { data: res.data.payrolls.map(normalizePayrun) };
    }
    return { data: [] };
  },

  getPayrun: async (id) => {
    const res = await apiClient.get(`/payroll/${id}`);
    if (res.data?.payroll) {
      const run = normalizePayrun(res.data.payroll);
      const payslips = (res.data.payslips || []).map((ps) => ({
        id: ps.id?.toString(),
        employeeId: ps.employee_id?.toString(),
        employeeName: `${ps.first_name || ''} ${ps.last_name || ''}`.trim() || 'Employee',
        employeeCode: ps.employee_code,
        department: ps.department,
        basic: Number(ps.base_salary || 0),
        allowances: Number(ps.allowances_total || 0),
        gross: Number(ps.gross_salary || 0),
        deductions: Number(ps.total_deductions || 0),
        net: Number(ps.net_salary || 0),
        status: ps.payment_status ? (ps.payment_status.charAt(0).toUpperCase() + ps.payment_status.slice(1)) : 'Computed'
      }));
      return { data: { ...run, payslips } };
    }
    throw new Error('Payrun not found');
  },

  checkEligibility: async (periodMonth, periodYear) => {
    const res = await apiClient.get('/payroll/eligibility', {
      params: { period_month: periodMonth, period_year: periodYear }
    });
    return { data: res.data };
  },

  createPayrun: async (data) => {
    const payload = {
      period_month: data.periodMonth || (data.startDate ? new Date(data.startDate).getMonth() + 1 : new Date().getMonth() + 1),
      period_year: data.periodYear || (data.startDate ? new Date(data.startDate).getFullYear() : new Date().getFullYear()),
      selected_employee_ids: data.selectedEmployeeIds
    };
    const res = await apiClient.post('/payroll/generate', payload);
    return { data: { ...data, id: res.data.payroll_id, status: 'Draft' } };
  },

  computePayrun: async (payrunId) => {
    const res = await apiClient.post(`/payroll/${payrunId}/process`);
    return { data: { id: payrunId, status: 'Computed' } };
  },

  validatePayrun: async (payrunId) => {
    const res = await apiClient.post(`/payroll/${payrunId}/approve`);
    return { data: { id: payrunId, status: 'Validated' } };
  },

  markPaid: async (payrunId) => {
    const res = await apiClient.put(`/payroll/${payrunId}/pay`);
    return { data: { id: payrunId, status: 'Paid' } };
  },

  markPayrunPaid: async (payrunId) => {
    return payrollApi.markPaid(payrunId);
  },

  sendPayslips: async (payrunId) => {
    const res = await apiClient.post(`/payroll/${payrunId}/send`);
    return { data: res.data };
  }
};
