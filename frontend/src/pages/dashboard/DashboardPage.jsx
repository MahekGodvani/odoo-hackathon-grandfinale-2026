import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { dashboardApi } from '../../api/dashboardApi';
import {
  Users,
  DollarSign,
  FileCheck,
  CalendarCheck,
  Activity,
  AlertTriangle,
  ChevronRight,
  Clock,
  Briefcase,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

/**
 * PEOPLEPAY360 - MAIN PAYROLL DASHBOARD
 */
const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [period, setPeriod] = useState('August 2026');
  const [department, setDepartment] = useState('All');
  const [employeeType, setEmployeeType] = useState('All');

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await dashboardApi.getDashboardStats({ period, department, employeeType });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [period, department, employeeType]);

  if (loading || !stats) {
    return <LoadingSpinner label="Loading Payroll Dashboard..." />;
  }

  const { kpis, alerts, attendanceSummary, timeOffSummary, salaryByDepartment } = stats;
  

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & HR Operational Dashboard"
        subtitle="Live metrics compiled from connected Employees, Contracts, Attendance, and Payruns."
        actions={
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs text-xs font-medium">
            {/* Period Filter */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="August 2026">August 2026</option>
              <option value="July 2026">July 2026</option>
            </select>

            {/* Department Filter */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="All">All Depts</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>

            {/* Employee Type Filter */}
            <select
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-Time</option>
              <option value="Part-time">Part-Time</option>
            </select>
          </div>
        }
      />

      {/* TOP 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Employees"
          value={kpis.totalEmployees}
          subtitle="Active workforce"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Net Salary"
          value={`₹${kpis.totalNetSalary.toLocaleString()}`}
          subtitle="Current period pay"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Payslips Generated"
          value={kpis.payslipsGenerated}
          subtitle="Issued pay records"
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          title="Approved Time Off"
          value={`${kpis.approvedTimeOff} Requests`}
          subtitle="Processed leave"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Attendance Health"
          value={`${kpis.attendanceHealth}%`}
          subtitle="On-time presence"
          icon={Activity}
          color="emerald"
        />
      </div>

      {/* MIDDLE SECTION: CHART (LEFT) & ALERTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Cost by Department Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Salary Cost by Department</h2>
              <p className="text-xs text-slate-500">Active monthly wage allocations in ₹</p>
            </div>
            <Link to="/reports" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Full Report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryByDepartment} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Total Wage']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="cost" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payroll Alerts Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Payroll Alerts
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                alerts.length > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {alerts.length > 0 ? `${alerts.length} Action Items` : 'All Verified'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs font-bold text-slate-800">All Systems Compliant</p>
                  <p className="text-[11px] text-slate-500 mt-1">Contracts, time-off balances & attendance records are verified.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    to={alert.link || '/payroll/payruns'}
                    className={`block p-2.5 rounded-xl border transition-all ${
                      alert.type === 'error'
                        ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/60'
                        : alert.type === 'info'
                        ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/60'
                        : 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                            alert.type === 'error'
                              ? 'bg-rose-100 text-rose-700 border-rose-200'
                              : alert.type === 'info'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {alert.tag || 'Action Required'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{alert.text}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>Period Validation Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Audit Ready
              </span>
            </div>
            <Link
              to="/payroll/payruns"
              className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl text-center block transition-colors shadow-2xs border border-indigo-100"
            >
              Go to Payrun Wizard →
            </Link>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: ATTENDANCE & TIME OFF OVERVIEWS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Attendance Overview
            </h2>
            <Link to="/attendance" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              View Log
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-lg font-bold text-emerald-700">{attendanceSummary.present}</p>
              <p className="text-[11px] font-medium text-emerald-800 mt-0.5">Present</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-lg font-bold text-amber-700">{attendanceSummary.late}</p>
              <p className="text-[11px] font-medium text-amber-800 mt-0.5">Late</p>
            </div>
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
              <p className="text-lg font-bold text-rose-700">{attendanceSummary.absent}</p>
              <p className="text-[11px] font-medium text-rose-800 mt-0.5">Absent</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-lg font-bold text-blue-700">{attendanceSummary.overtime}</p>
              <p className="text-[11px] font-medium text-blue-800 mt-0.5">Overtime</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
              <p className="text-lg font-bold text-slate-700">{attendanceSummary.missingCheckout}</p>
              <p className="text-[11px] font-medium text-slate-700 mt-0.5">Missing Out</p>
            </div>
          </div>
        </div>

        {/* Time Off Overview */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Time Off Overview
            </h2>
            <Link to="/time-off/requests" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              Manage Requests
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-xl font-bold text-emerald-700">{timeOffSummary.approved}</p>
              <p className="text-xs font-medium text-emerald-800 mt-0.5">Approved Requests</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <p className="text-xl font-bold text-amber-700">{timeOffSummary.pending}</p>
              <p className="text-xs font-medium text-amber-800 mt-0.5">Pending Approvals</p>
            </div>
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
              <p className="text-xl font-bold text-indigo-700">{timeOffSummary.remainingLeave} Days</p>
              <p className="text-xs font-medium text-indigo-800 mt-0.5">Remaining Balance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
