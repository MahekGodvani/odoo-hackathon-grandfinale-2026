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
import { payrollApi } from '../../api/payrollApi';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Plus, Sliders, Edit, Calculator, Eye } from 'lucide-react';

/**
 * PEOPLEPAY360 - SALARY RULES MODULE
 * Features instant live formula preview box for rule configurations.
 */
const SalaryRulesPage = () => {
  const { role } = useAuth();
  const isReadOnly = role === ROLES.HR_PAYROLL_USER;

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: 'House Rent Allowance',
    code: 'HRA',
    category: 'Allowance',
    sequence: 2,
    calculationType: 'Percentage',
    value: 20,
    baseRule: 'BASIC',
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await payrollApi.getSalaryRules();
      setRules(res.data);
    } catch (err) {
      console.error('Error fetching rules', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Calculation formula live preview logic
  const calculatePreview = () => {
    const sampleBasic = 40000;
    if (formData.calculationType === 'Fixed Amount') {
      return `Fixed Amount = ₹${Number(formData.value || 0).toLocaleString()}`;
    }
    if (formData.calculationType === 'Percentage') {
      const computed = Math.round(sampleBasic * (Number(formData.value || 0) / 100));
      return `Basic = ₹${sampleBasic.toLocaleString()} → ${formData.name} (${formData.value}%) = ₹${computed.toLocaleString()}`;
    }
    return `Dynamic Formula (${formData.baseRule || 'GROSS - DEDUCTION'})`;
  };

  const handleOpenCreate = () => {
    setSelectedRule(null);
    setFormData({
      name: '',
      code: '',
      category: 'Allowance',
      sequence: rules.length + 1,
      calculationType: 'Percentage',
      value: 20,
      baseRule: 'BASIC',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      code: rule.code,
      category: rule.category,
      sequence: rule.sequence,
      calculationType: rule.calculationType,
      value: rule.value,
      baseRule: rule.baseRule || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        sequence: Number(formData.sequence),
        status: 'Active',
      };

      if (selectedRule) {
        await payrollApi.updateSalaryRule(selectedRule.id, payload);
        setToastMessage('Salary rule updated');
      } else {
        await payrollApi.createSalaryRule(payload);
        setToastMessage('New salary rule created');
      }
      setIsModalOpen(false);
      fetchRules();
    } catch (err) {
      console.error('Error saving salary rule', err);
      setToastMessage(err.response?.data?.message || err.message || 'Error saving salary rule');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Salary Rules Engine..." />;

  const columns = [
    {
      header: 'Rule Name',
      accessor: 'name',
      render: (r) => (
        <div>
          <p className="font-bold text-slate-800">{r.name}</p>
          <span className="font-mono text-[11px] text-indigo-600 font-semibold">{r.code}</span>
        </div>
      )
    },
    { header: 'Category', accessor: 'category', render: (r) => <span className="font-semibold text-slate-700">{r.category}</span> },
    { header: 'Seq', accessor: 'sequence', render: (r) => <span className="font-mono text-xs">{r.sequence}</span> },
    { header: 'Calculation Type', accessor: 'calculationType' },
    {
      header: 'Value / Rule',
      accessor: 'value',
      render: (r) => (
        <span className="font-bold text-indigo-700 font-mono">
          {r.calculationType === 'Percentage' ? `${r.value}% of ${r.baseRule}` : r.calculationType === 'Fixed Amount' ? `₹${r.value?.toLocaleString()}` : r.baseRule}
        </span>
      )
    },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    ...(!isReadOnly ? [{
      header: 'Actions',
      render: (r) => (
        <button
          onClick={() => handleOpenEdit(r)}
          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
        >
          <Edit className="w-4 h-4" />
        </button>
      )
    }] : [])
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Rules Engine"
        subtitle="Configure earnings, allowances, deductions, and gross-to-net formulas."
        breadcrumbs={[{ label: 'Salary Rules' }]}
        actions={
          isReadOnly ? (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Read-Only Mode
            </span>
          ) : (
            <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
              New Salary Rule
            </Button>
          )
        }
      />

      <DataTable
        columns={columns}
        data={rules}
        searchPlaceholder="Search salary rules..."
        searchField="name"
      />

      {/* FORM MODAL WITH FORMULA PREVIEW BOX */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRule ? `Edit Salary Rule (${selectedRule.code})` : 'Create Salary Rule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rule Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. House Rent Allowance"
            />
            <Input
              label="Rule Code"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="HRA"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Basic', 'Allowance', 'Gross', 'Deduction', 'Net']}
            />
            <Input
              label="Sequence Number"
              type="number"
              required
              value={formData.sequence}
              onChange={(e) => setFormData({ ...formData, sequence: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Calculation Type"
              required
              value={formData.calculationType}
              onChange={(e) => setFormData({ ...formData, calculationType: e.target.value })}
              options={['Fixed Amount', 'Percentage', 'Formula']}
            />
            <Input
              label={formData.calculationType === 'Percentage' ? 'Percentage Rate (%)' : 'Amount (₹)'}
              type="number"
              required={formData.calculationType !== 'Formula'}
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />
          </div>

          {formData.calculationType === 'Percentage' && (
            <Select
              label="Base Rule for Percentage"
              required
              value={formData.baseRule}
              onChange={(e) => setFormData({ ...formData, baseRule: e.target.value })}
              options={['BASIC', 'GROSS']}
            />
          )}

          {/* LIVE FORMULA CALCULATION PREVIEW BOX (IMPORTANT REQUIREMENT) */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase mb-1">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Rule Calculation Formula Preview</span>
            </div>
            <p className="font-mono text-xs text-indigo-800 bg-white p-2.5 rounded-lg border border-indigo-100 mt-1">
              {calculatePreview()}
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {selectedRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default SalaryRulesPage;
