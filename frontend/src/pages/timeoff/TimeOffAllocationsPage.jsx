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
import { timeOffApi } from '../../api/timeOffApi';
import { employeeApi } from '../../api/employeeApi';
import { Plus, Briefcase } from 'lucide-react';

/**
 * PEOPLEPAY360 - TIME OFF ALLOCATIONS PAGE
 * Features visual balance indicators (Allocated vs Taken vs Remaining).
 */
const TimeOffAllocationsPage = () => {
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    typeId: 'tot-1',
    allocated: 15,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allocRes, empRes, typeRes] = await Promise.all([
        timeOffApi.getAllocations(),
        employeeApi.getEmployees(),
        timeOffApi.getTimeOffTypes(),
      ]);
      setAllocations(allocRes.data);
      setEmployees(empRes.data);
      setTypes(typeRes.data);
    } catch (err) {
      console.error('Error fetching allocations data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    if (employees.length > 0) {
      setFormData({
        employeeId: employees[0].id,
        typeId: types[0]?.id || 'tot-1',
        allocated: 15,
        validFrom: '2026-01-01',
        validTo: '2026-12-31',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const emp = employees.find((x) => x.id === formData.employeeId);
      const selectedType = types.find((t) => t.id === formData.typeId);

      const payload = {
        ...formData,
        employeeName: emp ? emp.name : 'Employee',
        typeName: selectedType ? selectedType.name : 'Paid Vacation Leave',
        allocated: Number(formData.allocated),
      };

      await timeOffApi.createAllocation(payload);
      setToastMessage('New leave allocation assigned');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving allocation', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Leave Allocations..." />;

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
    { header: 'Time Off Type', accessor: 'typeName' },
    {
      header: 'Visual Balance (Allocated / Taken / Remaining)',
      accessor: 'remaining',
      render: (r) => (
        <div className="w-64 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Allocated: {r.allocated}</span>
            <span className="text-amber-600">Taken: {r.taken}</span>
            <span className="text-indigo-600 font-bold">Remaining: {r.remaining}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${Math.min(100, (r.taken / Math.max(1, r.allocated)) * 100)}%` }}
            />
          </div>
        </div>
      )
    },
    { header: 'Valid From', accessor: 'validFrom' },
    { header: 'Valid To', accessor: 'validTo' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Off Allocations"
        subtitle="Annual leave entitlements, balance tracking, and expiry periods."
        breadcrumbs={[{ label: 'Time Off Allocations' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            New Allocation
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={allocations}
        searchPlaceholder="Search allocations by employee..."
        searchField="employeeName"
      />

      {/* NEW ALLOCATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Leave Allocation"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={employees.map((e) => ({ value: e.id, label: `${e.name} (${e.id})` }))}
          />

          <Select
            label="Leave Type"
            required
            value={formData.typeId}
            onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
            options={types.map((t) => ({ value: t.id, label: t.name }))}
          />

          <Input
            label="Allocated Days"
            type="number"
            required
            value={formData.allocated}
            onChange={(e) => setFormData({ ...formData, allocated: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valid From"
              type="date"
              required
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            />
            <Input
              label="Valid To"
              type="date"
              required
              value={formData.validTo}
              onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Assign Allocation
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default TimeOffAllocationsPage;
