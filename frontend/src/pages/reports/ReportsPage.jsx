import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { dashboardApi } from '../../api/dashboardApi';
import { Users, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell
} from 'recharts';

/**
 * PEOPLEPAY360 - REPORTS & PAYROLL DASHBOARD
 */
const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState('August 2026');
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const res = await dashboardApi.getDashboardStats({ period, department });
        setStats(res.data);
      } catch (err) {
        console.error('Error loading reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [period, department]);

  if (loading || !stats) return <LoadingSpinner label="Compiling Payroll Reports..." />;

  const { kpis, salaryByDepartment } = stats;

  const monthlyTrendData = [
    { month: 'Apr 2026', netSalary: 620000 },
    { month: 'May 2026', netSalary: 645000 },
    { month: 'Jun 2026', netSalary: 670000 },
    { month: 'Jul 2026', netSalary: 693000 },
    { month: 'Aug 2026', netSalary: 710000 },
  ];

  const deptHeadcount = [
    { name: 'Engineering', value: 7, color: '#4f46e5' },
    { name: 'Sales', value: 4, color: '#10b981' },
    { name: 'Human Resources', value: 2, color: '#f59e0b' },
    { name: 'Finance', value: 2, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Analytics & Reports"
        subtitle="Departmental wage distribution, headcount ratios, and monthly salary trends."
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs text-xs font-medium">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={kpis.totalEmployees} icon={Users} color="indigo" />
        <StatCard title="Total Monthly Net Wage" value={`₹${kpis.totalNetSalary.toLocaleString()}`} icon={DollarSign} color="emerald" />
        <StatCard title="Payslips Issued" value={kpis.payslipsGenerated} icon={BarChart3} color="blue" />
        <StatCard title="Attendance Health" value={`${kpis.attendanceHealth}%`} icon={Activity} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Cost by Department */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-1">Salary Cost by Department</h3>
          <p className="text-xs text-slate-500 mb-4">Gross wage allocation by department (₹)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryByDepartment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Total Wage']} />
                <Bar dataKey="cost" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Net Salary Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 mb-1">Monthly Net Salary Trend</h3>
          <p className="text-xs text-slate-500 mb-4">Total net salary disbursement progression</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Net Salary']} />
                <Line type="monotone" dataKey="netSalary" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
