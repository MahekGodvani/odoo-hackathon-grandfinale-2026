import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { payslipApi } from '../../api/payslipApi';
import { Printer, Eye } from 'lucide-react';

/**
 * PEOPLEPAY360 - PAYSLIPS DIRECTORY
 */
const PayslipsPage = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayslips() {
      setLoading(true);
      try {
        const res = await payslipApi.getPayslips();
        setPayslips(res.data);
      } catch (err) {
        console.error('Error fetching payslips', err);
      } finally {
        setLoading(false);
      }
    }
    loadPayslips();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Payslips Repository..." />;

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (r) => (
        <div>
          <Link to={`/payroll/payslips/${r.id}`} className="font-bold text-slate-800 hover:text-indigo-600">
            {r.employeeName}
          </Link>
          <p className="font-mono text-xs text-slate-400">{r.employeeId}</p>
        </div>
      )
    },
    { header: 'Pay Period', accessor: 'period' },
    { header: 'Salary Structure', accessor: 'structureName' },
    { header: 'Worked Days', accessor: 'workedDays', render: (r) => `${r.workedDays} Days` },
    { header: 'Gross Salary', accessor: 'gross', render: (r) => `₹${r.gross?.toLocaleString()}` },
    { header: 'Net Salary', accessor: 'net', render: (r) => <span className="font-bold text-emerald-600">₹{r.net?.toLocaleString()}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      render: (r) => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/payroll/payslips/${r.id}`}
            title="Open Printable Payslip"
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
          >
            <Printer className="w-4 h-4" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payslips Repository"
        subtitle="View itemized employee payslips, salary breakdowns, and printable PDF records."
        breadcrumbs={[{ label: 'Payslips' }]}
      />

      <DataTable
        columns={columns}
        data={payslips}
        searchPlaceholder="Search payslips by employee name..."
        searchField="employeeName"
      />
    </div>
  );
};

export default PayslipsPage;
