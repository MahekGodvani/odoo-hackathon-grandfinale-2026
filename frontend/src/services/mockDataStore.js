/**
 * PEOPLEPAY360 - CENTRAL MOCK DATA STORE SERVICE
 * 
 * For HTML/JS Developers:
 * Think of this file as a lightweight, in-browser database simulated using JavaScript objects
 * and browser `localStorage`. When the app loads, it initializes with realistic sample HR & Payroll data.
 * Any CRUD operation (Create, Read, Update, Delete) done in the UI updates this store, so changes
 * immediately reflect across all pages (Dashboard, Employee Hub, Payruns, Payslips).
 */

const STORAGE_KEY = 'peoplepay360_db_v1';

// Initial realistic HR and Payroll mock dataset for Hackathon demonstration
const initialData = {
  departments: ['Engineering', 'Sales', 'Human Resources', 'Finance'],
  
  users: [
    { id: 'usr-1', name: 'Rahul Patel', email: 'rahul.patel@peoplepay360.com', role: 'HR Payroll Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 'usr-2', name: 'Amit Shah', email: 'amit.shah@peoplepay360.com', role: 'HR Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'usr-3', name: 'Neha Patel', email: 'neha.patel@peoplepay360.com', role: 'HR Payroll User', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'usr-4', name: 'Priya Shah', email: 'priya.shah@peoplepay360.com', role: 'Employee', status: 'Active', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 'usr-5', name: 'Karan Mehta', email: 'karan.mehta@peoplepay360.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  ],

  schedules: [
    {
      id: 'sch-1',
      name: 'Standard Full-Time (40h)',
      type: 'Full-time',
      weeklyHours: 40,
      status: 'Active',
      pattern: {
        Monday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
        Tuesday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
        Wednesday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
        Thursday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
        Friday: { active: true, start: '09:00', end: '18:00', breakMinutes: 60 },
        Saturday: { active: false, start: '', end: '', breakMinutes: 0 },
        Sunday: { active: false, start: '', end: '', breakMinutes: 0 },
      }
    },
    {
      id: 'sch-2',
      name: 'Engineering Shift (40h)',
      type: 'Shift',
      weeklyHours: 40,
      status: 'Active',
      pattern: {
        Monday: { active: true, start: '10:00', end: '19:00', breakMinutes: 60 },
        Tuesday: { active: true, start: '10:00', end: '19:00', breakMinutes: 60 },
        Wednesday: { active: true, start: '10:00', end: '19:00', breakMinutes: 60 },
        Thursday: { active: true, start: '10:00', end: '19:00', breakMinutes: 60 },
        Friday: { active: true, start: '10:00', end: '19:00', breakMinutes: 60 },
        Saturday: { active: false, start: '', end: '', breakMinutes: 0 },
        Sunday: { active: false, start: '', end: '', breakMinutes: 0 },
      }
    },
    {
      id: 'sch-3',
      name: 'Part-Time Morning (20h)',
      type: 'Part-time',
      weeklyHours: 20,
      status: 'Active',
      pattern: {
        Monday: { active: true, start: '09:00', end: '13:00', breakMinutes: 0 },
        Tuesday: { active: true, start: '09:00', end: '13:00', breakMinutes: 0 },
        Wednesday: { active: true, start: '09:00', end: '13:00', breakMinutes: 0 },
        Thursday: { active: true, start: '09:00', end: '13:00', breakMinutes: 0 },
        Friday: { active: true, start: '09:00', end: '13:00', breakMinutes: 0 },
        Saturday: { active: false, start: '', end: '', breakMinutes: 0 },
        Sunday: { active: false, start: '', end: '', breakMinutes: 0 },
      }
    }
  ],

  salaryStructures: [
    {
      id: 'struct-1',
      name: 'Standard Regular Structure',
      description: 'Standard compensation structure for full-time employees including HRA & TA',
      employeeCount: 12,
      status: 'Active',
      ruleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4', 'rule-5']
    },
    {
      id: 'struct-2',
      name: 'Executive Leadership Structure',
      description: 'Specialized structure for department leads and senior management',
      employeeCount: 3,
      status: 'Active',
      ruleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4', 'rule-6', 'rule-5']
    }
  ],

  salaryRules: [
    { id: 'rule-1', name: 'Basic Salary', code: 'BASIC', category: 'Basic', sequence: 1, calculationType: 'Fixed Amount', value: 40000, baseRule: '', status: 'Active' },
    { id: 'rule-2', name: 'House Rent Allowance', code: 'HRA', category: 'Allowance', sequence: 2, calculationType: 'Percentage', value: 20, baseRule: 'BASIC', status: 'Active' },
    { id: 'rule-3', name: 'Transport Allowance', code: 'TA', category: 'Allowance', sequence: 3, calculationType: 'Fixed Amount', value: 3000, baseRule: '', status: 'Active' },
    { id: 'rule-4', name: 'Provident Fund', code: 'PF', category: 'Deduction', sequence: 4, calculationType: 'Percentage', value: 12, baseRule: 'BASIC', status: 'Active' },
    { id: 'rule-5', name: 'Net Salary', code: 'NET', category: 'Net', sequence: 99, calculationType: 'Formula', value: 0, baseRule: 'GROSS - DEDUCTION', status: 'Active' },
    { id: 'rule-6', name: 'Performance Bonus', code: 'BONUS', category: 'Allowance', sequence: 5, calculationType: 'Fixed Amount', value: 5000, baseRule: '', status: 'Active' }
  ],

  employees: [
    { id: 'EMP-101', name: 'Rahul Patel', email: 'rahul.patel@peoplepay360.com', phone: '+91 98765 43210', department: 'Finance', position: 'Lead Payroll Accountant', manager: 'Karan Mehta', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2022-01-15', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bankDetails: { bank: 'HDFC Bank', accountNo: '501002938410', ifsc: 'HDFC0001234' } },
    { id: 'EMP-102', name: 'Amit Shah', email: 'amit.shah@peoplepay360.com', phone: '+91 98765 43211', department: 'Human Resources', position: 'HR Manager', manager: 'Karan Mehta', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2021-06-10', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bankDetails: null }, // Trigger warning for missing bank details
    { id: 'EMP-103', name: 'Neha Patel', email: 'neha.patel@peoplepay360.com', phone: '+91 98765 43212', department: 'Human Resources', position: 'Payroll Specialist', manager: 'Amit Shah', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2023-02-01', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bankDetails: { bank: 'ICICI Bank', accountNo: '000401582910', ifsc: 'ICIC0000004' } },
    { id: 'EMP-104', name: 'Priya Shah', email: 'priya.shah@peoplepay360.com', phone: '+91 98765 43213', department: 'Engineering', position: 'Senior Frontend Engineer', manager: 'Vikram Verma', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'Active', type: 'Full-time', joinDate: '2022-08-20', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', bankDetails: { bank: 'Axis Bank', accountNo: '918020048192', ifsc: 'UTIB0000100' } },
    { id: 'EMP-105', name: 'Karan Mehta', email: 'karan.mehta@peoplepay360.com', phone: '+91 98765 43214', department: 'Engineering', position: 'VP of Engineering', manager: 'Board', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'Active', type: 'Full-time', joinDate: '2020-03-15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bankDetails: { bank: 'SBI', accountNo: '30948192831', ifsc: 'SBIN0001234' } },
    { id: 'EMP-106', name: 'Vikram Verma', email: 'vikram.verma@peoplepay360.com', phone: '+91 98765 43215', department: 'Engineering', position: 'Tech Lead', manager: 'Karan Mehta', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'Active', type: 'Full-time', joinDate: '2021-11-01', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bankDetails: { bank: 'HDFC Bank', accountNo: '501009988112', ifsc: 'HDFC0001234' } },
    { id: 'EMP-107', name: 'Ananya Roy', email: 'ananya.roy@peoplepay360.com', phone: '+91 98765 43216', department: 'Sales', position: 'Sales Director', manager: 'Karan Mehta', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2021-04-12', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', bankDetails: { bank: 'Kotak Mahindra', accountNo: '8812948102', ifsc: 'KKBK0000456' } },
    { id: 'EMP-108', name: 'Sanya Kapoor', email: 'sanya.kapoor@peoplepay360.com', phone: '+91 98765 43217', department: 'Sales', position: 'Account Executive', manager: 'Ananya Roy', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2023-05-18', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bankDetails: { bank: 'ICICI Bank', accountNo: '000401928301', ifsc: 'ICIC0000004' } },
    { id: 'EMP-109', name: 'Rohan Joshi', email: 'rohan.joshi@peoplepay360.com', phone: '+91 98765 43218', department: 'Engineering', position: 'Backend Developer', manager: 'Vikram Verma', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'Active', type: 'Full-time', joinDate: '2023-01-10', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', bankDetails: { bank: 'HDFC Bank', accountNo: '501004928192', ifsc: 'HDFC0001234' } },
    { id: 'EMP-110', name: 'Devendra Singh', email: 'devendra.singh@peoplepay360.com', phone: '+91 98765 43219', department: 'Finance', position: 'Senior Financial Analyst', manager: 'Rahul Patel', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2022-09-01', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', bankDetails: { bank: 'SBI', accountNo: '20194829102', ifsc: 'SBIN0001234' } },
    { id: 'EMP-111', name: 'Meera Nair', email: 'meera.nair@peoplepay360.com', phone: '+91 98765 43220', department: 'Human Resources', position: 'Talent Acquisition', manager: 'Amit Shah', scheduleId: 'sch-3', scheduleName: 'Part-Time Morning (20h)', status: 'Active', type: 'Part-time', joinDate: '2023-07-01', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', bankDetails: { bank: 'Axis Bank', accountNo: '918020948102', ifsc: 'UTIB0000100' } },
    { id: 'EMP-112', name: 'Suresh Kumar', email: 'suresh.kumar@peoplepay360.com', phone: '+91 98765 43221', department: 'Sales', position: 'Sales Associate', manager: 'Ananya Roy', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2023-08-15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bankDetails: { bank: 'HDFC Bank', accountNo: '501008839201', ifsc: 'HDFC0001234' } },
    { id: 'EMP-113', name: 'Pooja Gupta', email: 'pooja.gupta@peoplepay360.com', phone: '+91 98765 43222', department: 'Engineering', position: 'QA Engineer', manager: 'Vikram Verma', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'Active', type: 'Full-time', joinDate: '2023-03-20', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bankDetails: { bank: 'ICICI Bank', accountNo: '000401829301', ifsc: 'ICIC0000004' } },
    { id: 'EMP-114', name: 'Arjun Rao', email: 'arjun.rao@peoplepay360.com', phone: '+91 98765 43223', department: 'Sales', position: 'Regional Sales Lead', manager: 'Ananya Roy', scheduleId: 'sch-1', scheduleName: 'Standard Full-Time (40h)', status: 'Active', type: 'Full-time', joinDate: '2022-04-05', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bankDetails: { bank: 'Kotak Mahindra', accountNo: '8812049182', ifsc: 'KKBK0000456' } },
    { id: 'EMP-115', name: 'Rajesh Sharma', email: 'rajesh.sharma@peoplepay360.com', phone: '+91 98765 43224', department: 'Engineering', position: 'DevOps Engineer', manager: 'Vikram Verma', scheduleId: 'sch-2', scheduleName: 'Engineering Shift (40h)', status: 'On Leave', type: 'Full-time', joinDate: '2022-10-10', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', bankDetails: { bank: 'SBI', accountNo: '30192840192', ifsc: 'SBIN0001234' } },
  ],

  contracts: [
    { id: 'CTR-2026-01', employeeId: 'EMP-101', employeeName: 'Rahul Patel', startDate: '2026-01-01', endDate: '2026-12-31', wage: 55000, department: 'Finance', position: 'Lead Payroll Accountant', structureId: 'struct-2', structureName: 'Executive Leadership Structure', status: 'Active' },
    { id: 'CTR-2026-02', employeeId: 'EMP-102', employeeName: 'Amit Shah', startDate: '2026-01-01', endDate: '2026-12-31', wage: 60000, department: 'Human Resources', position: 'HR Manager', structureId: 'struct-2', structureName: 'Executive Leadership Structure', status: 'Active' },
    { id: 'CTR-2026-03', employeeId: 'EMP-103', employeeName: 'Neha Patel', startDate: '2026-01-01', endDate: '2026-12-31', wage: 42000, department: 'Human Resources', position: 'Payroll Specialist', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-04', employeeId: 'EMP-104', employeeName: 'Priya Shah', startDate: '2026-01-01', endDate: '2026-12-31', wage: 50000, department: 'Engineering', position: 'Senior Frontend Engineer', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-05', employeeId: 'EMP-105', employeeName: 'Karan Mehta', startDate: '2026-01-01', endDate: '2026-12-31', wage: 90000, department: 'Engineering', position: 'VP of Engineering', structureId: 'struct-2', structureName: 'Executive Leadership Structure', status: 'Active' },
    { id: 'CTR-2026-06', employeeId: 'EMP-106', employeeName: 'Vikram Verma', startDate: '2026-01-01', endDate: '2026-12-31', wage: 65000, department: 'Engineering', position: 'Tech Lead', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-07', employeeId: 'EMP-107', employeeName: 'Ananya Roy', startDate: '2026-01-01', endDate: '2026-12-31', wage: 70000, department: 'Sales', position: 'Sales Director', structureId: 'struct-2', structureName: 'Executive Leadership Structure', status: 'Active' },
    { id: 'CTR-2026-08', employeeId: 'EMP-108', employeeName: 'Sanya Kapoor', startDate: '2026-01-01', endDate: '2026-12-31', wage: 38000, department: 'Sales', position: 'Account Executive', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-09', employeeId: 'EMP-109', employeeName: 'Rohan Joshi', startDate: '2026-01-01', endDate: '2026-12-31', wage: 45000, department: 'Engineering', position: 'Backend Developer', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-10', employeeId: 'EMP-110', employeeName: 'Devendra Singh', startDate: '2026-01-01', endDate: '2026-12-31', wage: 48000, department: 'Finance', position: 'Senior Financial Analyst', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-11', employeeId: 'EMP-111', employeeName: 'Meera Nair', startDate: '2026-01-01', endDate: '2026-12-31', wage: 25000, department: 'Human Resources', position: 'Talent Acquisition', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-12', employeeId: 'EMP-112', employeeName: 'Suresh Kumar', startDate: '2026-01-01', endDate: '2026-12-31', wage: 35000, department: 'Sales', position: 'Sales Associate', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-13', employeeId: 'EMP-113', employeeName: 'Pooja Gupta', startDate: '2026-01-01', endDate: '2026-12-31', wage: 40000, department: 'Engineering', position: 'QA Engineer', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-14', employeeId: 'EMP-114', employeeName: 'Arjun Rao', startDate: '2026-01-01', endDate: '2026-12-31', wage: 52000, department: 'Sales', position: 'Regional Sales Lead', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
    { id: 'CTR-2026-15', employeeId: 'EMP-115', employeeName: 'Rajesh Sharma', startDate: '2026-01-01', endDate: '2026-12-31', wage: 48000, department: 'Engineering', position: 'DevOps Engineer', structureId: 'struct-1', structureName: 'Standard Regular Structure', status: 'Active' },
  ],

  attendance: [
    { id: 'ATT-001', employeeId: 'EMP-101', employeeName: 'Rahul Patel', date: '2026-08-25', checkIn: '09:00', checkOut: '18:00', workedHours: 8.0, status: 'Present', notes: 'Regular work day' },
    { id: 'ATT-002', employeeId: 'EMP-101', employeeName: 'Rahul Patel', date: '2026-08-24', checkIn: '09:15', checkOut: '18:00', workedHours: 7.75, status: 'Late', notes: 'Traffic delay' },
    { id: 'ATT-003', employeeId: 'EMP-102', employeeName: 'Amit Shah', date: '2026-08-25', checkIn: '08:55', checkOut: '18:30', workedHours: 8.5, status: 'Overtime', notes: 'Interview loops' },
    { id: 'ATT-004', employeeId: 'EMP-103', employeeName: 'Neha Patel', date: '2026-08-25', checkIn: '09:05', checkOut: '18:00', workedHours: 8.0, status: 'Present', notes: '' },
    { id: 'ATT-005', employeeId: 'EMP-104', employeeName: 'Priya Shah', date: '2026-08-25', checkIn: '10:00', checkOut: '19:00', workedHours: 8.0, status: 'Present', notes: 'Sprint delivery' },
    { id: 'ATT-006', employeeId: 'EMP-105', employeeName: 'Karan Mehta', date: '2026-08-25', checkIn: '09:30', checkOut: '20:00', workedHours: 9.5, status: 'Overtime', notes: 'Architecture review' },
    { id: 'ATT-007', employeeId: 'EMP-106', employeeName: 'Vikram Verma', date: '2026-08-25', checkIn: '10:10', checkOut: '19:00', workedHours: 7.8, status: 'Late', notes: '' },
    { id: 'ATT-008', employeeId: 'EMP-107', employeeName: 'Ananya Roy', date: '2026-08-25', checkIn: '09:00', checkOut: '', workedHours: 0, status: 'Missing Checkout', notes: 'Client meeting outside' },
    { id: 'ATT-009', employeeId: 'EMP-108', employeeName: 'Sanya Kapoor', date: '2026-08-25', checkIn: '09:00', checkOut: '18:00', workedHours: 8.0, status: 'Present', notes: '' },
    { id: 'ATT-010', employeeId: 'EMP-109', employeeName: 'Rohan Joshi', date: '2026-08-25', checkIn: '', checkOut: '', workedHours: 0, status: 'Absent', notes: 'Unannounced' },
    { id: 'ATT-011', employeeId: 'EMP-115', employeeName: 'Rajesh Sharma', date: '2026-08-25', checkIn: '', checkOut: '', workedHours: 0, status: 'Absent', notes: 'On Approved Sick Leave' },
  ],

  timeOffTypes: [
    { id: 'tot-1', name: 'Paid Vacation Leave', unit: 'Days', requiresApproval: true, requiresAllocation: true, payrollIntegration: true, status: 'Active' },
    { id: 'tot-2', name: 'Sick Leave', unit: 'Days', requiresApproval: true, requiresAllocation: true, payrollIntegration: true, status: 'Active' },
    { id: 'tot-3', name: 'Casual Leave', unit: 'Days', requiresApproval: true, requiresAllocation: true, payrollIntegration: true, status: 'Active' },
    { id: 'tot-4', name: 'Unpaid Leave (LWP)', unit: 'Days', requiresApproval: true, requiresAllocation: false, payrollIntegration: true, status: 'Active' },
  ],

  allocations: [
    { id: 'alloc-1', employeeId: 'EMP-101', employeeName: 'Rahul Patel', typeId: 'tot-1', typeName: 'Paid Vacation Leave', allocated: 15, taken: 3, remaining: 12, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
    { id: 'alloc-2', employeeId: 'EMP-101', employeeName: 'Rahul Patel', typeId: 'tot-2', typeName: 'Sick Leave', allocated: 10, taken: 2, remaining: 8, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
    { id: 'alloc-3', employeeId: 'EMP-104', employeeName: 'Priya Shah', typeId: 'tot-1', typeName: 'Paid Vacation Leave', allocated: 15, taken: 5, remaining: 10, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
    { id: 'alloc-4', employeeId: 'EMP-104', employeeName: 'Priya Shah', typeId: 'tot-2', typeName: 'Sick Leave', allocated: 10, taken: 1, remaining: 9, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
    { id: 'alloc-5', employeeId: 'EMP-115', employeeName: 'Rajesh Sharma', typeId: 'tot-2', typeName: 'Sick Leave', allocated: 10, taken: 4, remaining: 6, validFrom: '2026-01-01', validTo: '2026-12-31', status: 'Active' },
  ],

  timeOffRequests: [
    { id: 'TOR-101', employeeId: 'EMP-101', employeeName: 'Rahul Patel', typeId: 'tot-1', typeName: 'Paid Vacation Leave', startDate: '2026-08-10', endDate: '2026-08-12', duration: 3, reason: 'Family trip', status: 'Approved', balanceBefore: 15, balanceRemaining: 12 },
    { id: 'TOR-102', employeeId: 'EMP-104', employeeName: 'Priya Shah', typeId: 'tot-1', typeName: 'Paid Vacation Leave', startDate: '2026-08-18', endDate: '2026-08-20', duration: 3, reason: 'Personal work', status: 'Approved', balanceBefore: 13, balanceRemaining: 10 },
    { id: 'TOR-103', employeeId: 'EMP-115', employeeName: 'Rajesh Sharma', typeId: 'tot-2', typeName: 'Sick Leave', startDate: '2026-08-24', endDate: '2026-08-26', duration: 3, reason: 'Viral fever rest', status: 'Pending', balanceBefore: 6, balanceRemaining: 3 },
    { id: 'TOR-104', employeeId: 'EMP-103', employeeName: 'Neha Patel', typeId: 'tot-3', typeName: 'Casual Leave', startDate: '2026-09-02', endDate: '2026-09-02', duration: 1, reason: 'Doctor appointment', status: 'Pending', balanceBefore: 8, balanceRemaining: 7 },
  ],

  payruns: [
    {
      id: 'PR-2026-07',
      name: 'July 2026 Regular Payrun',
      period: 'July 2026',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      structureId: 'struct-1',
      structureName: 'Standard Regular Structure',
      totalEmployees: 15,
      totalGross: 765000,
      totalDeductions: 72000,
      totalNet: 693000,
      status: 'Paid',
      createdDate: '2026-07-28'
    }
  ],

  payslips: [
    {
      id: 'PS-2026-07-101',
      payrunId: 'PR-2026-07',
      employeeId: 'EMP-101',
      employeeName: 'Rahul Patel',
      department: 'Finance',
      position: 'Lead Payroll Accountant',
      period: 'July 2026',
      structureName: 'Executive Leadership Structure',
      workedDays: 22,
      paidDays: 22,
      leaveDays: 0,
      basic: 40000,
      hra: 8000,
      ta: 3000,
      gross: 51000,
      pf: 4800,
      totalDeductions: 4800,
      net: 46200,
      status: 'Paid',
      paymentDate: '2026-07-31',
      lines: [
        { code: 'BASIC', name: 'Basic Salary', category: 'Basic', amount: 40000 },
        { code: 'HRA', name: 'House Rent Allowance (20%)', category: 'Allowance', amount: 8000 },
        { code: 'TA', name: 'Transport Allowance', category: 'Allowance', amount: 3000 },
        { code: 'PF', name: 'Provident Fund (12%)', category: 'Deduction', amount: 4800 },
      ]
    },
    {
      id: 'PS-2026-07-104',
      payrunId: 'PR-2026-07',
      employeeId: 'EMP-104',
      employeeName: 'Priya Shah',
      department: 'Engineering',
      position: 'Senior Frontend Engineer',
      period: 'July 2026',
      structureName: 'Standard Regular Structure',
      workedDays: 22,
      paidDays: 22,
      leaveDays: 0,
      basic: 40000,
      hra: 8000,
      ta: 3000,
      gross: 51000,
      pf: 4800,
      totalDeductions: 4800,
      net: 46200,
      status: 'Paid',
      paymentDate: '2026-07-31',
      lines: [
        { code: 'BASIC', name: 'Basic Salary', category: 'Basic', amount: 40000 },
        { code: 'HRA', name: 'House Rent Allowance (20%)', category: 'Allowance', amount: 8000 },
        { code: 'TA', name: 'Transport Allowance', category: 'Allowance', amount: 3000 },
        { code: 'PF', name: 'Provident Fund (12%)', category: 'Deduction', amount: 4800 },
      ]
    }
  ]
};

// Initialize LocalStorage if empty
function loadFromStorage() {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(dataStr);
  } catch (err) {
    console.error('Error reading mock data from storage', err);
    return initialData;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving mock data to storage', err);
  }
}

// Reactive store object for API service calls
export const mockDataStore = {
  get: () => loadFromStorage(),
  save: (data) => saveToStorage(data),
  
  // Helper to reset store to fresh demo state if needed
  reset: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
};
