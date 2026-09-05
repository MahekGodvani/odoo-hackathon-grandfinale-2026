import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  Menu,
  LogOut,
  Shield,
  ChevronDown,
  Building2,
  Bell,
  Search,
  Plus,
  Zap,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  CreditCard,
  UserPlus
} from 'lucide-react';

/**
 * PEOPLEPAY360 - ENTERPRISE TOP HEADER COMPONENT
 * Fortune 500 UX with Multi-Entity Workspace Switcher, System Health, Quick Action Launcher,
 * Live Actionable Notifications, and Seamless Role Switching.
 */
const Header = ({ onMobileMenuOpen }) => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showEntityDropdown, setShowEntityDropdown] = useState(false);
  const [showQuickActionDropdown, setShowQuickActionDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState('PeoplePay360 Global (HQ - SF)');

  const entities = [
    { id: 'hq', name: 'PeoplePay360 Global (HQ - SF)', region: 'North America (USD)', count: '142 Staff' },
    { id: 'eu', name: 'PeoplePay360 Europe BV (London)', region: 'EMEA (GBP / EUR)', count: '48 Staff' },
    { id: 'apac', name: 'PeoplePay360 APAC Ltd. (Singapore)', region: 'APAC (SGD / INR)', count: '65 Staff' },
  ];

  const roleColors = {
    [ROLES.HR_PAYROLL_MANAGER]: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    [ROLES.HR_PAYROLL_USER]: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    [ROLES.HR_MANAGER]: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    [ROLES.EMPLOYEE]: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    [ROLES.ADMIN]: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  };

  const notifications = [
    { id: 1, title: 'Payrun Ready for Validation', time: '10m ago', type: 'info', path: '/payroll/payruns' },
    { id: 2, title: '2 Time Off Requests Pending Approval', time: '1h ago', type: 'warning', path: '/time-off/requests' },
    { id: 3, title: 'Contract Expiring: Marcus Vance', time: '3h ago', type: 'alert', path: '/contracts' },
  ];

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left side: Mobile Toggle, Multi-Entity Picker & Health Pulse */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Multi-Entity / Company Workspace Switcher */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowEntityDropdown(!showEntityDropdown);
              setShowRoleDropdown(false);
              setShowQuickActionDropdown(false);
              setShowNotificationsDropdown(false);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-slate-900 truncate max-w-[200px]">{selectedEntity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showEntityDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Operating Entity</p>
              </div>
              {entities.map((ent) => (
                <button
                  key={ent.id}
                  onClick={() => {
                    setSelectedEntity(ent.name);
                    setShowEntityDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedEntity === ent.name ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{ent.name}</p>
                    <p className="text-[10px] text-slate-400">{ent.region} • {ent.count}</p>
                  </div>
                  {selectedEntity === ent.name && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enterprise Live System Status Indicator */}
        <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>99.99% Systems Operational • SOC-2 Type II</span>
        </div>
      </div>

      {/* Right side: Quick Action, Notifications, Role Switcher & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Global Action Launcher */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => {
              setShowQuickActionDropdown(!showQuickActionDropdown);
              setShowRoleDropdown(false);
              setShowEntityDropdown(false);
              setShowNotificationsDropdown(false);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Action</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showQuickActionDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fast Operational Workflows</p>
              </div>
              <button
                onClick={() => {
                  navigate('/payroll/payruns');
                  setShowQuickActionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Launch Payrun Wizard</span>
              </button>
              <button
                onClick={() => {
                  navigate('/employees');
                  setShowQuickActionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>Add New Employee</span>
              </button>
              <button
                onClick={() => {
                  navigate('/time-off/requests');
                  setShowQuickActionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2.5 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Request Time Off</span>
              </button>
              <button
                onClick={() => {
                  navigate('/business-model');
                  setShowQuickActionDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2.5 transition-colors cursor-pointer border-t border-slate-100"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>View Business Model & ROI</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationsDropdown(!showNotificationsDropdown);
              setShowRoleDropdown(false);
              setShowEntityDropdown(false);
              setShowQuickActionDropdown(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
          </button>

          {showNotificationsDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-900">Notifications & Alerts</p>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      navigate(notif.path);
                      setShowNotificationsDropdown(false);
                    }}
                    className="w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start space-x-3 cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{notif.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Presentation Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowEntityDropdown(false);
              setShowQuickActionDropdown(false);
              setShowNotificationsDropdown(false);
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              roleColors[role] || 'bg-slate-100 text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Role:</span>
            <span>{role}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role-Based Access Control</p>
              </div>
              {Object.values(ROLES).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    role === r ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar & Logout */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`}
            alt={user?.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`;
            }}
            className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-xs"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
