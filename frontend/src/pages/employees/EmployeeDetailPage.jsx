import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import { employeeApi } from '../../api/employeeApi';
import { contractApi } from '../../api/contractApi';
import { attendanceApi } from '../../api/attendanceApi';
import { timeOffApi } from '../../api/timeOffApi';
import { payslipApi } from '../../api/payslipApi';
import {
  User,
  FileText,
  Clock,
  Briefcase,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Building,
  CreditCard,
  Layers,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import EmployeeFormModal from './EmployeeFormModal';

/**
 * PEOPLEPAY360 - EMPLOYEE DETAIL OPERATIONAL HUB
 * Central hub tying together Employee → Contract → Schedule → Attendance → Time Off → Payslips.
 */
const EmployeeDetailPage = () => {
  const { id } = useParams();
  
  const [employee, setEmployee] = useState(null);
  const [contract, setContract] = useState(null);
  const [allContracts, setAllContracts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [payslips, setPayslips] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchHubData = async () => {
    setLoading(true);
    try {
      // Load Employee Profile
      const empRes = await employeeApi.getEmployee(id);
      setEmployee(empRes.data);

      // Load Active Contract
      const ctrRes = await contractApi.getContractByEmployee(id);
      setContract(ctrRes.data);

      // Load All Contracts for Employee
      const allCtrRes = await contractApi.getContracts();
      setAllContracts(allCtrRes.data.filter((c) => c.employeeId === id));

      // Load Attendance History
      const attRes = await attendanceApi.getAttendance({ employeeId: id });
      setAttendance(attRes.data);

      // Load Time Off Allocations & Requests
      const allocRes = await timeOffApi.getAllocations({ employeeId: id });
      setAllocations(allocRes.data);

      const torRes = await timeOffApi.getTimeOffRequests({ employeeId: id });
      setTimeOffRequests(torRes.data);

      // Load Payslips
      const psRes = await payslipApi.getPayslips({ employeeId: id });
      setPayslips(psRes.data);
    } catch (err) {
      console.error('Error loading employee hub data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, [id]);

  if (loading || !employee) return <LoadingSpinner label="Loading Operational Hub..." />;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contracts', label: 'Contracts', icon: FileText, count: allContracts.length },
    { id: 'attendance', label: 'Attendance Log', icon: Clock, count: attendance.length },
    { id: 'timeoff', label: 'Time Off & Balances', icon: Briefcase, count: timeOffRequests.length },
    { id: 'payroll', label: 'Payslips History', icon: DollarSign, count: payslips.length },
  ];

  return (
    <div className="space-y-6">
      {/* Back button link */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-indigo-600">
        <Link to="/employees" className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Employee Directory
        </Link>
      </div>

      {/* TOP HUB HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Avatar & Employee Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={employee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`}
              alt={employee.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`;
              }}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{employee.name}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">{employee.position}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span>ID: <strong className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{employee.code || employee.employee_code || (employee.rawId ? `EMP-${1000 + Number(employee.rawId)}` : employee.id)}</strong></span>
                <span>Dept: <strong className="text-slate-700">{employee.department}</strong></span>
                <span>Manager: <strong className="text-slate-700">{employee.manager || 'Karan Mehta'}</strong></span>
              </div>
            </div>
          </div>

          {/* SMART COUNTER BUTTONS FOR DIRECT WORKFLOW NAVIGATION */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('contracts')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Contracts</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">{allContracts.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Attendance</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">{attendance.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('timeoff')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Time Off</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">{timeOffRequests.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('payroll')}
              className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span>Payslips</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">{payslips.length}</span>
            </button>

            <Button variant="secondary" icon={Edit} size="sm" onClick={() => setIsEditOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PERSONAL INFORMATION */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Personal Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Full Name</p>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{employee.name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Email Address</p>
                <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</p>
                <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Employee ID</p>
                <p className="font-mono text-indigo-600 font-semibold mt-0.5">{employee.id}</p>
              </div>
            </div>
          </div>

          {/* WORK INFORMATION */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" /> Work Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Department</p>
                <p className="font-semibold text-slate-800 mt-0.5">{employee.department}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Position</p>
                <p className="font-medium text-slate-700 mt-0.5">{employee.position}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Manager</p>
                <p className="font-medium text-slate-700 mt-0.5">{employee.manager}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Joining Date</p>
                <p className="font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {employee.joinDate}
                </p>
              </div>
            </div>
          </div>

          {/* CURRENT EMPLOYMENT & SALARY CONNECTION */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" /> Active Contract & Payroll
            </h3>
            {contract ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-emerald-800">Active Contract</p>
                    <p className="font-bold text-emerald-950 text-sm mt-0.5">{contract.id}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">ACTIVE</span>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Monthly Contract Wage</p>
                  <p className="text-lg font-bold text-indigo-700 mt-0.5">₹{contract.wage?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Structure</p>
                  <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> {contract.structureName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Working Schedule</p>
                  <p className="font-medium text-slate-700 mt-0.5">{employee.scheduleName}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 mb-1" />
                <p className="font-bold">No Active Contract Assigned</p>
                <p className="text-[11px] mt-1">This employee requires an active contract for payrun generation.</p>
                <Link to="/contracts" className="font-bold underline text-amber-900 mt-2 block">
                  + Create Contract Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CONTRACTS */}
      {activeTab === 'contracts' && (
        <DataTable
          columns={[
            { header: 'Contract ID', accessor: 'id', render: (r) => <span className="font-mono text-xs font-bold text-slate-800">{r.id}</span> },
            { header: 'Start Date', accessor: 'startDate' },
            { header: 'End Date', accessor: 'endDate' },
            { header: 'Monthly Wage', accessor: 'wage', render: (r) => <span className="font-bold text-indigo-600">₹{r.wage?.toLocaleString()}</span> },
            { header: 'Salary Structure', accessor: 'structureName' },
            { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          data={allContracts}
        />
      )}

      {/* TAB CONTENT: ATTENDANCE LOG */}
      {activeTab === 'attendance' && (
        <DataTable
          columns={[
            { header: 'Date', accessor: 'date' },
            { header: 'Check In', accessor: 'checkIn' },
            { header: 'Check Out', accessor: 'checkOut', render: (r) => r.checkOut || '--:--' },
            { header: 'Worked Hours', accessor: 'workedHours', render: (r) => `${r.workedHours} hrs` },
            { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
            { header: 'Notes', accessor: 'notes' },
          ]}
          data={attendance}
        />
      )}

      {/* TAB CONTENT: TIME OFF */}
      {activeTab === 'timeoff' && (
        <div className="space-y-6">
          {/* Allocation balance cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allocations.map((alloc) => (
              <div key={alloc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <p className="text-xs font-bold text-slate-800 mb-2">{alloc.typeName}</p>
                <div className="flex items-center justify-between text-xs mb-1 text-slate-600">
                  <span>Allocated: {alloc.allocated}</span>
                  <span>Taken: {alloc.taken}</span>
                  <span className="font-bold text-indigo-600">Remaining: {alloc.remaining}</span>
                </div>
                {/* Visual balance bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, (alloc.taken / Math.max(1, alloc.allocated)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <DataTable
            columns={[
              { header: 'Request ID', accessor: 'id' },
              { header: 'Leave Type', accessor: 'typeName' },
              { header: 'Start Date', accessor: 'startDate' },
              { header: 'End Date', accessor: 'endDate' },
              { header: 'Duration', accessor: 'duration', render: (r) => `${r.duration} Days` },
              { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
              { header: 'Reason', accessor: 'reason' },
            ]}
            data={timeOffRequests}
          />
        </div>
      )}

      {/* TAB CONTENT: PAYSLIPS */}
      {activeTab === 'payroll' && (
        <DataTable
          columns={[
            { header: 'Payslip ID', accessor: 'id', render: (r) => <span className="font-mono text-xs font-bold text-slate-800">{r.id}</span> },
            { header: 'Period', accessor: 'period' },
            { header: 'Gross Salary', accessor: 'gross', render: (r) => `₹${r.gross?.toLocaleString()}` },
            { header: 'Deductions', accessor: 'totalDeductions', render: (r) => `₹${r.totalDeductions?.toLocaleString()}` },
            { header: 'Net Salary', accessor: 'net', render: (r) => <span className="font-bold text-emerald-600">₹{r.net?.toLocaleString()}</span> },
            { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
            {
              header: 'Actions',
              render: (r) => (
                <Link to={`/payroll/payslips/${r.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  Open Printable Payslip →
                </Link>
              )
            }
          ]}
          data={payslips}
        />
      )}

      {/* Edit Form Modal */}
      <EmployeeFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        employee={employee}
        onSuccess={() => {
          setIsEditOpen(false);
          fetchHubData();
        }}
      />
    </div>
  );
};

export default EmployeeDetailPage;
