import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { payrollApi } from '../../api/payrollApi';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Plus, Layers, Sliders, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * PEOPLEPAY360 - SALARY STRUCTURES MODULE
 */
const SalaryStructuresPage = () => {
  const { role } = useAuth();
  const isReadOnly = role === ROLES.HR_PAYROLL_USER;

  const [structures, setStructures] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [structRes, ruleRes] = await Promise.all([
        payrollApi.getSalaryStructures(),
        payrollApi.getSalaryRules(),
      ]);
      setStructures(structRes.data);
      setRules(ruleRes.data);
    } catch (err) {
      console.error('Error fetching salary structures', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await payrollApi.createSalaryStructure(formData);
      setToastMessage('New Salary Structure created successfully');
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating structure', err);
      setToastMessage(err.response?.data?.message || err.message || 'Error creating salary structure');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Salary Structures..." />;

  const columns = [
    {
      header: 'Structure Name',
      accessor: 'name',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-800">{r.name}</p>
            <p className="text-xs text-slate-400">{r.description}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Attached Salary Rules',
      accessor: 'ruleIds',
      render: (r) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {r.ruleIds ? r.ruleIds.length : 5} Active Rules
        </span>
      )
    },
    { header: 'Assigned Employees', accessor: 'employeeCount', render: (r) => `${r.employeeCount} Employees` },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Structures"
        subtitle="Grouped compensation templates defining itemized salary calculation rule order."
        breadcrumbs={[{ label: 'Salary Structures' }]}
        actions={
          <div className="flex items-center space-x-3">
            <Link to="/payroll/salary-rules" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-2 bg-white rounded-lg border border-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Manage Salary Rules →
            </Link>
            {isReadOnly ? (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Read-Only Mode
              </span>
            ) : (
              <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
                New Structure
              </Button>
            )}
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={structures}
        searchPlaceholder="Search salary structures..."
        searchField="name"
      />

      {/* SAMPLE STRUCTURE DETAILED DISPLAY CARD FOR HACKATHON DEMO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Regular Salary Structure Sequence Preview</h3>
            <p className="text-xs text-slate-500">Ordered execution flow evaluated during payrun computations</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
            Active Standard
          </span>
        </div>

        <div className="space-y-2">
          {rules.map((rule, idx) => (
            <div key={rule.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-bold text-slate-800">{rule.name} <span className="font-mono text-slate-400">({rule.code})</span></p>
                  <p className="text-slate-500">Category: <strong className="text-slate-700">{rule.category}</strong></p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-700">{rule.calculationType}</span>
                <p className="text-indigo-600 font-mono font-bold">
                  {rule.calculationType === 'Percentage' ? `${rule.value}% of ${rule.baseRule}` : rule.calculationType === 'Fixed Amount' ? `₹${rule.value}` : 'GROSS - DEDUCTION'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Salary Structure"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Structure Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Senior Executive Structure"
          />

          <Input
            label="Description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of structure scope"
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create Structure
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default SalaryStructuresPage;
