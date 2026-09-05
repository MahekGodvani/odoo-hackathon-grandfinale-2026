import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { payrollApi } from '../../api/payrollApi';
import { employeeApi } from '../../api/employeeApi';
import { Plus, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * PEOPLEPAY360 - PAYRUNS LIST & 2-STEP CREATION WIZARD
 */
const PayrunsPage = () => {
  const navigate = useNavigate();
  const [payruns, setPayruns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  // WIZARD STATE
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);

  const [toastMessage, setToastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [wizardData, setWizardData] = useState({
    structureId: 'struct-1',
    period: 'August 2026',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prRes, empRes, structRes] = await Promise.all([
        payrollApi.getPayruns(),
        employeeApi.getEmployees(),
        payrollApi.getSalaryStructures(),
      ]);
      setPayruns(prRes.data);
      setEmployees(empRes.data);
      setStructures(structRes.data);
      setSelectedEmpIds(empRes.data.map((e) => e.id));
    } catch (err) {
      console.error('Error fetching payruns', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenWizard = () => {
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleSelectAllEmps = (e) => {
    if (e.target.checked) {
      setSelectedEmpIds(employees.map((emp) => emp.id));
    } else {
      setSelectedEmpIds([]);
    }
  };

  const handleToggleEmp = (id) => {
    if (selectedEmpIds.includes(id)) {
      setSelectedEmpIds(selectedEmpIds.filter((x) => x !== id));
    } else {
      setSelectedEmpIds([...selectedEmpIds, id]);
    }
  };

  const handleCreatePayrun = async () => {
    if (selectedEmpIds.length === 0) {
      alert('Please select at least one employee for the payrun.');
      return;
    }
    setIsSubmitting(true);
    try {
      const selectedStruct = structures.find((s) => s.id === wizardData.structureId);
      const payload = {
        ...wizardData,
        structureName: selectedStruct ? selectedStruct.name : 'Standard Regular Structure',
        name: `${wizardData.period} ${selectedStruct ? selectedStruct.name : 'Payrun'}`,
        selectedEmployeeIds: selectedEmpIds,
      };

      const res = await payrollApi.createPayrun(payload);
      setIsWizardOpen(false);
      setToastMessage('Payrun created in Draft mode. Redirecting to Processing Screen...');
      setTimeout(() => {
        navigate(`/payroll/payruns/${res.data.id}`);
      }, 500);
    } catch (err) {
      console.error('Error creating payrun', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Payruns Repository..." />;

  const columns = [
    {
      header: 'Payrun ID & Period',
      accessor: 'id',
      render: (r) => (
        <div>
          <Link to={`/payroll/payruns/${r.id}`} className="font-bold text-slate-900 hover:text-indigo-600">
            {r.name || r.id}
          </Link>
          <p className="font-mono text-xs text-slate-400">{r.id} ({r.period})</p>
        </div>
      )
    },
    { header: 'Salary Structure', accessor: 'structureName' },
    { header: 'Employees', accessor: 'totalEmployees', render: (r) => `${r.totalEmployees} Employees` },
    { header: 'Total Gross', accessor: 'totalGross', render: (r) => `₹${r.totalGross?.toLocaleString()}` },
    { header: 'Total Net', accessor: 'totalNet', render: (r) => <span className="font-bold text-emerald-600">₹{r.totalNet?.toLocaleString()}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (r) => (
        <Link
          to={`/payroll/payruns/${r.id}`}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors inline-flex items-center gap-1"
        >
          Open Processing <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payrun Management"
        subtitle="Execute monthly payroll calculations, validate structure rules, and issue employee payslips."
        breadcrumbs={[{ label: 'Payruns' }]}
        actions={
          <Button variant="primary" icon={Plus} onClick={handleOpenWizard}>
            New Payrun
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={payruns}
        searchPlaceholder="Search payruns by period or structure..."
        searchField="name"
      />

      {/* 2-STEP PAYRUN CREATION WIZARD MODAL */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={`Payrun Creation Wizard (Step ${wizardStep} of 2)`}
        maxWidth="max-w-3xl"
      >
        {wizardStep === 1 ? (
          /* STEP 1: STRUCTURE & PERIOD SETUP */
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold">
              Step 1: Select salary structure, period name, and start/end dates for computation.
            </div>

            <Select
              label="Salary Structure"
              required
              value={wizardData.structureId}
              onChange={(e) => setWizardData({ ...wizardData, structureId: e.target.value })}
              options={structures.map((s) => ({ value: s.id, label: s.name }))}
            />

            <Input
              label="Payroll Period Name"
              required
              value={wizardData.period}
              onChange={(e) => setWizardData({ ...wizardData, period: e.target.value })}
              placeholder="e.g. August 2026"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Period Start Date"
                type="date"
                required
                value={wizardData.startDate}
                onChange={(e) => setWizardData({ ...wizardData, startDate: e.target.value })}
              />
              <Input
                label="Period End Date"
                type="date"
                required
                value={wizardData.endDate}
                onChange={(e) => setWizardData({ ...wizardData, endDate: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setIsWizardOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setWizardStep(2)}>
                Continue to Employee Selection →
              </Button>
            </div>
          </div>
        ) : (
          /* STEP 2: SELECT ELIGIBLE EMPLOYEES */
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-semibold">
              <span>Step 2: Select eligible employees included in this payrun.</span>
              <span className="font-bold">{selectedEmpIds.length} Selected</span>
            </div>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500 sticky top-0">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedEmpIds.length === employees.length}
                        onChange={handleSelectAllEmps}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Position</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedEmpIds.includes(emp.id)}
                          onChange={() => handleToggleEmp(emp.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="p-3 font-bold text-slate-800">{emp.name} ({emp.id})</td>
                      <td className="p-3 text-slate-600">{emp.department}</td>
                      <td className="p-3 text-slate-600">{emp.position}</td>
                      <td className="p-3"><StatusBadge status={emp.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setWizardStep(1)} disabled={isSubmitting}>
                ← Back to Step 1
              </Button>
              <Button variant="primary" onClick={handleCreatePayrun} isLoading={isSubmitting}>
                Create Payrun Draft
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default PayrunsPage;
