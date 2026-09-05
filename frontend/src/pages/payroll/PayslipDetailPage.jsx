import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Toast from '../../components/common/Toast';
import { payslipApi } from '../../api/payslipApi';
import { Printer, Download, ArrowLeft, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';

/**
 * PEOPLEPAY360 - PROFESSIONAL PRINTABLE PAYSLIP DETAIL VIEW
 * Formatted enterprise payslip with line-item Earnings & Deductions breakdowns and print styling.
 */
const PayslipDetailPage = () => {
  const { id } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadPayslip() {
      setLoading(true);
      try {
        const res = await payslipApi.getPayslip(id);
        setPayslip(res.data);
      } catch (err) {
        console.error('Error loading payslip', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayslip();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      await payslipApi.downloadPayslipPdf(id);
      setToastMessage('Payslip PDF downloaded successfully.');
      window.print(); // triggers native print dialog as PDF save
    } catch (err) {
      console.error('Download error', err);
    }
  };

  if (loading || !payslip) return <LoadingSpinner label="Loading Payslip Detail..." />;

  // Filter earnings and deductions from line items
  const earnings = payslip.lines ? payslip.lines.filter((l) => l.category === 'Basic' || l.category === 'Allowance') : [
    { code: 'BASIC', name: 'Basic Salary', amount: payslip.basic },
    { code: 'HRA', name: 'House Rent Allowance (20%)', amount: payslip.hra },
    { code: 'TA', name: 'Transport Allowance', amount: payslip.ta },
  ];

  const deductions = payslip.lines ? payslip.lines.filter((l) => l.category === 'Deduction') : [
    { code: 'PF', name: 'Provident Fund (12%)', amount: payslip.pf },
  ];

  return (
    <div className="space-y-6">
      {/* Top action bar - Hidden during Print */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-indigo-600">
          <Link to="/payroll/payslips" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Payslips Repository
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>
            Print Payslip
          </Button>
          <Button variant="primary" icon={Download} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* PRINTABLE PAYSLIP CONTAINER */}
      <div className="payslip-container bg-white p-4 sm:p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6 sm:space-y-8 text-slate-800 w-full overflow-hidden">
        
        {/* BRAND & HEADER SECTION */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              360
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-wider">PEOPLEPAY360</h1>
              <p className="text-xs uppercase font-bold text-slate-500">Global HR & Payroll Operations</p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-900 tracking-wider">PAYSLIP</h2>
            <p className="text-sm font-bold text-indigo-600 font-mono mt-0.5">#{payslip.id}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">Payment Date: {payslip.paymentDate || '2026-08-31'}</p>
          </div>
        </div>

        {/* EMPLOYEE & PAY PERIOD META GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Employee Name</p>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{payslip.employeeName}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Employee ID</p>
            <p className="font-mono font-bold text-indigo-700 text-sm mt-0.5">{payslip.employeeId}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Department</p>
            <p className="font-semibold text-slate-800 mt-0.5">{payslip.department}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">Position</p>
            <p className="font-semibold text-slate-800 mt-0.5">{payslip.position}</p>
          </div>
        </div>

        {/* ATTENDANCE & WORK SUMMARY SUMMARY BAR */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-center">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Worked Days</p>
            <p className="font-bold text-indigo-900 text-base">{payslip.workedDays || 22} Days</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Paid Days</p>
            <p className="font-bold text-emerald-700 text-base">{payslip.paidDays || 22} Days</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Leave Days</p>
            <p className="font-bold text-amber-700 text-base">{payslip.leaveDays || 0} Days</p>
          </div>
        </div>

        {/* ITEMIZED EARNINGS & DEDUCTIONS TABLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EARNINGS */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>EARNINGS</span>
              <span>AMOUNT (₹)</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {earnings.map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-center justify-between">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900">₹{item.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between font-bold text-xs text-slate-900">
              <span>GROSS SALARY</span>
              <span className="text-indigo-700 text-sm">₹{payslip.gross?.toLocaleString()}</span>
            </div>
          </div>

          {/* DEDUCTIONS */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>DEDUCTIONS</span>
              <span>AMOUNT (₹)</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {deductions.map((item, idx) => (
                <div key={idx} className="px-4 py-3 flex items-center justify-between">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-mono font-bold text-rose-700">₹{item.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between font-bold text-xs text-slate-900">
              <span>TOTAL DEDUCTIONS</span>
              <span className="text-rose-700 text-sm">₹{payslip.totalDeductions?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* NET SALARY HIGHLIGHT BOX */}
        <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">NET SALARY PAYABLE</p>
            <p className="text-xs text-emerald-700 mt-0.5">Transferred via Direct Bank Deposit</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-emerald-950 font-mono tracking-tight">
              ₹{payslip.net?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* FOOTER SIGNATURE & DISCLAIMER */}
        <div className="pt-8 border-t border-slate-200 flex items-end justify-between text-[11px] text-slate-400">
          <div>
            <p className="font-semibold text-slate-600">PeoplePay360 Operations</p>
            <p>This is a computer-generated payslip and requires no physical signature.</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-slate-600">Authorized Signatory</p>
            <div className="w-28 border-b border-slate-400 mt-6 mb-1"></div>
            <p>Finance & HR Operations</p>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default PayslipDetailPage;
