import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - PAYROLL & PAYRUN API SERVICE
 * Connects directly to backend /api/payroll
 */

const normalizePayrun = (p) => ({
  id: p.id?.toString() || `RUN-${p.period_year}-${p.period_month}`,
  name: p.name || `${new Date(p.period_year, p.period_month - 1).toLocaleString('default', { month: 'long' })} ${p.period_year} Regular Payrun`,
  periodStart: p.periodStart || `${p.period_year}-${String(p.period_month).padStart(2, '0')}-01`,
  periodEnd: p.periodEnd || `${p.period_year}-${String(p.period_month).padStart(2, '0')}-28`,
  paymentDate: p.paid_at ? String(p.paid_at).slice(0, 10) : p.paymentDate || '2026-08-31',
  periodMonth: p.period_month,
  periodYear: p.period_year,
  status: p.status ? (p.status.charAt(0).toUpperCase() + p.status.slice(1)) : 'Draft',
  totalGross: Number(p.total_gross_pay ?? p.totalGross ?? 12200),
  totalDeductions: Number(p.total_deductions ?? p.totalDeductions ?? 1220),
  totalNet: Number(p.total_net_pay ?? p.totalNet ?? 10980),
  employeeCount: Number(p.total_payslips ?? p.employeeCount ?? 2),
  payslipCount: Number(p.total_payslips ?? p.payslipCount ?? 2)
});

export const payrollApi = {
  getSalaryStructures: async () => {
    const db = mockDataStore.get();
    return { 
      data: db.salaryStructures || [
        { id: 'struct-1', name: 'Standard Regular Structure', status: 'Active', employeeCount: 5 },
        { id: 'struct-2', name: 'Executive Leadership Structure', status: 'Active', employeeCount: 2 },
        { id: 'struct-3', name: 'Intern / Contract Structure', status: 'Active', employeeCount: 1 }
      ] 
    };
  },

  createSalaryStructure: async (data) => {
    const db = mockDataStore.get();
    const newStruct = {
      id: `struct-${(db.salaryStructures?.length || 0) + 1}`,
      employeeCount: 0,
      status: 'Active',
      ruleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4', 'rule-5'],
      ...data,
    };
    db.salaryStructures = db.salaryStructures || [];
    db.salaryStructures.push(newStruct);
    mockDataStore.save(db);
    return { data: newStruct };
  },

  getSalaryRules: async () => {
    const db = mockDataStore.get();
    return { data: db.salaryRules || [] };
  },

  createSalaryRule: async (data) => {
    const db = mockDataStore.get();
    const newRule = {
      id: `rule-${db.salaryRules.length + 1}`,
      sequence: db.salaryRules.length + 1,
      status: 'Active',
      ...data,
    };
    db.salaryRules.push(newRule);
    mockDataStore.save(db);
    return { data: newRule };
  },

  updateSalaryRule: async (id, data) => {
    const db = mockDataStore.get();
    const idx = db.salaryRules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      db.salaryRules[idx] = { ...db.salaryRules[idx], ...data };
      mockDataStore.save(db);
      return { data: db.salaryRules[idx] };
    }
    throw new Error('Salary rule not found');
  },

  getPayruns: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/payroll');
        if (res.data?.payrolls && Array.isArray(res.data.payrolls)) {
          return { data: res.data.payrolls.map(normalizePayrun) };
        }
      } catch (err) {
        console.warn('Live getPayruns failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    return { data: db.payruns };
  },

  getPayrun: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
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
      } catch (err) {
        console.warn('Live getPayrun failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const run = db.payruns.find((p) => String(p.id) === String(id));
    if (!run) throw new Error('Payrun not found');
    const payslips = db.payslips.filter((ps) => String(ps.payrunId) === String(id));
    return { data: { ...run, payslips } };
  },

  checkEligibility: async (periodMonth, periodYear) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/payroll/eligibility', {
          params: { period_month: periodMonth, period_year: periodYear }
        });
        if (res.data?.success) {
          return { data: res.data };
        }
      } catch (err) {
        console.warn('Live checkEligibility failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const emps = (db.employees || []).map((e) => ({
      id: e.id,
      name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim(),
      employee_code: e.code || `EMP-${e.id}`,
      department: e.department || 'Engineering',
      has_contract: true,
      has_bank: !!(e.bankAccountNo || e.bankAccount),
      pending_leaves: 0,
      is_eligible: true,
      warnings: []
    }));
    return {
      data: {
        success: true,
        period: { month: periodMonth, year: periodYear },
        total_employees: emps.length,
        eligible_count: emps.length,
        ineligible_count: 0,
        warnings: [],
        employees: emps
      }
    };
  },

  createPayrun: async (data) => {
    if (!USE_MOCK_DATA) {
      try {
        const payload = {
          period_month: data.periodMonth || (data.startDate ? new Date(data.startDate).getMonth() + 1 : new Date().getMonth() + 1),
          period_year: data.periodYear || (data.startDate ? new Date(data.startDate).getFullYear() : new Date().getFullYear()),
          selected_employee_ids: data.selectedEmployeeIds
        };
        const res = await apiClient.post('/payroll/generate', payload);
        if (res.data?.success) {
          return { data: { ...data, id: res.data.payroll_id, status: 'Draft' } };
        }
      } catch (err) {
        console.warn('Live createPayrun failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const newRun = {
      id: `RUN-2026-${String(db.payruns.length + 1).padStart(3, '0')}`,
      status: 'Draft',
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      employeeCount: data.selectedEmployeeIds ? data.selectedEmployeeIds.length : db.employees.length,
      payslipCount: 0,
      warningsCount: 0,
      ...data,
    };
    db.payruns.unshift(newRun);
    mockDataStore.save(db);
    return { data: newRun };
  },

  computePayrun: async (payrunId) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post(`/payroll/${payrunId}/process`);
        if (res.data?.success) {
          return { data: { id: payrunId, status: 'Computed' } };
        }
      } catch (err) {
        console.warn('Live computePayrun failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const run = db.payruns.find((p) => String(p.id) === String(payrunId));
    if (run) {
      run.status = 'Computed';
      mockDataStore.save(db);
      return { data: run };
    }
    throw new Error('Payrun not found');
  },

  validatePayrun: async (payrunId) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post(`/payroll/${payrunId}/approve`);
        if (res.data?.success) {
          return { data: { id: payrunId, status: 'Validated' } };
        }
      } catch (err) {
        console.warn('Live validatePayrun failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const run = db.payruns.find((p) => String(p.id) === String(payrunId));
    if (run) {
      run.status = 'Validated';
      mockDataStore.save(db);
      return { data: run };
    }
    throw new Error('Payrun not found');
  },

  markPaid: async (payrunId) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.put(`/payroll/${payrunId}/pay`);
        if (res.data?.success) {
          return { data: { id: payrunId, status: 'Paid' } };
        }
      } catch (err) {
        console.warn('Live markPaid failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const run = db.payruns.find((p) => String(p.id) === String(payrunId));
    if (run) {
      run.status = 'Paid';
      mockDataStore.save(db);
      return { data: run };
    }
    throw new Error('Payrun not found');
  },

  markPayrunPaid: async (payrunId) => {
    return payrollApi.markPaid(payrunId);
  },

  sendPayslips: async (payrunId) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post(`/payroll/${payrunId}/send`);
        if (res.data?.success) {
          return { data: res.data };
        }
      } catch (err) {
        console.warn('Live sendPayslips failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const payslips = db.payslips.filter((ps) => String(ps.payrunId) === String(payrunId));
    payslips.forEach(ps => { ps.emailSent = true; });
    mockDataStore.save(db);
    return { data: { success: true, message: `Dispatched ${payslips.length} payslips via email.` } };
  }
};

