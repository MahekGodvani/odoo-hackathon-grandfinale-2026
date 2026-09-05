"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardData {
  kpis: {
    totalEmployees: number;
    activeEmployees: number;
    pendingLeaveRequests: number;
    totalPayruns: number;
    attendanceToday: number;
    totalMonthlySalary: number;
  };
  salaryByDept: { department: string; totalSalary: number; employeeCount: number }[];
  payrollTrend: { month: string; amount: number }[];
  leaveDistribution: { status: string; count: number }[];
  recentPayslips: {
    id: string;
    employeeName: string;
    period: string;
    netSalary: number;
    status: string;
  }[];
}

const COLORS = ["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];
const LEAVE_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REFUSED: "#ef4444",
  CANCELLED: "#6b7280",
  DRAFT: "#94a3b8",
};

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export function DashboardClient({ data, role }: { data: DashboardData; role: string }) {
  const kpiCards = [
    {
      title: "Total Employees",
      value: data.kpis.totalEmployees,
      subtitle: `${data.kpis.activeEmployees} active`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-violet-600/20 to-indigo-600/20",
      iconBg: "bg-violet-500/20 text-violet-400",
    },
    {
      title: "Present Today",
      value: data.kpis.attendanceToday,
      subtitle: "checked in",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-600/20 to-teal-600/20",
      iconBg: "bg-emerald-500/20 text-emerald-400",
    },
    {
      title: "Pending Leaves",
      value: data.kpis.pendingLeaveRequests,
      subtitle: "awaiting approval",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-amber-600/20 to-orange-600/20",
      iconBg: "bg-amber-500/20 text-amber-400",
    },
    {
      title: "Monthly Payroll",
      value: formatINR(data.kpis.totalMonthlySalary),
      subtitle: `${data.kpis.totalPayruns} payruns`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-blue-600/20 to-cyan-600/20",
      iconBg: "bg-blue-500/20 text-blue-400",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-lg font-semibold text-white">{formatINR(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <Card
            key={kpi.title}
            className={`shimmer animate-fade-in bg-gradient-to-br ${kpi.gradient}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{kpi.title}</p>
                  <p className="text-3xl font-bold text-white animate-count-up">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${kpi.iconBg}`}>{kpi.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary by Department */}
        <Card className="animate-fade-in animate-fade-in-delay-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500 pulse-dot" />
              Salary Cost by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salaryByDept} barCategoryGap="20%">
                <XAxis
                  dataKey="department"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatINR(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalSalary" radius={[8, 8, 0, 0]}>
                  {data.salaryByDept.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payroll Trend */}
        <Card className="animate-fade-in animate-fade-in-delay-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 pulse-dot" />
              Payroll Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.payrollTrend}>
                <defs>
                  <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatINR(v)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#payrollGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Distribution */}
        <Card className="animate-fade-in animate-fade-in-delay-4">
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {data.leaveDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.leaveDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {data.leaveDistribution.map((entry, i) => (
                      <Cell key={i} fill={LEAVE_COLORS[entry.status] || COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(23,23,23,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No leave requests yet
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {data.leaveDistribution.map((entry) => (
                <div key={entry.status} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: LEAVE_COLORS[entry.status] || "#6b7280" }}
                  />
                  <span className="text-xs text-gray-400">
                    {entry.status} ({entry.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payslips */}
        <Card className="lg:col-span-2 animate-fade-in animate-fade-in-delay-4">
          <CardHeader>
            <CardTitle>Recent Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentPayslips.length > 0 ? (
              <div className="space-y-3">
                {data.recentPayslips.map((slip) => (
                  <div
                    key={slip.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{slip.employeeName}</p>
                      <p className="text-xs text-gray-500">{slip.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatINR(slip.netSalary)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        slip.status === "PAID"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : slip.status === "VALIDATED"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        {slip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-500 text-sm">
                No payslips generated yet. Create a payrun to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
