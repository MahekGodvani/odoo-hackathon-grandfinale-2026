import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Users,
  CheckCircle2,
  Copy,
  ArrowRight,
  Shield,
  KeyRound,
  Check
} from 'lucide-react';
import Button from '../../components/common/Button';

/**
 * PEOPLEPAY360 - ENTERPRISE AUTHENTICATION & CREDENTIALS DIRECTORY
 * Strict Credential-Based RBAC:
 * Users authenticate using their assigned role credentials to access specific modules.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('jaimil.trivedi@peoplepay360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState('');

  // Official 5 Hackathon Roles Credentials Directory (Section 3 of Specification)
  const userCredentials = [
    {
      id: 'role-admin',
      name: 'Jaimil Trivedi',
      email: 'jaimil.trivedi@peoplepay360.com',
      role: ROLES.ADMIN,
      password: 'password123',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      scope: 'Admin • Full System & RBAC Access across all modules',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    },
    {
      id: 'role-hr-payroll-manager',
      name: 'Rahul Patel',
      email: 'rahul.patel@peoplepay360.com',
      role: ROLES.HR_PAYROLL_MANAGER,
      password: 'password123',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      scope: 'HR Payroll Manager • Full CRUD Payruns, Payslips, Rules',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 'role-hr-payroll-user',
      name: 'Neha Patel',
      email: 'neha.patel@peoplepay360.com',
      role: ROLES.HR_PAYROLL_USER,
      password: 'password123',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      scope: 'HR Payroll User • Payrun Ops • Read-Only Structures & Rules',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      id: 'role-hr-manager',
      name: 'Amit Shah',
      email: 'amit.shah@peoplepay360.com',
      role: ROLES.HR_MANAGER,
      password: 'password123',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      scope: 'HR Manager • Employees, Contracts, Schedules, Time Off (No Payroll)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 'role-employee',
      name: 'Priya Shah',
      email: 'priya.shah@peoplepay360.com',
      role: ROLES.EMPLOYEE,
      password: 'password123',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      scope: 'Employee • Self-Service, Kiosk Check-In/Out, Own Leaves & Payslips',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await login(email, password);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Access denied.');
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMsg('');
  };

  const handleCopyEmail = (e, accEmail) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(accEmail);
    setCopiedEmail(accEmail);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12">
        {/* =================================================================== */}
        {/* LEFT COLUMN: SIGN IN FORM                                           */}
        {/* =================================================================== */}
        <div className="p-8 sm:p-10 lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            {/* Brand Logo & Heading */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-600/30">
                360
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">PeoplePay360</h1>
                <p className="text-xs text-slate-500 font-medium">Enterprise HR & Payroll Platform</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Role access is strictly derived from your authenticated login credentials.
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@peoplepay360.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Demo: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full py-3 text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
              >
                <span>Authenticate & Sign In  </span>
               
              </Button>
            </form>
          </div>

          {/* Security Notice Footer */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-start space-x-2 text-slate-500 text-[11px] leading-normal">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700">Strict RBAC Enforced:</strong> Dynamic header role switching is permanently removed. You must log in with each user's credentials to assume their role privileges.
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: REGISTERED USER CREDENTIALS DIRECTORY                 */}
        {/* =================================================================== */}
        <div className="p-8 sm:p-10 lg:col-span-7 bg-slate-50/60 flex flex-col justify-between">
          <div className="space-y-4">
            

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {userCredentials.map((acc) => {
                const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectAccount(acc)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{acc.name}</p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">{acc.email}</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border shrink-0 ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]" title={acc.scope}>
                          {acc.scope}
                        </p>
                        <p className="text-[10px] font-mono font-semibold text-slate-700">
                          PW: <span className="text-indigo-600 font-bold">{acc.password}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleCopyEmail(e, acc.email)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                        title="Copy email address"
                      >
                        {copiedEmail === acc.email ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 flex items-center text-indigo-600">
                        <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Click any persona card to auto-populate email & password</span>
            <span className="font-mono text-indigo-600 font-bold">PeoplePay360 RBAC v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
