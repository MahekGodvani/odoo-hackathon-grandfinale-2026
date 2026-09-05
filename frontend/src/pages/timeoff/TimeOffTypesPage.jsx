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
import { Plus, Check, X } from 'lucide-react';

/**
 * PEOPLEPAY360 - TIME OFF TYPES CONFIGURATION
 */
const TimeOffTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    unit: 'Days',
    requiresApproval: true,
    requiresAllocation: true,
    payrollIntegration: true,
  });

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const res = await timeOffApi.getTimeOffTypes();
      setTypes(res.data);
    } catch (err) {
      console.error('Error fetching time off types', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await timeOffApi.createTimeOffType(formData);
      setToastMessage('New Time Off Type created');
      setIsModalOpen(false);
      fetchTypes();
    } catch (err) {
      console.error('Error creating time off type', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Time Off Types..." />;

  const columns = [
    { header: 'Type Name', accessor: 'name', render: (r) => <span className="font-bold text-slate-800">{r.name}</span> },
    { header: 'Unit', accessor: 'unit' },
    {
      header: 'Approval Required',
      accessor: 'requiresApproval',
      render: (r) => (
        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${r.requiresApproval ? 'text-emerald-700' : 'text-slate-400'}`}>
          {r.requiresApproval ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}
          {r.requiresApproval ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Allocation Required',
      accessor: 'requiresAllocation',
      render: (r) => (
        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${r.requiresAllocation ? 'text-emerald-700' : 'text-slate-400'}`}>
          {r.requiresAllocation ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}
          {r.requiresAllocation ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Payroll Integration',
      accessor: 'payrollIntegration',
      render: (r) => (
        <span className={`inline-flex items-center gap-1 font-semibold text-xs ${r.payrollIntegration ? 'text-indigo-700' : 'text-slate-400'}`}>
          {r.payrollIntegration ? <Check className="w-4 h-4 text-indigo-600" /> : <X className="w-4 h-4" />}
          {r.payrollIntegration ? 'Integrated' : 'Standalone'}
        </span>
      )
    },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Time Off Types Setup"
        subtitle="Configure leave categories, units, approval requirements, and payroll deduction integration."
        breadcrumbs={[{ label: 'Time Off Types' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Leave Type
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={types}
        searchPlaceholder="Search leave types..."
        searchField="name"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Time Off Type"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Type Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Parental Leave"
          />

          <Select
            label="Unit of Measure"
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={['Days', 'Hours']}
          />

          <div className="space-y-3 pt-2 text-xs font-semibold text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Requires HR Approval</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requiresAllocation}
                onChange={(e) => setFormData({ ...formData, requiresAllocation: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Requires Prior Allocation</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payrollIntegration}
                onChange={(e) => setFormData({ ...formData, payrollIntegration: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Integrate with Payroll Calculations</span>
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Leave Type
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default TimeOffTypesPage;
