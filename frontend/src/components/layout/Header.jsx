import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  UserPlus,
  Users,
  LayoutDashboard,
  Calendar,
  Layers,
  Sliders,
  BarChart3,
  TrendingUp,
  ExternalLink,
  Command,
  X
} from 'lucide-react';

/**
 * PEOPLEPAY360 - FORTUNE 500 ENTERPRISE HEADER
 * Features:
 * 1. Global Omnibar / Command Palette Search (Ctrl+K).
 * 2. Multi-Entity / Company Workspace Switcher.
 * 3. Fast Operational Workflow Launcher (`⚡ Quick Action`).
 * 4. Interactive Live Notifications Center.
 * 5. Role Switcher & User Profile Menu.
 */
const Header = ({ onMobileMenuOpen }) => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showEntityDropdown, setShowEntityDropdown] = useState(false);
  const [showQuickActionDropdown, setShowQuickActionDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showCommandSearch, setShowCommandSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('PeoplePay360 Global (HQ - SF)');

  const entities = [
    { id: 'hq', name: 'PeoplePay360 Global (HQ - SF)', region: 'North America (USD)', count: '142 Staff' },
    { id: 'eu', name: 'PeoplePay360 Europe BV (London)', region: 'EMEA (GBP / EUR)', count: '48 Staff' },
    { id: 'apac', name: 'PeoplePay360 APAC Ltd. (Singapore)', region: 'APAC (SGD / INR)', count: '65 Staff' },
  ];

  const roleColors = {
    [ROLES.HR_PAYROLL_MANAGER]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [ROLES.HR_PAYROLL_USER]: 'bg-blue-50 text-blue-700 border-blue-200',
    [ROLES.HR_MANAGER]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [ROLES.EMPLOYEE]: 'bg-slate-100 text-slate-700 border-slate-200',
    [ROLES.ADMIN]: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  const notifications = [
    { id: 1, title: 'Payrun Ready for Validation', time: '10m ago', type: 'info', path: '/payroll/payruns' },
    { id: 2, title: '2 Time Off Requests Pending Approval', time: '1h ago', type: 'warning', path: '/time-off/requests' },
    { id: 3, title: 'Contract Expiring: Marcus Vance', time: '3h ago', type: 'alert', path: '/contracts' },
  ];

  const commandItems = [
    { name: 'Dashboard Overview', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Employee Master Directory', category: 'HR Operations', icon: Users, path: '/employees' },
    { name: 'Contracts & Wages', category: 'HR Operations', icon: FileText, path: '/contracts' },
    { name: 'Working Schedules (40h)', category: 'HR Operations', icon: Calendar, path: '/schedules' },
    { name: 'Attendance & Clock-in Kiosk', category: 'HR Operations', icon: Clock, path: '/attendance' },
    { name: 'Time Off & Allocations', category: 'HR Operations', icon: Clock, path: '/time-off/requests' },
    { name: 'Payrun 2-Step Wizard', category: 'Payroll Engine', icon: CreditCard, path: '/payroll/payruns' },
    { name: 'Payslips & PDF Generation', category: 'Payroll Engine', icon: FileText, path: '/payroll/payslips' },
    { name: 'Salary Rules & Computation Engine', category: 'Payroll Engine', icon: Sliders, path: '/payroll/salary-rules' },
    { name: 'Business Model & ROI Calculator', category: 'Commercial', icon: TrendingUp, path: '/business-model' },
    { name: 'Swagger REST API Docs', category: 'Developer', icon: ExternalLink, external: 'http://localhost:5000/api-docs' },
  ];

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandSearch((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = commandItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommand = (cmd) => {
    setShowCommandSearch(false);
    setSearchQuery('');
    if (cmd.external) {
      window.open(cmd.external, '_blank');
    } else {
      navigate(cmd.path);
    }
  };

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-xs gap-2 min-w-0">
        {/* Left side: Mobile Toggle, Multi-Entity Picker & Search Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink">
          <button
            onClick={onMobileMenuOpen}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Multi-Entity Switcher */}
          <div className="relative hidden md:block shrink-0">
            <button
              onClick={() => {
                setShowEntityDropdown(!showEntityDropdown);
                setShowRoleDropdown(false);
                setShowQuickActionDropdown(false);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-900 truncate max-w-[110px] lg:max-w-[160px] xl:max-w-[200px]">{selectedEntity}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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
                    {selectedEntity === ent.name && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Omnibar / Command Search Trigger Button */}
          <button
            onClick={() => setShowCommandSearch(true)}
            className="hidden sm:flex items-center justify-between space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-400 text-xs border border-slate-200 transition-all cursor-pointer w-40 lg:w-52 xl:w-60 shrink-0 whitespace-nowrap"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-500 text-[11px] font-medium truncate">Search or jump to...</span>
            </div>
            <kbd className="hidden lg:inline-block ml-1 text-[10px] font-mono bg-white border border-slate-300 px-1.5 py-0.2 rounded text-slate-600 font-semibold shadow-xs shrink-0">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: Health Status, Quick Action, Notifications, Role Switcher & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Health Status Indicator (Only visible on wide screens to prevent crowding) */}
          <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700 shrink-0 whitespace-nowrap">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="whitespace-nowrap">99.99% Systems Active</span>
          </div>

          {/* Fast Operational Action Launcher */}
          <div className="relative hidden sm:block shrink-0">
            <button
              onClick={() => {
                setShowQuickActionDropdown(!showQuickActionDropdown);
                setShowRoleDropdown(false);
                setShowEntityDropdown(false);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/30 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Quick Action</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
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
                    navigate('/attendance');
                    setShowQuickActionDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center space-x-2.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Log Attendance / Clock-In</span>
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
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
                setShowRoleDropdown(false);
                setShowEntityDropdown(false);
                setShowQuickActionDropdown(false);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors cursor-pointer shrink-0"
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
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowEntityDropdown(false);
                setShowQuickActionDropdown(false);
                setShowNotificationsDropdown(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                roleColors[role] || 'bg-slate-100 text-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Role:</span>
              <span className="whitespace-nowrap">{role}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70 shrink-0" />
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
          <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`}
              alt={user?.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4f46e5&color=fff&bold=true&rounded=true`;
              }}
              className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-xs shrink-0"
            />
            <div className="hidden xl:block text-left min-w-0">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-0.5 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* SPOTLIGHT / COMMAND PALETTE MODAL (Ctrl + K) */}
      {showCommandSearch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-100">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center space-x-3">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a module name or action (e.g. Payruns, Attendance, Contracts)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
              />
              <button
                onClick={() => setShowCommandSearch(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Command List Results */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCommand(cmd)}
                    className="w-full p-3 rounded-xl hover:bg-indigo-50/80 text-left flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                        <cmd.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">{cmd.name}</p>
                        <p className="text-[10px] text-slate-400">{cmd.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-indigo-600 flex items-center space-x-1">
                      <span>Jump to</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching module or action found for "{searchQuery}".
                </div>
              )}
            </div>

            {/* Footer Tip */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Press <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-slate-600">ESC</kbd> to close</span>
              <span>PeoplePay360 Global Navigation</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
