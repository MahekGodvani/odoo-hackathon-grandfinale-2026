import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - EMPLOYEE API SERVICE
 * Connects directly to backend /api/employees with fallback support.
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
    department: emp.department || 'Engineering',
    position: emp.designation || emp.position || 'Software Engineer',
    designation: emp.designation || emp.position || 'Software Engineer',
    manager: emp.manager || 'Karan Mehta',
    scheduleName: emp.scheduleName || 'Standard Full-Time (40h)',
    status: (emp.status === 'active' || emp.status === 'Active') ? 'Active' : (emp.status || 'Active'),
    type: emp.type || (emp.contract_type === 'part_time' ? 'Part-time' : emp.contract_type === 'contract' ? 'Contract' : 'Full-time'),
    joinDate: emp.joining_date ? String(emp.joining_date).slice(0, 10) : emp.joinDate || '2025-01-01',

    avatar: getAvatarUrl(fullName, emp.id),
    wage: emp.wage || emp.base_salary || 5000,
    baseSalary: emp.base_salary || emp.wage || 5000,
    bankDetails: emp.bank_name ? {
      bankName: emp.bank_name,
      accountNo: emp.bank_account_no || emp.account_number,
      ifsc: emp.bank_ifsc_code || emp.ifsc_code
    } : emp.bankDetails
  };
};

export const employeeApi = {
  getEmployees: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/employees');
        if (res.data?.employees && Array.isArray(res.data.employees)) {
          const list = res.data.employees.map(normalizeEmployee);
          return { data: list };
        }
      } catch (err) {
        console.warn('Live getEmployees failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    return { data: db.employees };
  },

  getEmployee: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get(`/employees/${id}`);
        if (res.data?.employee) {
          return { data: normalizeEmployee(res.data.employee) };
        }
      } catch (err) {
        console.warn('Live getEmployee failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const emp = db.employees.find((e) => String(e.id) === String(id) || e.code === id);
    if (!emp) throw new Error('Employee not found');
    return { data: emp };
  },

  createEmployee: async (empData) => {
    if (!USE_MOCK_DATA) {
      try {
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
        if (res.data?.success) {
          return { data: { ...empData, id: res.data.employee_id } };
        }
      } catch (err) {
        console.warn('Live createEmployee failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const newId = `EMP-${100 + db.employees.length + 1}`;
    const newEmp = {
      id: newId,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      ...empData,
    };
    db.employees.unshift(newEmp);
    mockDataStore.save(db);
    return { data: newEmp };
  },

  updateEmployee: async (id, empData) => {
    if (!USE_MOCK_DATA) {
      try {
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
      } catch (err) {
        console.warn('Live updateEmployee failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    const idx = db.employees.findIndex((e) => String(e.id) === String(id));
    if (idx !== -1) {
      db.employees[idx] = { ...db.employees[idx], ...empData };
      mockDataStore.save(db);
      return { data: db.employees[idx] };
    }
    throw new Error('Employee not found');
  },

  deleteEmployee: async (id) => {
    if (!USE_MOCK_DATA) {
      try {
        await apiClient.delete(`/employees/${id}`);
        return { data: { success: true } };
      } catch (err) {
        console.warn('Live deleteEmployee failed, using fallback:', err?.message);
      }
    }
    const db = mockDataStore.get();
    db.employees = db.employees.filter((e) => String(e.id) !== String(id));
    mockDataStore.save(db);
    return { data: { success: true } };
  }
};
