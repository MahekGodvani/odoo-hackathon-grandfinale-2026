import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import searchApi from '../../api/searchApi';
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
  X,
  Database,
  Tag,
  CornerDownLeft,
  Activity,
  ChevronRight
} from 'lucide-react';

/**
 * PEOPLEPAY360 - FORTUNE 500 ENTERPRISE HEADER
 * Features:
 * 1. Global Omnibar / Command Palette Search (Ctrl+K).
 * 2. Multi-Entity / Company Workspace Switcher.
 * 3. Fast Operational Workflow Launcher (`⚡ Quick Action`).
 * 4. Interactive Live Notifications Center.
 * 5. User Profile Menu & Credential-Locked Role Badge.
 */
const Header = ({ onMobileMenuOpen }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showEntityDropdown, setShowEntityDropdown] = useState(false);
  const [showQuickActionDropdown, setShowQuickActionDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showCommandSearch, setShowCommandSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTookMs, setSearchTookMs] = useState(0);
  const [searchAggregations, setSearchAggregations] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchEngineName, setSearchEngineName] = useState('ElasticSearch');
  const [selectedEntity, setSelectedEntity] = useState('PeoplePay360 Global (HQ - SF)');


  const roleColors = {
    [ROLES.HR_PAYROLL_MANAGER]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [ROLES.HR_PAYROLL_USER]: 'bg-blue-50 text-blue-700 border-blue-200',
    [ROLES.HR_MANAGER]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [ROLES.EMPLOYEE]: 'bg-slate-100 text-slate-700 border-slate-200',
    [ROLES.ADMIN]: 'bg-amber-50 text-amber-800 border-amber-200',
    'admin': 'bg-amber-50 text-amber-800 border-amber-200',
    'hr': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'payroll': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'employee': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const notifications = [
    { id: 1, title: 'Payrun Ready for Validation', time: '10m ago', type: 'info', path: '/payroll/payruns' },
    { id: 2, title: '2 Time Off Requests Pending Approval', time: '1h ago', type: 'warning', path: '/time-off/requests' },
    { id: 3, title: 'Contract Expiring: Marcus Vance', time: '3h ago', type: 'alert', path: '/contracts' },
  ];

  // Execute Elastic Search
  useEffect(() => {
    if (!showCommandSearch) return;

    let isMounted = true;
    setIsSearching(true);
    const delayTimer = setTimeout(() => {
      searchApi.search({ query: searchQuery, category: searchCategory, limit: 25 })
        .then((res) => {
          if (!isMounted) return;
          setSearchResults(res?.hits || []);
          setSearchTookMs(res?.tookMs || 3);
          setSearchAggregations(res?.aggregations || {});
          setSearchEngineName(res?.engine || 'ElasticSearch');
          setSelectedIndex(0);
          setIsSearching(false);
        })
        .catch((err) => {
          console.warn('Search query error:', err);
          setIsSearching(false);
        });
    }, 60);

    return () => {
      isMounted = false;
      clearTimeout(delayTimer);
    };
  }, [searchQuery, searchCategory, showCommandSearch]);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K) & Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandSearch((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandSearch(false);
      }
      if (showCommandSearch) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (searchResults.length > 0 ? (prev + 1) % searchResults.length : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (searchResults.length > 0 ? (prev - 1 + searchResults.length) % searchResults.length : 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (searchResults[selectedIndex]) {
            handleSelectHit(searchResults[selectedIndex]);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandSearch, searchResults, selectedIndex]);

  const handleSelectHit = (hit) => {
    setShowCommandSearch(false);
    setSearchQuery('');
    if (hit.external) {
      window.open(hit.external, '_blank');
    } else if (hit.path) {
      navigate(hit.path);
    }
  };

  const searchCategories = [
    { id: 'all', label: 'All Results' },
    { id: 'employees', label: 'Employees' },
    { id: 'payslips', label: 'Payslips' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaves', label: 'Time Off' },
    { id: 'modules', label: 'Modules' },
  ];

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
          {/* <div className="relative hidden md:block shrink-0">
            <button
              onClick={() => {
                setShowEntityDropdown(!showEntityDropdown);
                setShowRoleDropdown(false);
                setShowQuickActionDropdown(false);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate max-w-[130px] xl:max-w-[180px]">{selectedEntity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showEntityDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Operating Entity</p>
                </div>
                {entities.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => {
                      setSelectedEntity(ent.name);
                      setShowEntityDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs text-slate-700 cursor-pointer"
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
          </div> */}

          {/* Omnibar / Elastic Search Trigger Button */}
          <button
            onClick={() => setShowCommandSearch(true)}
            className="hidden sm:flex items-center justify-between space-x-2 px-3 py-1.5 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-slate-500 text-xs border border-indigo-200/70 transition-all cursor-pointer w-44 lg:w-56 xl:w-64 shrink-0 whitespace-nowrap shadow-xs hover:border-indigo-300"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-slate-700 text-[11px] font-medium truncate">Search...</span>
            </div>
          </button>
        </div>

        {/* Right side: Health Status, Quick Action, Notifications, Role Switcher & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Health Status Indicator (Only visible on wide screens to prevent crowding) */}
          {/* <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] font-semibold text-emerald-700 shrink-0 whitespace-nowrap">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="whitespace-nowrap">99.99% Systems Active</span>
          </div> */}

          {/* Fast Operational Action Launcher */}
          {/* <div className="relative hidden sm:block shrink-0">
            <button
              onClick={() => {
                setShowQuickActionDropdown(!showQuickActionDropdown);
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
          </div> */}

      

          {/* Static Credential-Locked Role Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 whitespace-nowrap shadow-2xs ${
              roleColors[role] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title={`Active Role: ${role} (Strictly bound to authenticated user credentials)`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0 text-current" />
            <span className="hidden sm:inline text-slate-500 font-semibold">Role:</span>
            <span className="whitespace-nowrap font-bold">{role}</span>
          </div>


              {/* Notifications Center */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setShowNotificationsDropdown(!showNotificationsDropdown);
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

      {/* ELASTIC SEARCH SPOTLIGHT / OMNIBAR MODAL (Ctrl + K) */}
      {showCommandSearch && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Search Input Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center space-x-3 bg-white">
              <Zap className="w-5 h-5 text-indigo-600 shrink-0 animate-pulse" />
              <input
                type="text"
                autoFocus
                placeholder="ElasticSearch employees, payslips, contracts, attendance, time off..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none bg-transparent"
              />
              {isSearching && (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setShowCommandSearch(false)}
                className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Elastic Engine Status & Category Filter Tabs */}
            <div className="bg-slate-50/80 px-3 sm:px-4 py-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              {/* Category Pills */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-full">
                {searchCategories.map((cat) => {
                  const count = searchAggregations[cat.id] ?? (cat.id === 'all' ? searchAggregations.all : 0);
                  const isSelected = searchCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSearchCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Elastic Search Engine Metric Badge */}
              <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ElasticSearch v2.4</span>
                <span className="text-emerald-500 font-mono text-[10px]">({searchTookMs}ms)</span>
              </div>
            </div>

            {/* Quick Keyword Pills for Fast Discovery */}
            {!searchQuery && (
              <div className="px-4 py-2.5 bg-indigo-50/40 border-b border-indigo-100/50 flex items-center space-x-2 overflow-x-auto text-xs">
                <span className="text-indigo-900 font-bold text-[11px] shrink-0 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Popular:</span>
                </span>
                {['Engineering', 'Alex Johnson', 'August Payslip', 'Active Contracts', 'Marcus Vance', 'Overtime'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2 py-0.5 rounded-md bg-white hover:bg-indigo-100/80 text-indigo-700 text-[11px] font-medium border border-indigo-200/60 transition-colors cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Hits List Results */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 max-h-[380px]">
              {searchResults.length > 0 ? (
                searchResults.map((hit, idx) => {
                  const isSelected = idx === selectedIndex;
                  const getCategoryMeta = (cat) => {
                    switch (cat) {
                      case 'employees':
                        return { label: 'Employee', bg: 'bg-indigo-100 text-indigo-700', icon: Users };
                      case 'payslips':
                        return { label: 'Payslip', bg: 'bg-emerald-100 text-emerald-700', icon: CreditCard };
                      case 'contracts':
                        return { label: 'Contract', bg: 'bg-amber-100 text-amber-700', icon: FileText };
                      case 'attendance':
                        return { label: 'Attendance', bg: 'bg-purple-100 text-purple-700', icon: Clock };
                      case 'leaves':
                        return { label: 'Time Off', bg: 'bg-rose-100 text-rose-700', icon: Calendar };
                      default:
                        return { label: 'Navigation', bg: 'bg-slate-100 text-slate-700', icon: LayoutDashboard };
                    }
                  };

                  const meta = getCategoryMeta(hit.category);
                  const IconComp = meta.icon;

                  return (
                    <button
                      key={hit.id || idx}
                      onClick={() => handleSelectHit(hit)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl text-left flex items-center justify-between transition-all group cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/90 border-l-4 border-indigo-600 shadow-xs'
                          : 'hover:bg-slate-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        {/* Avatar or Category Icon */}
                        {hit.avatar ? (
                          <img
                            src={hit.avatar}
                            alt={hit.title}
                            className="w-9 h-9 rounded-full border border-slate-200 object-cover shrink-0"
                          />
                        ) : (
                          <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center shrink-0`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                        )}

                        {/* Title & Subtitle */}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className="text-xs sm:text-sm font-bold text-slate-900 truncate"
                              dangerouslySetInnerHTML={{ __html: hit.highlight || hit.title }}
                            />
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${meta.bg} shrink-0`}>
                              {meta.label}
                            </span>
                            {hit.status && (
                              <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {hit.status}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{hit.subtitle}</p>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {hit.score && (
                          <span className="hidden md:inline-block text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            Relevance {Math.round(hit.score)}
                          </span>
                        )}
                        <span
                          className={`text-xs font-semibold flex items-center space-x-1 ${
                            isSelected ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'
                          }`}
                        >
                          <span className="hidden sm:inline text-[10px]">Select</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-10 text-center text-slate-400">
                  <Database className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No matching records found for "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Typo tolerance is active. Try searching by employee name, role, department, or payrun.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">↑</kbd>
                  <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">↓</kbd>
                  <span className="ml-1 text-slate-400">Navigate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">↵</kbd>
                  <span className="ml-1 text-slate-400">Jump</span>
                </span>
                <span className="flex items-center space-x-1">
                  <kbd className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-700">ESC</kbd>
                  <span className="ml-1 text-slate-400">Close</span>
                </span>
              </div>
              <span className="font-medium text-slate-400 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-indigo-500" />
                <span>{searchEngineName}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
