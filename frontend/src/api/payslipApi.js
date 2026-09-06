import apiClient from './axios';

/**
 * PEOPLEPAY360 - PAYSLIP API SERVICE
 * Connects directly to backend /api/payslips — no mock fallback.
 */

const normalizePayslip = (p) => ({
  id: p.id?.toString() || `PS-${p.id}`,
  payrunId: p.payroll_id?.toString() || p.payrunId,
  employeeId: p.employee_id?.toString() || p.employeeId,
  employeeName: p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.employeeName || 'Employee',
  employeeCode: p.employee_code || p.employeeCode || `EMP-${p.employee_id}`,
  department: p.department || '',
  designation: p.designation || '',
  position: p.designation || p.position || '',
  periodMonth: p.period_month || 8,
  periodYear: p.period_year || 2026,
  period: p.period || `${new Date(p.period_year || 2026, (p.period_month || 8) - 1).toLocaleString('default', { month: 'short' })} ${p.period_year || 2026}`,
  basic: Number(p.base_salary || p.basic || 0),
  hra: Number(p.hra || 0),
  ta: Number(p.ta || 0),
  allowances: Number(p.allowances_total || p.allowances || 0),
  gross: Number(p.gross_salary || p.gross || 0),
  pf: Number(p.pf || 0),
  tax: Number(p.tax_deductions || p.tax || 0),
  deductions: Number(p.total_deductions || p.deductions || p.totalDeductions || 0),
  totalDeductions: Number(p.total_deductions || p.totalDeductions || 0),
  net: Number(p.net_salary || p.net || 0),
  workingDays: Number(p.working_days || p.workedDays || 30),
  presentDays: Number(p.present_days || 28),
  workedDays: Number(p.present_days || p.workedDays || p.working_days || 28),
  paidDays: Number(p.present_days || p.paidDays || 28),
  leaveDays: Number(p.paid_leave_days || p.leaveDays || 0),
  structureName: p.structure_name || p.structureName || 'Standard Regular Structure',
  paidLeaveDays: Number(p.paid_leave_days || 0),
  unpaidLeaveDays: Number(p.unpaid_leave_days || 0),
  bankName: p.bank_name || '',
  accountNo: p.bank_account_no || '',
  ifsc: p.bank_ifsc_code || '',
  status: p.payment_status ? (p.payment_status.charAt(0).toUpperCase() + p.payment_status.slice(1)) : (p.status || 'Paid'),
  paymentDate: p.payment_date ? String(p.payment_date).slice(0, 10) : p.paymentDate || '',
  emailSent: !!p.email_sent,
  lines: p.lines || []
});


export const payslipApi = {
  getPayslips: async (params = {}) => {
    const queryParams = {
      ...params,
      payroll_id: params.payroll_id || params.payrunId,
      employee_id: params.employee_id || params.employeeId
    };
    const res = await apiClient.get('/payslips', { params: queryParams });
    if (res.data?.payslips && Array.isArray(res.data.payslips)) {
      return { data: res.data.payslips.map(normalizePayslip) };
    }
    return { data: [] };
  },

  getPayslip: async (id) => {
    const res = await apiClient.get(`/payslips/${id}`);
    if (res.data?.payslip) {
      return { data: normalizePayslip(res.data.payslip) };
    }
    throw new Error('Payslip not found');
  },

  sendPayslipEmail: async (id) => {
    const res = await apiClient.post(`/payslips/${id}/send`);
    return { data: res.data };
  },

  downloadPayslipPdf: async (id) => {
    const res = await apiClient.get(`/payslips/${id}/download`);
    return { data: res.data };
  }
};
