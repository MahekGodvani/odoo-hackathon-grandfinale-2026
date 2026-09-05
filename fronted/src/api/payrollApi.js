import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - PAYROLL & PAYRUN API SERVICE
 * Hero service for structures, rules, 2-step payruns, processing, warnings, and computation logic.
 */

export const payrollApi = {
  getSalaryStructures: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.salaryStructures };
    }
    return apiClient.get('/payroll/salary-structures');
  },

  createSalaryStructure: async (data) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newStruct = {
        id: `struct-${db.salaryStructures.length + 1}`,
        employeeCount: 0,
        status: 'Active',
        ruleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4', 'rule-5'],
        ...data,
      };
      db.salaryStructures.push(newStruct);
      mockDataStore.save(db);
      return { data: newStruct };
    }
    return apiClient.post('/payroll/salary-structures', data);
  },

  getSalaryRules: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.salaryRules };
    }
    return apiClient.get('/payroll/salary-rules');
  },

  createSalaryRule: async (data) => {
    if (USE_MOCK_DATA) {
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
    }
    return apiClient.post('/payroll/salary-rules', data);
  },

  updateSalaryRule: async (id, data) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const idx = db.salaryRules.findIndex((r) => r.id === id);
      if (idx !== -1) {
        db.salaryRules[idx] = { ...db.salaryRules[idx], ...data };
        mockDataStore.save(db);
        return { data: db.salaryRules[idx] };
      }
      throw new Error('Salary rule not found');
    }
    return apiClient.put(`/payroll/salary-rules/${id}`, data);
  },

  getPayruns: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.payruns };
    }
    return apiClient.get('/payroll/payruns');
  },

  getPayrun: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payrun = db.payruns.find((p) => p.id === id);
      if (!payrun) throw new Error('Payrun not found');
      return { data: payrun };
    }
    return apiClient.get(`/payroll/payruns/${id}`);
  },

  createPayrun: async (payrunData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newId = `PR-2026-0${db.payruns.length + 8}`;
      const newPayrun = {
        id: newId,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        totalGross: 0,
        totalDeductions: 0,
        totalNet: 0,
        totalEmployees: payrunData.selectedEmployeeIds ? payrunData.selectedEmployeeIds.length : db.employees.length,
        ...payrunData,
      };
      db.payruns.unshift(newPayrun);
      mockDataStore.save(db);
      return { data: newPayrun };
    }
    return apiClient.post('/payroll/payruns', payrunData);
  },

  computePayrun: async (payrunId) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payrun = db.payruns.find((p) => p.id === payrunId);
      if (!payrun) throw new Error('Payrun not found');

      const selectedEmpIds = payrun.selectedEmployeeIds || db.employees.map((e) => e.id);
      let totalGross = 0;
      let totalDeductions = 0;
      let totalNet = 0;
      const generatedPayslips = [];

      selectedEmpIds.forEach((empId) => {
        const emp = db.employees.find((e) => e.id === empId);
        const contract = db.contracts.find((c) => c.employeeId === empId && c.status === 'Active');

        // Salary calculation based on active contract wage or fallback 45000
        const baseWage = contract ? contract.wage : 45000;
        const basic = Math.round(baseWage * 0.7);
        const hra = Math.round(basic * 0.2);
        const ta = 3000;
        const gross = basic + hra + ta;
        const pf = Math.round(basic * 0.12);
        const deductions = pf;
        const net = gross - deductions;

        totalGross += gross;
        totalDeductions += deductions;
        totalNet += net;

        const payslipId = `PS-${payrun.id}-${empId}`;
        const newPayslip = {
          id: payslipId,
          payrunId: payrun.id,
          employeeId: empId,
          employeeName: emp ? emp.name : 'Employee',
          department: emp ? emp.department : 'General',
          position: emp ? emp.position : 'Staff',
          period: payrun.period || 'August 2026',
          structureName: payrun.structureName || 'Standard Regular Structure',
          workedDays: 22,
          paidDays: 22,
          leaveDays: 0,
          basic,
          hra,
          ta,
          gross,
          pf,
          totalDeductions: deductions,
          net,
          status: 'Computed',
          paymentDate: new Date().toISOString().split('T')[0],
          lines: [
            { code: 'BASIC', name: 'Basic Salary', category: 'Basic', amount: basic },
            { code: 'HRA', name: 'House Rent Allowance (20%)', category: 'Allowance', amount: hra },
            { code: 'TA', name: 'Transport Allowance', category: 'Allowance', amount: ta },
            { code: 'PF', name: 'Provident Fund (12%)', category: 'Deduction', amount: pf },
          ]
        };

        // Update or insert into mock payslips
        const existingIdx = db.payslips.findIndex((ps) => ps.id === payslipId);
        if (existingIdx !== -1) {
          db.payslips[existingIdx] = newPayslip;
        } else {
          db.payslips.unshift(newPayslip);
        }
        generatedPayslips.push(newPayslip);
      });

      payrun.status = 'Computed';
      payrun.totalGross = totalGross;
      payrun.totalDeductions = totalDeductions;
      payrun.totalNet = totalNet;
      payrun.totalEmployees = selectedEmpIds.length;

      mockDataStore.save(db);
      return { data: { payrun, payslips: generatedPayslips } };
    }
    return apiClient.post(`/payroll/payruns/${payrunId}/compute`);
  },

  validatePayrun: async (payrunId) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payrun = db.payruns.find((p) => p.id === payrunId);
      if (!payrun) throw new Error('Payrun not found');
      payrun.status = 'Validated';
      db.payslips.forEach((ps) => {
        if (ps.payrunId === payrunId) ps.status = 'Validated';
      });
      mockDataStore.save(db);
      return { data: payrun };
    }
    return apiClient.post(`/payroll/payruns/${payrunId}/validate`);
  },

  markPayrunPaid: async (payrunId) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payrun = db.payruns.find((p) => p.id === payrunId);
      if (!payrun) throw new Error('Payrun not found');
      payrun.status = 'Paid';
      db.payslips.forEach((ps) => {
        if (ps.payrunId === payrunId) ps.status = 'Paid';
      });
      mockDataStore.save(db);
      return { data: payrun };
    }
    return apiClient.post(`/payroll/payruns/${payrunId}/mark-paid`);
  },

  sendPayslips: async (payrunId) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const payrun = db.payruns.find((p) => p.id === payrunId);
      if (!payrun) throw new Error('Payrun not found');
      payrun.payslipsSent = true;
      mockDataStore.save(db);
      return { data: { success: true, count: payrun.totalEmployees } };
    }
    return apiClient.post(`/payroll/payruns/${payrunId}/send-payslips`);
  }
};
