import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import Tabs from '../../components/common/Tabs';
import { useAuth, ROLES } from '../../context/AuthContext';
import { timeOffApi } from '../../api/timeOffApi';
import { employeeApi } from '../../api/employeeApi';
import { Plus, Check, X, Info, Briefcase, FileText, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * PEOPLEPAY360 - TIME OFF REQUESTS & APPROVALS PAGE
 * Displays leave requests with HR approval modal featuring Balance Before → Deducted → Remaining preview.
 */
const TimeOffRequestsPage = () => {
  const { user, role, hasPermission } = useAuth();
  const [requests, setRequests] = useState([]);
  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  // Approval Modal State
  const [selectedReq, setSelectedReq] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    typeId: 'tot-1',
    startDate: '2026-09-01',
    endDate: '2026-09-03',
    duration: 3,
    reason: 'Personal leave',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, typeRes, empRes] = await Promise.all([
        timeOffApi.getTimeOffRequests(),
        timeOffApi.getTimeOffTypes(),
        employeeApi.getEmployees(),
      ]);
      setRequests(reqRes?.data || []);
      setTypes(typeRes?.data || []);
      setEmployees(empRes?.data || []);
    } catch (err) {
      console.error('Error fetching time off data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user]);

  const handleOpenCreate = () => {
    const currentEmp = employees.find(e => String(e.rawId) === String(user?.employee_id) || String(e.id) === String(user?.employee_id)) || employees[0];
    const initialEmpId = currentEmp ? currentEmp.id : (user?.employee_id ? String(user.employee_id) : '');
    const initialTypeId = types[0]?.id ? String(types[0].id) : '';

    setFormData({
      employeeId: initialEmpId,
      typeId: initialTypeId,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      duration: 1,
      reason: 'Personal leave',
    });
    setIsRequestModalOpen(true);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      setToastMessage('Please select an employee.');
      return;
    }
    setIsSubmitting(true);
    try {
      const emp = employees.find((x) => String(x.id) === String(formData.employeeId) || String(x.rawId) === String(formData.employeeId));
      const selectedType = types.find((t) => String(t.id) === String(formData.typeId));

      const payload = {
        employeeId: emp?.rawId || emp?.id || formData.employeeId,
        leaveType: selectedType ? selectedType.name : 'Casual',
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: Number(formData.duration) || 1,
        reason: formData.reason,
        employeeName: emp ? emp.name : 'Employee',
        typeName: selectedType ? selectedType.name : 'Casual Leave',
      };

      await timeOffApi.createTimeOffRequest(payload);
      setToastMessage('Time off request submitted successfully.');
      setIsRequestModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error submitting request', err);
      setToastMessage(err?.response?.data?.message || 'Failed to submit time off request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedReq) return;
    setIsSubmitting(true);
    try {
      await timeOffApi.approveRequest(selectedReq.id);
      setToastMessage(`Request #${selectedReq.id} Approved! Leave balance updated.`);
      setSelectedReq(null);
      fetchData();
    } catch (err) {
      console.error('Approve error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefuse = async () => {
    if (!selectedReq) return;
    setIsSubmitting(true);
    try {
      await timeOffApi.refuseRequest(selectedReq.id);
      setToastMessage(`Request #${selectedReq.id} Refused.`);
      setSelectedReq(null);
      fetchData();
    } catch (err) {
      console.error('Refuse error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Time Off Requests..." />;

  const isHR = hasPermission([ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN]);

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-800">{r.employeeName}</p>
          <span className="font-mono text-[11px] text-slate-400">{r.employeeId}</span>
        </div>
      )
    },
    { header: 'Leave Type', accessor: 'typeName' },
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (r) => <span className="font-bold text-indigo-700">{r.duration} Days</span>
    },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Reason', accessor: 'reason' },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center space-x-2">
          {r.status === 'Pending' && isHR ? (
            <button
              onClick={() => setSelectedReq(r)}
              className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
            >
              Review & Approve
            </button>
          ) : (
            <button
              onClick={() => setSelectedReq(r)}
              className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs"
            >
              View Detail
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Off Requests & Approvals"
        subtitle="Manage employee leave requests, approval flows, and leave balance deductions."
        breadcrumbs={[{ label: 'Time Off Requests' }]}
        actions={
          <div className="flex items-center space-x-3">
            <Link to="/time-off/allocations" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-2 bg-white rounded-lg border border-slate-200">
              Allocations Bar →
            </Link>
            <Link to="/time-off/types" className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-2 bg-white rounded-lg border border-slate-200">
              Leave Types →
            </Link>
            <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
              Submit Time Off Request
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={requests}
        searchPlaceholder="Search leave requests by employee..."
        searchField="employeeName"
      />

      {/* CREATE TIME OFF REQUEST MODAL */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="New Time Off Request"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <Select
            label="Employee"
            name="employeeId"
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={employees.map((e) => ({
              value: e.id,
              label: `${e.name} (${e.code || e.employee_code || `EMP-${e.id}`} - ${e.department || 'Staff'})`
            }))}
            disabled={role === ROLES.EMPLOYEE && employees.length === 1}
          />

          <Select
            label="Leave Type"
            name="typeId"
            required
            value={formData.typeId}
            onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
            options={types.map((t) => ({ value: t.id, label: `${t.name} (${t.unit || 'Days'})` }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <Input
            label="Duration (Days)"
            type="number"
            required
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <Input
            label="Reason"
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="e.g. Doctor appointment / Family vacation"
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsRequestModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>

      {/* HR LEAVE APPROVAL MODAL SHOWING BALANCE BEFORE / DEDUCTION / REMAINING PREVIEW */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Review Leave Request #${selectedReq?.id}`}
      >
        {selectedReq && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Employee</span>
                <span className="font-bold text-slate-800 text-sm">{selectedReq.employeeName} ({selectedReq.employeeId})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Leave Type</span>
                <span className="font-semibold text-slate-700">{selectedReq.typeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Date Range</span>
                <span className="font-semibold text-slate-700">{selectedReq.startDate} to {selectedReq.endDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Reason</span>
                <span className="font-medium text-slate-600">{selectedReq.reason}</span>
              </div>
            </div>

            {/* BALANCE IMPACT PREVIEW PANEL (IMPORTANT REQUIREMENT) */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
              <p className="font-bold text-indigo-900 text-xs uppercase tracking-wider mb-2">
                Leave Balance Deduction Preview
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg border border-indigo-100">
                  <p className="text-[10px] text-slate-500 font-semibold uppercase">Balance Before</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{selectedReq.balanceBefore || 12} Days</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-rose-100">
                  <p className="text-[10px] text-rose-600 font-semibold uppercase">Deducted</p>
                  <p className="text-base font-bold text-rose-700 mt-0.5">-{selectedReq.duration} Days</p>
                </div>
                <div className="p-2 bg-white rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase">Balance Remaining</p>
                  <p className="text-base font-bold text-emerald-700 mt-0.5">{selectedReq.balanceRemaining || 9} Days</p>
                </div>
              </div>
            </div>

            {selectedReq.status === 'Pending' && isHR ? (
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <Button variant="danger" icon={X} onClick={handleRefuse} isLoading={isSubmitting}>
                  Refuse Request
                </Button>
                <Button variant="success" icon={Check} onClick={handleApprove} isLoading={isSubmitting}>
                  Approve Request
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <StatusBadge status={selectedReq.status} />
                <Button variant="secondary" onClick={() => setSelectedReq(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default TimeOffRequestsPage;
