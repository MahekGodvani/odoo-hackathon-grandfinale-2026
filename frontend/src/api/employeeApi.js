import apiClient from './axios';

/**
 * PEOPLEPAY360 - EMPLOYEE API SERVICE
 * All operations connect directly to backend /api/employees — no mock fallback.
 */

const getAvatarUrl = (name, id) => {
  const cleanName = encodeURIComponent((name || 'Employee').trim());
  const colors = ['4f46e5', '2563eb', '059669', 'd97706', '7c3aed', 'db2777', '0d9488', '0891b2'];
  const colorIndex = (typeof id === 'number' ? id : (name?.length || 0)) % colors.length;
  const bg = colors[colorIndex];
  return `https://ui-avatars.com/api/?name=${cleanName}&background=${bg}&color=fff&bold=true&rounded=true`;
};

const normalizeEmployee = (emp) => {
  if (!emp) return null;
  const fullName = emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || emp.email || 'Employee';
  const code = emp.employee_code || (emp.id ? `EMP-${1000 + Number(emp.id)}` : 'EMP-1001');

  return {
    id: emp.id?.toString() || code,
    rawId: emp.id,
    code,
    employee_code: code,
    name: fullName,
    firstName: emp.first_name || '',
    lastName: emp.last_name || '',
    email: emp.email || '',
    phone: emp.phone || '',
    department: emp.department || '',
    position: emp.designation || emp.position || '',
    designation: emp.designation || emp.position || '',
    manager: emp.manager || '',
    scheduleName: emp.scheduleName || 'Standard Full-Time (40h)',
    status: (emp.status === 'active' || emp.status === 'Active') ? 'Active' : (emp.status || 'Active'),
    type: emp.type || (emp.contract_type === 'part_time' ? 'Part-time' : emp.contract_type === 'contract' ? 'Contract' : 'Full-time'),
    joinDate: emp.joining_date ? String(emp.joining_date).slice(0, 10) : emp.joinDate || '',
    avatar: getAvatarUrl(fullName, emp.id),
    wage: emp.wage || emp.base_salary || 0,
    baseSalary: emp.base_salary || emp.wage || 0,
    bankDetails: emp.bank_name ? {
      bankName: emp.bank_name,
      accountNo: emp.bank_account_no || emp.account_number,
      ifsc: emp.bank_ifsc_code || emp.ifsc_code
    } : emp.bankDetails
  };
};

export const employeeApi = {
  getEmployees: async () => {
    const res = await apiClient.get('/employees');
    if (res.data?.employees && Array.isArray(res.data.employees)) {
      return { data: res.data.employees.map(normalizeEmployee) };
    }
    return { data: [] };
  },

  getEmployee: async (id) => {
    const res = await apiClient.get(`/employees/${id}`);
    if (res.data?.employee) {
      return { data: normalizeEmployee(res.data.employee) };
    }
    throw new Error('Employee not found');
  },

  createEmployee: async (empData) => {
    const payload = {
      first_name: empData.firstName || empData.name?.split(' ')[0] || 'Employee',
      last_name: empData.lastName || empData.name?.split(' ').slice(1).join(' ') || '',
      email: empData.email,
      phone: empData.phone,
      department: empData.department,
      designation: empData.position || empData.designation,
      joining_date: empData.joinDate || new Date().toISOString().slice(0, 10),
      status: (empData.status || 'active').toLowerCase(),
    };
    const res = await apiClient.post('/employees', payload);
    return { data: { ...empData, id: res.data.employee_id } };
  },

  updateEmployee: async (id, empData) => {
    const payload = {
      first_name: empData.firstName || empData.name?.split(' ')[0],
      last_name: empData.lastName || empData.name?.split(' ').slice(1).join(' '),
      email: empData.email,
      phone: empData.phone,
      department: empData.department,
      designation: empData.position || empData.designation,
      status: empData.status?.toLowerCase(),
    };
    await apiClient.put(`/employees/${id}`, payload);
    return { data: { ...empData, id } };
  },

  deleteEmployee: async (id) => {
    await apiClient.delete(`/employees/${id}`);
    return { data: { success: true } };
  }
};
