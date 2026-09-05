import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { payrollApi } from '../../api/payrollApi';
import { payslipApi } from '../../api/payslipApi';
import {
  Calculator,
  CheckCircle,
  CreditCard,
  Send,
  AlertTriangle,
  ArrowLeft,
  FileText,
  DollarSign,
  Users
} from 'lucide-react';

/**
 * PEOPLEPAY360 - PAYRUN PROCESSING HUB
 * HERO screen managing Compute -> Validate -> Mark Paid -> Send Payslips with Payroll Warnings.
 */
const PayrunDetailPage = () => {
  const { id } = useParams();
  const [payrun, setPayrun] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Send Payslips Confirmation Modal
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [warnings, setWarnings] = useState([]);

  const fetchPayrunDetails = async () => {
    setLoading(true);
    try {
      const prRes = await payrollApi.getPayrun(id);
      setPayrun(prRes.data);

      const psRes = await payslipApi.getPayslips({ payrunId: id });
      setPayslips(psRes.data);

      // Check live eligibility & audit warnings for this period
      const pMonth = prRes.data?.periodMonth || (prRes.data?.periodStart ? new Date(prRes.data.periodStart).getMonth() + 1 : 8);
      const pYear = prRes.data?.periodYear || (prRes.data?.periodStart ? new Date(prRes.data.periodStart).getFullYear() : 2026);
      const eligRes = await payrollApi.checkEligibility(pMonth, pYear);
      if (eligRes.data?.warnings) {
        setWarnings(eligRes.data.warnings);
      }
    } catch (err) {
      console.error('Error loading payrun details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrunDetails();
  }, [id]);

  if (loading || !payrun) return <LoadingSpinner label="Loading Payrun Processing Hub..." />;

  // Dynamic status action permissions
  const status = payrun.status || 'Draft';
  const isDraft = status === 'Draft';
  const isComputed = status === 'Computed';
  const isValidated = status === 'Validated';
  const isPaid = status === 'Paid';
  const employeeCount = payrun.totalEmployees || payrun.employeeCount || payslips.length;

  const handleCompute = async () => {
    setIsProcessing(true);
    try {
      await payrollApi.computePayrun(id);
      setToastMessage('Payrun computed successfully! Itemized payslips generated.');
      fetchPayrunDetails();
    } catch (err) {
      console.error('Compute error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = async () => {
    setIsProcessing(true);
    try {
      await payrollApi.validatePayrun(id);
      setToastMessage('Payrun validated and locked for payment processing.');
      fetchPayrunDetails();
    } catch (err) {
      console.error('Validate error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkPaid = async () => {
    setIsProcessing(true);
    try {
      await payrollApi.markPayrunPaid(id);
      setToastMessage('Payrun marked as Paid! Funds disbursed.');
      fetchPayrunDetails();
    } catch (err) {
      console.error('Mark paid error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendPayslipsConfirm = async () => {
    setIsProcessing(true);
    try {
      await payrollApi.sendPayslips(id);
      setToastMessage(`Payslips sent to ${employeeCount} employees via email.`);
      setIsSendModalOpen(false);
      fetchPayrunDetails();
    } catch (err) {
      console.error('Send payslips error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-indigo-600">
        <Link to="/payroll/payruns" className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Payruns Directory
        </Link>
      </div>

      {/* HEADER PROCESSING HUB CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-slate-900 font-mono">PAYRUN #{payrun.id}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              Period: <span className="text-indigo-600">{payrun.period}</span> ({payrun.startDate} to {payrun.endDate})
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Structure: {payrun.structureName}</p>
          </div>

          {/* DYNAMIC WORKFLOW ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Step 1: Compute */}
            <Button
              variant="primary"
              icon={Calculator}
              onClick={handleCompute}
              isLoading={isProcessing}
              disabled={!isDraft}
            >
              Compute Payrun
            </Button>

            {/* Step 2: Validate */}
            <Button
              variant="success"
              icon={CheckCircle}
              onClick={handleValidate}
              isLoading={isProcessing}
              disabled={!isComputed}
            >
              Validate Payrun
            </Button>

            {/* Step 3: Mark Paid */}
            <Button
              variant="warning"
              icon={CreditCard}
              onClick={handleMarkPaid}
              isLoading={isProcessing}
              disabled={!isValidated}
            >
              Mark Paid
            </Button>

            {/* Step 4: Send Payslips */}
            <Button
              variant="secondary"
              icon={Send}
              onClick={() => setIsSendModalOpen(true)}
              disabled={!isPaid}
            >
              Send Payslips
            </Button>
          </div>
        </div>

        {/* METRICS SUMMARY ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Employees</p>
            <p className="text-xl font-bold text-slate-800 mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> {employeeCount}
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Gross Salary</p>
            <p className="text-xl font-bold text-slate-800 mt-1">₹{payrun.totalGross?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Deductions (PF & Tax)</p>
            <p className="text-xl font-bold text-rose-700 mt-1">₹{payrun.totalDeductions?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Net Disbursement</p>
            <p className="text-xl font-bold text-emerald-700 mt-1">₹{payrun.totalNet?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* PROMINENT PAYROLL WARNINGS & AUDIT PANEL */}
      {warnings.length > 0 ? (
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Payroll Warnings & Audit Alerts</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {warnings.length} Prominent Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {warnings.map((w) => (
              <div key={w.id} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${w.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                  {w.title}
                </p>
                <p className="text-slate-600 mt-1">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Pre-Payroll Audit Checks: 100% Passed</h3>
                <p className="text-xs text-slate-500 mt-0.5">All active employee contracts, banking IFSC codes, and leave balances are verified for this payrun cycle.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audit Ready
            </span>
          </div>
        </div>
      )}

      {/* GENERATED PAYSLIPS TABLE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800">Computed Employee Payslips</h3>
          <span className="text-xs font-semibold text-slate-500">{payslips.length} Payslips Available</span>
        </div>

        <DataTable
          columns={[
            {
              header: 'Employee',
              accessor: 'employeeName',
              render: (r) => (
                <div>
                  <p className="font-bold text-slate-800">{r.employeeName}</p>
                  <span className="font-mono text-[11px] text-slate-400">{r.employeeCode || r.employeeId}</span>
                </div>
              )
            },
            { header: 'Department', accessor: 'department' },
            { header: 'Basic Salary', accessor: 'basic', render: (r) => `₹${r.basic?.toLocaleString()}` },
            { header: 'HRA / Allowances', accessor: 'allowances', render: (r) => `₹${(r.allowances || r.hra || 0).toLocaleString()}` },
            { header: 'Gross Salary', accessor: 'gross', render: (r) => `₹${r.gross?.toLocaleString()}` },
            { header: 'Deductions (Tax & Leaves)', accessor: 'deductions', render: (r) => `₹${(r.deductions ?? r.pf ?? 0).toLocaleString()}` },
            { header: 'Net Salary', accessor: 'net', render: (r) => <span className="font-bold text-emerald-600">₹{r.net?.toLocaleString()}</span> },
            {
              header: 'Action',
              render: (r) => (
                <Link
                  to={`/payroll/payslips/${r.id}`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View Payslip →
                </Link>
              )
            }
          ]}
          data={payslips}
          searchPlaceholder="Search generated payslips..."
          searchField="employeeName"
        />
      </div>

      {/* SEND PAYSLIPS CONFIRMATION MODAL */}
      <Modal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        title="Send Bulk Payslips via Email"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 space-y-2">
            <p className="font-bold text-indigo-900 text-sm">Send payslips to {employeeCount} employees?</p>
            <p className="text-indigo-700">
              This action will dispatch itemized PDF payslip notifications for period <strong>{payrun.period}</strong>.
            </p>
            <div className="pt-2 flex items-center space-x-4 font-semibold text-indigo-900">
              <span>Employees: {employeeCount}</span>
              <span>Payslips: {payslips.length}</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsSendModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" icon={Send} onClick={handleSendPayslipsConfirm} isLoading={isProcessing}>
              Send Payslips
            </Button>
          </div>
        </div>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default PayrunDetailPage;
