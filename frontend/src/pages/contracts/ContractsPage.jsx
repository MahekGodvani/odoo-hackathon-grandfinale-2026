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
import { contractApi } from '../../api/contractApi';
import { employeeApi } from '../../api/employeeApi';
import { payrollApi } from '../../api/payrollApi';
import { Plus, Info, Edit, CheckCircle } from 'lucide-react';

/**
 * PEOPLEPAY360 - CONTRACTS MODULE
 */
const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    department: 'Engineering',
    position: '',
    wage: 50000,
    structureId: 'struct-1',
    status: 'Active',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ctrRes, empRes, structRes] = await Promise.all([
        contractApi.getContracts(),
        employeeApi.getEmployees(),
        payrollApi.getSalaryStructures(),
      ]);
      setContracts(ctrRes.data);
      setEmployees(empRes.data);
      setStructures(structRes.data);
    } catch (err) {
      console.error('Error fetching contracts data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedContract(null);
    const defaultEmp = employees.length > 0 ? employees[0] : null;
    const defaultStruct = structures.length > 0 ? structures[0] : null;
    setFormData({
      employeeId: defaultEmp ? defaultEmp.id : '',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      department: defaultEmp ? defaultEmp.department : 'Engineering',
      position: defaultEmp ? defaultEmp.position : '',
      wage: 50000,
      structureId: defaultStruct ? defaultStruct.id : 1,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contract) => {
    setSelectedContract(contract);
    setFormData({
      employeeId: contract.employeeId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      department: contract.department,
      position: contract.position,
      wage: contract.wage,
      structureId: contract.structureId || (structures[0]?.id || 1),
      status: contract.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const emp = employees.find((e) => String(e.id) === String(formData.employeeId));
      const struct = structures.find((s) => String(s.id) === String(formData.structureId));

      const payload = {
        ...formData,
        employeeName: emp ? emp.name : 'Employee',
        structureName: struct ? struct.name : 'Standard Regular Structure',
        wage: Number(formData.wage),
      };

      if (selectedContract) {
        await contractApi.updateContract(selectedContract.id, payload);
        setToastMessage('Contract updated successfully');
      } else {
        await contractApi.createContract(payload);
        setToastMessage('New active contract created successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving contract', err);
      setToastMessage(err.response?.data?.message || err.message || 'Failed to save contract agreement');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Contracts Repository..." />;

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
    { header: 'Start Date', accessor: 'startDate' },
    { header: 'End Date', accessor: 'endDate' },
    {
      header: 'Monthly Wage',
      accessor: 'wage',
      render: (r) => <span className="font-bold text-indigo-700">₹{r.wage?.toLocaleString()}</span>
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Position', accessor: 'position' },
    { header: 'Salary Structure', accessor: 'structureName' },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (r) => (
        <button
          onClick={() => handleOpenEdit(r)}
          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
        >
          <Edit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employment Contracts"
        subtitle="Manage wage rates, period start/end dates, and salary structure assignments."
        breadcrumbs={[{ label: 'Contracts' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
            Create Contract
          </Button>
        }
      />

      {/* IMPORTANT BUSINESS RULE HIGHLIGHT PANEL */}
      <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-xl flex items-start space-x-3 text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-indigo-900 text-sm">Active Contract Business Rule</p>
          <p className="mt-0.5 text-indigo-800">
            Payroll computation dynamically uses the active contract applicable to the selected payrun period. Each employee should have exactly one active contract per period.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contracts}
        searchPlaceholder="Search contracts by employee name..."
        searchField="employeeName"
      />

      {/* CREATE / EDIT CONTRACT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContract ? `Edit Contract (${selectedContract.id})` : 'New Contract Agreement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            name="employeeId"
            required
            value={formData.employeeId}
            onChange={(e) => {
              const emp = employees.find((x) => String(x.id) === String(e.target.value));
              setFormData((prev) => ({
                ...prev,
                employeeId: e.target.value,
                department: emp ? emp.department : prev.department,
                position: emp ? emp.position : prev.position,
              }));
            }}
            options={employees.map((e) => ({ value: e.id, label: `${e.name} (${e.id}) - ${e.department}` }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department"
              name="department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              label="Position"
              name="position"
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Base Wage (₹)"
              name="wage"
              type="number"
              required
              value={formData.wage}
              onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
            />
            <Select
              label="Salary Structure"
              name="structureId"
              required
              value={formData.structureId}
              onChange={(e) => setFormData({ ...formData, structureId: e.target.value })}
              options={structures.map((s) => ({ value: s.id, label: s.name }))}
            />
          </div>

          <Select
            label="Contract Status"
            name="status"
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={['Draft', 'Active', 'Expired']}
          />

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {selectedContract ? 'Update Contract' : 'Create Contract'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default ContractsPage;
