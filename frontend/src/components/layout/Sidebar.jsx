import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  Sliders,
  DollarSign,
  BarChart3,
  UserCheck,
  CreditCard,
  TrendingUp
} from 'lucide-react';

/**
 * PEOPLEPAY360 - SIDEBAR NAVIGATION
 * Dark-themed SaaS sidebar with role-filtered navigation items.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();

  const navigationSections = [
    {
      title: null,
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [] },
      ]
    },
    {
      title: 'HR MANAGEMENT',
      items: [
        { name: 'Employees', path: '/employees', icon: Users, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
        { name: 'Contracts', path: '/contracts', icon: FileText, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
        { name: 'Working Schedules', path: '/schedules', icon: Calendar, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
        { name: 'Attendance', path: '/attendance', icon: Clock, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
        { name: 'Time Off', path: '/time-off/requests', icon: Briefcase, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
      ]
    },
    {
      title: 'PAYROLL',
      items: [
        { name: 'Payruns', path: '/payroll/payruns', icon: CreditCard, roles: [ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
        { name: 'Payslips', path: '/payroll/payslips', icon: DollarSign, roles: [ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
        { name: 'Salary Structures', path: '/payroll/salary-structures', icon: Layers, roles: [ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
        { name: 'Salary Rules', path: '/payroll/salary-rules', icon: Sliders, roles: [ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { name: 'Payroll Dashboard', path: '/reports', icon: BarChart3, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN] },
      ]
    },
    {
      title: 'COMMERCIAL',
      items: [
        { name: 'Business Model & Pricing', path: '/business-model', icon: TrendingUp, roles: [] },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Users', path: '/users', icon: UserCheck, roles: [ROLES.ADMIN] },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-800`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              360
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide text-sm leading-tight">PeoplePay360</h1>
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">HR & Payroll</p>
            </div>
          </div>
        </div>

        {/* Scrollable Menu Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navigationSections.map((section, idx) => {
            const visibleItems = section.items.filter((item) => hasPermission(item.roles));
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx}>
                {section.title && (
                  <p className="px-3 mb-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 mr-3 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-800 shrink-0 text-center">
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
            <p className="text-xs font-semibold text-slate-300">Hackathon Edition</p>
            <p className="text-[10px] text-slate-500 mt-0.5">HR → Attendance → Payrun Flow</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
