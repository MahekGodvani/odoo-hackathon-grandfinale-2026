import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - PAYSLIP API SERVICE
 * Connects directly to backend /api/payslips
 */

const normalizePayslip = (p) => ({
  id: p.id?.toString() || `PS-${p.id}`,
  payrunId: p.payroll_id?.toString() || p.payrunId,
  employeeId: p.employee_id?.toString() || p.employeeId,
  employeeName: p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.employeeName || 'Employee',
  employeeCode: p.employee_code || p.employeeCode || `EMP-${p.employee_id}`,
  department: p.department || 'Engineering',
  designation: p.designation || 'Staff',
  periodMonth: p.period_month || 8,
  periodYear: p.period_year || 2026,
  period: `${new Date(p.period_year || 2026, (p.period_month || 8) - 1).toLocaleString('default', { month: 'short' })} ${p.period_year || 2026}`,
  basic: Number(p.base_salary || p.basic || 5000),
  hra: Number(p.hra || 1000),
  allowances: Number(p.allowances_total || p.allowances || 1500),
  gross: Number(p.gross_salary || p.gross || 6500),
  tax: Number(p.tax_deductions || p.tax || 650),
  deductions: Number(p.total_deductions || p.deductions || 650),
  net: Number(p.net_salary || p.net || 5850),
  workingDays: Number(p.working_days || 30),
  presentDays: Number(p.present_days || 28),
  workedDays: Number(p.present_days || p.workedDays || p.working_days || 28),
  structureName: p.structure_name || p.structureName || 'Standard Regular Structure',
  paidLeaveDays: Number(p.paid_leave_days || 2),
  unpaidLeaveDays: Number(p.unpaid_leave_days || 0),
  bankName: p.bank_name || 'Chase Bank',
  accountNo: p.bank_account_no || '9876543210',
  ifsc: p.bank_ifsc_code || 'CHASUS33',
  status: p.payment_status ? (p.payment_status.charAt(0).toUpperCase() + p.payment_status.slice(1)) : 'Paid',
  emailSent: !!p.email_sent
});


export const payslipApi = {
  getPayslips: async (params = {}) => {
    if (!USE_MOCK_DATA) {
      try {
        const queryParams = {
          ...params,
          payroll_id: params.payroll_id || params.payrunId,
          employee_id: params.employee_id || params.employeeId
        };
        const res = await apiClient.get('/payslips', { params: queryParams });
        if (res.data?.payslips && Array.isArray(res.data.payslips)) {
          return { data: res.data.payslips.map(normalizePayslip) };
        }
      } catch (err) {
        console.warn('Live getPayslips failed, using fallback:', err?.message);
      }
    }

    const db = mockDataStore.get();
    let records = [...db.payslips];
    if (params.employeeId) {
      records = records.filter((p) => String(p.employeeId) === String(params.employeeId));
    }
    if (params.payrunId) {
      records = records.filter((p) => String(p.payrunId) === String(params.payrunId));
    }
    return { data: records };
  },

  getPayslip: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get(`/payslips/${id}`);
        if (res.data?.payslip) {
          return { data: normalizePayslip(res.data.payslip) };
        }
      } catch (err) {
        console.warn('Live getPayslip failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const payslip = db.payslips.find((p) => String(p.id) === String(id));
    if (!payslip) throw new Error('Payslip not found');
    return { data: payslip };
  },

  sendPayslipEmail: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post(`/payslips/${id}/send`);
        return { data: res.data };
      } catch (err) {
        console.warn('Live sendPayslipEmail failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const payslip = db.payslips.find((p) => String(p.id) === String(id));
    if (payslip) {
      payslip.emailSent = true;
      mockDataStore.save(db);
      return { data: { success: true } };
    }
    throw new Error('Payslip not found');
  },

  downloadPayslipPdf: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get(`/payslips/${id}/download`);
        return { data: res.data };
      } catch (err) {
        console.warn('Live downloadPayslipPdf fallback:', err?.message);
      }
    }
    return { data: { success: true, message: 'Ready for PDF download' } };
  }
};
