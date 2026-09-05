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
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

/**
 * PEOPLEPAY360 - ENTERPRISE SIDEBAR NAVIGATION
 * Dark-themed Fortune 500 SaaS sidebar with role-filtered navigation items, badges, and trust badges.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { hasPermission } = useAuth();

  const navigationSections = [
    {
      title: null,
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [], badge: null },
      ]
    },
    {
      title: 'HR OPERATIONS',
      items: [
        { name: 'Employees', path: '/employees', icon: Users, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE], badge: 'Active' },
        { name: 'Contracts', path: '/contracts', icon: FileText, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: null },
        { name: 'Working Schedules', path: '/schedules', icon: Calendar, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: '40h' },
        { name: 'Attendance', path: '/attendance', icon: Clock, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE], badge: null },
        { name: 'Time Off', path: '/time-off/requests', icon: Briefcase, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE], badge: 'Leaves' },
      ]
    },
    {
      title: 'PAYROLL ENGINE',
      items: [
        { name: 'Payruns', path: '/payroll/payruns', icon: CreditCard, roles: [ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: '2-Step' },
        { name: 'Payslips', path: '/payroll/payslips', icon: DollarSign, roles: [ROLES.HR_PAYROLL_USER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE], badge: 'PDF' },
        { name: 'Salary Structures', path: '/payroll/salary-structures', icon: Layers, roles: [ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: null },
        { name: 'Salary Rules', path: '/payroll/salary-rules', icon: Sliders, roles: [ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: 'Engine' },
      ]
    },
    {
      title: 'INTELLIGENCE & COMMERCIAL',
      items: [
        { name: 'Payroll Analytics', path: '/reports', icon: BarChart3, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_MANAGER, ROLES.ADMIN], badge: 'Live' },
        { name: 'Business Model & ROI', path: '/business-model', icon: TrendingUp, roles: [], badge: '⭐ Strategy' },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { name: 'User Management', path: '/users', icon: UserCheck, roles: [ROLES.ADMIN], badge: 'RBAC' },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-800 shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/90 shrink-0 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-600/30">
              360
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-white tracking-tight text-sm leading-tight">PeoplePay360</h1>
                <span className="bg-indigo-500/20 text-indigo-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">HR & Payroll Suite</p>
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
                  <p className="px-3 mb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
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
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            item.badge.includes('⭐')
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer Enterprise Trust Badges */}
        <div className="p-4 border-t border-slate-800/90 shrink-0 bg-slate-950/40">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 text-center">
            <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Grade v2.4</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-center space-x-1">
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>SOC-2 • GDPR • ISO 27001</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
