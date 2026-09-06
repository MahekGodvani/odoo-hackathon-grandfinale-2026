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
  Lock,
  Workflow,
  Building2
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
        { name: 'Employees', path: '/employees', icon: Users, roles: [ROLES.HR_MANAGER], badge: 'Active' },
        { name: 'Contracts', path: '/contracts', icon: FileText, roles: [ROLES.HR_MANAGER], badge: null },
        { name: 'Working Schedules', path: '/schedules', icon: Calendar, roles: [ROLES.HR_MANAGER], badge: '40h' },
        { name: 'Attendance', path: '/attendance', icon: Clock, roles: [ROLES.EMPLOYEE, ROLES.HR_MANAGER], badge: null },
        { name: 'Time Off', path: '/time-off/requests', icon: Briefcase, roles: [ROLES.EMPLOYEE, ROLES.HR_MANAGER], badge: 'Leaves' },
      ]
    },
    {
      title: 'PAYROLL ENGINE',
      items: [
        { name: 'Payruns', path: '/payroll/payruns', icon: CreditCard, roles: [ROLES.HR_PAYROLL_USER], badge: '2-Step' },
        { name: 'Payslips', path: '/payroll/payslips', icon: DollarSign, roles: [ROLES.EMPLOYEE, ROLES.HR_PAYROLL_USER], badge: 'PDF' },
        { name: 'Salary Structures', path: '/payroll/salary-structures', icon: Layers, roles: [ROLES.HR_PAYROLL_USER], badge: null },
        { name: 'Salary Rules', path: '/payroll/salary-rules', icon: Sliders, roles: [ROLES.HR_PAYROLL_USER], badge: 'Engine' },
      ]
    },
    {
      title: 'INTELLIGENCE & COMMERCIAL',
      items: [
        { name: 'Analytics & Risk Hub', path: '/reports', icon: BarChart3, roles: [ROLES.HR_MANAGER, ROLES.HR_PAYROLL_USER], badge: 'AI Guard' },
        { name: 'B2B Client Portal', path: '/b2b-portal', icon: Building2, roles: [ROLES.ADMIN, ROLES.HR_PAYROLL_MANAGER], badge: 'B2B' },
        { name: 'Business Flow Portal', path: '/business-flow', icon: Workflow, roles: [ROLES.ADMIN, ROLES.HR_PAYROLL_MANAGER], badge: 'Flow' },
        { name: 'Business Model', path: '/business-model', icon: TrendingUp, roles: [ROLES.ADMIN, ROLES.HR_PAYROLL_MANAGER], badge: 'ROI' },
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Frame */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-600 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col border-r border-slate-200/80 shadow-xs`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-600/25">
              360
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">PeoplePay360</h1>
                <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-indigo-200">
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
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate whitespace-nowrap">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 whitespace-nowrap ${
                            item.badge === 'ROI'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
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
        <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs text-center">
            <div className="flex items-center justify-center space-x-1 text-[11px] font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enterprise Grade v2.4</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-center space-x-1">
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
