import React, { useState } from 'react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Menu, LogOut, Shield, ChevronDown, User } from 'lucide-react';

/**
 * PEOPLEPAY360 - TOP HEADER COMPONENT
 * Features role badge, quick presentation role switcher, user profile, and mobile drawer toggle.
 */
const Header = ({ onMobileMenuOpen }) => {
  const { user, role, switchRole, logout } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleColors = {
    [ROLES.HR_PAYROLL_MANAGER]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [ROLES.HR_PAYROLL_USER]: 'bg-blue-100 text-blue-800 border-blue-200',
    [ROLES.HR_MANAGER]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    [ROLES.EMPLOYEE]: 'bg-slate-100 text-slate-800 border-slate-200',
    [ROLES.ADMIN]: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left side: Mobile Toggle & Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 font-medium">Enterprise HR & Payroll Operational Suite</p>
        </div>
      </div>

      {/* Right side: Role Switcher & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Quick Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              roleColors[role] || 'bg-slate-100 text-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Role: {role}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Quick Switch Role for Demo</p>
              </div>
              {Object.values(ROLES).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    role === r ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
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
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500">{user?.email}</p>
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
