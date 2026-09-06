import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Clock,
  CalendarCheck,
  Award,
  Crown,
  Lock,
  ArrowUpRight,
  Sparkles,
  Medal,
  Download
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';

const TopEmployeeLeaderboard = ({ activeDepartment = 'All' }) => {
  const [activeCategory, setActiveCategory] = useState('hours'); // 'hours' | 'attendance' | 'payroll'
  const [rankings, setRankings] = useState({
    topWorkingHours: [],
    topAttendance: [],
    topPayroll: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const res = await dashboardApi.getTopRankings({ department: activeDepartment });
        if (isMounted && res?.data) {
          setRankings(res.data);
        }
      } catch (err) {
        console.error('Failed to load rankings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRankings();
    return () => {
      isMounted = false;
    };
  }, [activeDepartment]);

  const categories = [
    {
      id: 'hours',
      name: 'Most Working Hours',
      icon: Clock,
      color: 'text-indigo-600',
      bgActive: 'bg-indigo-600 text-white',
      bgHover: 'hover:bg-indigo-50 text-indigo-900',
      description: 'Employees logging the most cumulative shift and overtime hours'
    },
    {
      id: 'attendance',
      name: 'Highest Attendance',
      icon: CalendarCheck,
      color: 'text-emerald-600',
      bgActive: 'bg-emerald-600 text-white',
      bgHover: 'hover:bg-emerald-50 text-emerald-900',
      description: 'Punctuality champions with the highest presence record and on-time logs'
    },
    {
      id: 'payroll',
      name: 'Highest Compensation',
      icon: Trophy,
      color: 'text-amber-600',
      bgActive: 'bg-amber-600 text-white',
      bgHover: 'hover:bg-amber-50 text-amber-900',
      description: 'Top compensation tier based on active contract terms and gross packages'
    }
  ];

  let currentList = [];
  if (activeCategory === 'hours') {
    currentList = rankings.topWorkingHours || [];
  } else if (activeCategory === 'attendance') {
    currentList = rankings.topAttendance || [];
  } else {
    currentList = rankings.topPayroll || [];
  }

  // Calculate max metric for relative progress bar
  let maxVal = 1;
  if (activeCategory === 'hours' && currentList.length > 0) {
    maxVal = Math.max(...currentList.map(item => item.total_hours || 0), 1);
  } else if (activeCategory === 'attendance' && currentList.length > 0) {
    maxVal = Math.max(...currentList.map(item => item.present_days || 0), 1);
  } else if (activeCategory === 'payroll' && currentList.length > 0) {
    maxVal = Math.max(...currentList.map(item => (typeof item.total_compensation === 'number' ? item.total_compensation : 1)), 1);
  }

  const exportCSV = () => {
    if (!currentList.length) return;
    const header = ['Rank', 'Employee Code', 'Name', 'Department', 'Designation', 'Primary Metric', 'Honor Badge'];
    const rows = currentList.map(item => {
      let metric = '';
      if (activeCategory === 'hours') metric = `${item.total_hours} hrs`;
      else if (activeCategory === 'attendance') metric = `${item.present_days} days (${item.attendance_rate}%)`;
      else metric = item.is_masked ? 'Confidential' : `₹${item.total_compensation}`;
      return [item.rank, item.employee_code, item.name, item.department, item.designation, metric, item.badge];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PeoplePay360_Top5_${activeCategory}_${activeDepartment}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-500 to-yellow-300 text-amber-950 font-black flex items-center justify-center shadow-xs ring-2 ring-amber-200">
          <Crown className="w-4 h-4 text-amber-950" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-slate-400 to-slate-200 text-slate-800 font-bold flex items-center justify-center shadow-xs ring-2 ring-slate-200">
          <Medal className="w-4 h-4 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-amber-700 to-amber-500 text-amber-50 font-bold flex items-center justify-center shadow-xs ring-2 ring-amber-300/60">
          <Award className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs border border-slate-200">
        #{rank}
      </div>
    );
  };

  const getDeptColor = (dept = '') => {
    switch (dept.toLowerCase()) {
      case 'engineering':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'sales':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'marketing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'human resources':
      case 'hr':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'finance':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      {/* Header with Title & Action */}
      <div className="p-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Workforce Champions & Top 5 Leaderboard
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Live Rankings
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {activeDepartment === 'All' ? 'Across all company departments' : `Filtered for ${activeDepartment} department`}
              </p>
            </div>
          </div>
        </div>

        {/* CSV Export & Tab count */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Export rankings as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Category Pills Switcher */}
      <div className="px-5 pt-3.5 pb-2 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? `${cat.bgActive} shadow-xs scale-102`
                  : `bg-white text-slate-600 border border-slate-200 ${cat.bgHover}`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : cat.color}`} />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                Top 5
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {loading ? (
          <div className="py-12 text-center text-xs font-medium text-slate-400 animate-pulse">
            Computing live workforce rankings...
          </div>
        ) : currentList.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">No qualifying employee records found</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Ensure attendance shifts are logged or contracts are assigned for the selected department.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map((emp) => {
              let metricVal = '';
              let metricSub = '';
              let pct = 100;

              if (activeCategory === 'hours') {
                metricVal = `${emp.total_hours} hrs`;
                metricSub = `Avg ${emp.avg_hours_per_day}h / ${emp.total_shifts} shifts`;
                pct = Math.round(((emp.total_hours || 0) / maxVal) * 100);
              } else if (activeCategory === 'attendance') {
                metricVal = `${emp.present_days} Days`;
                metricSub = `${emp.attendance_rate}% presence rate`;
                pct = Math.round(((emp.present_days || 0) / maxVal) * 100);
              } else {
                if (emp.is_masked) {
                  metricVal = '₹ ••••••';
                  metricSub = 'Confidential (Admin/HR View)';
                  pct = 100 - (emp.rank - 1) * 15;
                } else {
                  metricVal = `₹${Number(emp.total_compensation).toLocaleString()}`;
                  metricSub = `Base: ₹${Number(emp.base_salary).toLocaleString()} + perks`;
                  pct = Math.round(((emp.total_compensation || 0) / maxVal) * 100);
                }
              }

              const initials = emp.name
                ? emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'EP';

              return (
                <div
                  key={emp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    emp.rank === 1
                      ? 'bg-amber-50/30 border-amber-200/80 shadow-xs'
                      : emp.rank === 2
                      ? 'bg-slate-50/40 border-slate-200/80'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left: Rank & Avatar & Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {getRankBadge(emp.rank)}

                      <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-slate-800 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {emp.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-semibold">
                            {emp.employee_code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getDeptColor(emp.department)}`}>
                            {emp.department}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {emp.designation || 'Staff'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Metric and Badge */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5">
                        {emp.is_masked && <Lock className="w-3 h-3 text-slate-400" />}
                        <span className={`text-base font-black ${
                          activeCategory === 'hours'
                            ? 'text-indigo-600'
                            : activeCategory === 'attendance'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}>
                          {metricVal}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                        {metricSub}
                      </p>
                    </div>
                  </div>

                  {/* Relative Progress Bar */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {emp.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-1 max-w-xs">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            activeCategory === 'hours'
                              ? 'bg-indigo-600'
                              : activeCategory === 'attendance'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(12, pct))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info Notice */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Metrics updated in real-time from active Biometric Clock-Ins & Signed Contracts.</span>
        {activeCategory === 'payroll' && (
          <span className="flex items-center gap-1 font-semibold text-amber-700">
            <Lock className="w-3 h-3" />
            Financial Privacy Guard Active
          </span>
        )}
      </div>
    </div>
  );
};

export default TopEmployeeLeaderboard;
