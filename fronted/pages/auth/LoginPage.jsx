import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../../components/common/Button';

/**
 * PEOPLEPAY360 - LOGIN PAGE
 * Enforces valid credential authentication against the user database API.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('rahul.patel@peoplepay360.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample registered accounts for quick demo filling
  const sampleAccounts = [
    { name: 'Rahul Patel (HR Payroll Manager)', email: 'rahul.patel@peoplepay360.com', role: 'HR Payroll Manager' },
    { name: 'Amit Shah (HR Manager)', email: 'amit.shah@peoplepay360.com', role: 'HR Manager' },
    { name: 'Neha Patel (HR Payroll User)', email: 'neha.patel@peoplepay360.com', role: 'HR Payroll User' },
    { name: 'Priya Shah (Employee)', email: 'priya.shah@peoplepay360.com', role: 'Employee' },
    { name: 'Karan Mehta (System Admin)', email: 'karan.mehta@peoplepay360.com', role: 'Admin' },
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

  const handleSelectAccount = (accEmail) => {
    setEmail(accEmail);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Subtle Accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 relative z-10">
        {/* Brand Banner */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            360
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PeoplePay360</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">HR & Payroll Operational Suite</p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Password input with toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Account Preset Selector for Presentation Convenience */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Fill Registered Demo Credentials:
            </label>
            <select
              onChange={(e) => handleSelectAccount(e.target.value)}
              value={email}
              className="w-full bg-white border border-slate-300 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-slate-800 focus:outline-none"
            >
              {sampleAccounts.map((acc) => (
                <option key={acc.email} value={acc.email}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full py-3 text-sm font-semibold rounded-xl"
          >
            Authenticate & Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
