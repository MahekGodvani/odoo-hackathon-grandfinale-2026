import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  CreditCard,
  FileText,
  Clock,
  Briefcase,
  Layers,
  Sliders,
  DollarSign,
  TrendingUp,
  Award,
  ChevronRight,
  Play,
  Check,
  Building2,
  Lock,
  Globe,
  Star,
  ExternalLink,
  Laptop,
  Menu,
  X
} from 'lucide-react';

/**
 * PEOPLEPAY360 - ENTERPRISE MARKETING & PRODUCT LANDING PAGE
 * High-converting, Fortune 500 aesthetic showcase of the connected HR & Payroll operational flow.
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const { loginWithRole } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState('payrun');

  const handleQuickLaunchRole = async (targetRole) => {
    if (loginWithRole) {
      await loginWithRole(targetRole);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Fixed Top Navigation Bar (Always Visible on Scroll) */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-500/25">
              360
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">PeoplePay360</span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  PRO
                </span>
              </div>
              <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">HR & Payroll Suite</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Core Features</a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">2-Step Payrun Flow</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing & ROI</a>
            <Link to="/business-model" className="hover:text-indigo-600 transition-colors flex items-center space-x-1 text-amber-700 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Business Model</span>
            </Link>
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors flex items-center space-x-1">
              <span>Swagger API</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs"
            >
              Sign In
            </Link>
            <button
              onClick={() => handleQuickLaunchRole(ROLES.ADMIN)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Live App</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden border border-slate-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-lg">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Core Features
            </a>
            <a
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              2-Step Payrun Flow
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Pricing & ROI
            </a>
            <Link
              to="/business-model"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              Business Model & Strategy
            </Link>
            <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
              <Link
                to="/login"
                className="flex-1 py-2 rounded-xl text-xs font-bold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
              >
                Sign In
              </Link>
              <button
                onClick={() => handleQuickLaunchRole(ROLES.ADMIN)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-center bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION WITH TOP PADDING FOR FIXED NAVBAR */}
      <section className="relative pt-32 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[250px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Grand Finale Edition • The Autonomous HR & Payroll Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            The Unified Engine for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              HR Master Data & Payroll
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate fragmented spreadsheets, contract confusion, and calculation errors. Seamlessly transform employee contracts, working schedules, attendance logs, and approved leave balances into verified, audit-ready payslips.
          </p>

          {/* Quick Demo Role Launch Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleQuickLaunchRole(ROLES.ADMIN)}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
            >
              <span>Explore as Admin (Jaimil)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleQuickLaunchRole(ROLES.HR_PAYROLL_MANAGER)}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 hover:border-slate-300 shadow-2xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>HR Payroll Officer</span>
            </button>
            <Link
              to="/business-model"
              className="px-5 py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-sm border border-amber-200 shadow-2xs transition-all flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Business Model & ROI</span>
            </Link>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-extrabold text-slate-900">99.98%</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Calculation Precision</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-extrabold text-emerald-600">75%</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Processing Time Saved</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-extrabold text-indigo-600">2-Step</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Zero-Error Payrun Wizard</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-extrabold text-amber-600">SOC-2</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Enterprise Compliant</p>
            </div>
          </div>
        </div>

        {/* Live Product Showcase Dashboard Mockup Frame */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-2.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200/80 border border-slate-300 shadow-xl">
          <div className="rounded-xl bg-white overflow-hidden border border-slate-200 shadow-inner">
            {/* Window bar */}
            <div className="h-10 bg-slate-50 px-4 flex items-center justify-between border-b border-slate-200 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-slate-500">peoplepay360.internal/dashboard</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Production Sync</span>
                </span>
              </div>
            </div>

            {/* Mockup Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Left Widget: Connected Flow */}
              <div className="space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">HR ➔ Payroll Engine</span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Automated</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <span className="text-slate-700 font-medium">1. Active Contract Resolution</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <span className="text-slate-700 font-medium">2. Attendance & 40h Schedules</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                    <span className="text-slate-700 font-medium">3. Time Off Allocation Deduction</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-between font-bold text-indigo-800 shadow-2xs">
                    <span>4. Net Payslips & PDF Generation</span>
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Center Widget: Live Payrun Simulation */}
              <div className="md:col-span-2 space-y-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Payrun Batch #PAY-2026-09</h3>
                    <p className="text-[10px] text-slate-500">Regular Salary Structure • Sep 01 - Sep 30, 2026</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Validated & Paid
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Total Net Disbursed</p>
                    <p className="text-lg font-extrabold text-slate-900 mt-1">₹3,85,000.00</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Processed Slips</p>
                    <p className="text-lg font-extrabold text-indigo-600 mt-1">6 / 6 Staff</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Validation Warnings</p>
                    <p className="text-lg font-extrabold text-emerald-600 mt-1">0 Detected</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                  <span className="text-indigo-900 font-medium">Ready for instant A4 PDF export & bulk employee email dispatch.</span>
                  <button
                    onClick={() => navigate('/payroll/payruns')}
                    className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                  >
                    View Batch
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE OPERATIONAL MODULES */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Complete Enterprise Coverage</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">6 Connected Modules. 1 Single Source of Truth.</h3>
            <p className="text-sm text-slate-500 mt-3">
              Most tools force you to integrate 5 different point solutions. PeoplePay360 handles the full lifecycle natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Employee Hub */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">360° Employee Master Hub</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Kanban and list views with smart-button actions linking directly to related Contracts, Attendance logs, Time Off balances, and Allocations.
              </p>
            </div>

            {/* Feature 2: Contract Management */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Period-Active Contracts</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maintain comprehensive historical employment contracts while ensuring payroll computations process only the active contract valid for the specific period.
              </p>
            </div>

            {/* Feature 3: Attendance & Web Kiosk */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Live Kiosk & Overtime</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                1-click digital clock-in kiosk with active stopwatch, GPS geofencing verification, overtime auto-detection, and manual correction approval workflows.
              </p>
            </div>

            {/* Feature 4: Time Off & Allocations */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Leave Allocations & Deductions</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Configurable leave policies with manager approval for balance allocations. Approved leave requests automatically decrement balances in real-time.
              </p>
            </div>

            {/* Feature 5: Dynamic Salary Rules */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Visual Salary Rule Engine</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Ordered sequence execution calculating Basic, HRA, Transport, Gross, PF/Tax Deductions, and Net salary with support for fixed, percentage, and formula rules.
              </p>
            </div>

            {/* Feature 6: 2-Step Payrun & Payslips */}
            <div className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">2-Step Payrun & PDF Slips</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Scope setup ➔ explicit staff selection wizard. Lifecycle controls (Compute ➔ Validate ➔ Mark Paid ➔ Send Slips) with clean printable A4 invoice PDFs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-STEP WORKFLOW WALKTHROUGH */}
      <section id="workflow" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                The 2-Step Operational Workflow
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4">
                How Payruns Turn Master Data Into Validated Payslips
              </h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Traditional tools create payslips in dark silos. PeoplePay360's two-step wizard gives payroll officers full visibility, pre-validation error detection, and audit certainty before finalizing funds.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Step 1: Define Scope & Salary Structure</h5>
                    <p className="text-[11px] text-slate-500">Select payroll period dates and target salary structure (e.g. Regular Salary).</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Step 2: Explicit Eligible Staff Selection</h5>
                    <p className="text-[11px] text-slate-500">Filter active staff and select only intended employees for the payroll batch.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Compute ➔ Pre-Validation Alerts ➔ 1-Click Pay</h5>
                    <p className="text-[11px] text-slate-500">System validates missing bank details, active contracts, and calculates itemized net earnings.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/payroll/payruns')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  Test Payrun Wizard in Live Demo
                </button>
              </div>
            </div>

            {/* Step Visual Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-900">Payrun Processing Pipeline</span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">PAYRUN #901</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 rounded bg-white text-slate-600 border border-slate-200">1. Draft</div>
                <div className="p-2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">2. Computed</div>
                <div className="p-2 rounded bg-white text-slate-600 border border-slate-200">3. Validated</div>
                <div className="p-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">4. Paid</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2 shadow-2xs">
                <div className="flex justify-between text-slate-600">
                  <span>Target Structure:</span>
                  <span className="font-semibold text-slate-900">Regular Salary (REG-SAL)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Applicable Contract:</span>
                  <span className="font-semibold text-emerald-700">EMP-1001 (Active Period Contract)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Attendance & Worked Days:</span>
                  <span className="font-semibold text-slate-900">22 Days (176 hrs logged)</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                  <span>Computed Net Salary:</span>
                  <span className="text-indigo-600 font-mono text-sm">₹62,500.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & ROI SUMMARY LINK */}
      <section id="pricing" className="py-20 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">Commercial Flexibility</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Transparent Hybrid PEPM Pricing (INR)</h3>
            <p className="text-sm text-slate-500 mt-3">
              Predictable, scalable plans designed for small businesses, high-growth mid-market, and outsourced payroll bureaus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Starter SMB</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">Essential HR</h4>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">₹2,999 <span className="text-xs font-normal text-slate-500">/ mo + ₹249/emp</span></p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Up to 30 Staff</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Contracts & Attendance</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Time Off Requests</li>
                </ul>
              </div>
              <Link to="/business-model" className="mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center block transition-colors">
                View Pricing Details
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-indigo-600 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs">
                Most Popular
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Growth</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">Professional</h4>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">₹8,999 <span className="text-xs font-normal text-slate-500">/ mo + ₹399/emp</span></p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Up to 250 Staff</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Dynamic Salary Rule Engine</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Unlimited Payrun Batches</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Bulk PDF Email Distribution</li>
                </ul>
              </div>
              <Link to="/business-model" className="mt-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center block shadow-md shadow-indigo-600/25 transition-colors">
                Calculate Live ROI
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scale</span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">Enterprise</h4>
                <p className="text-2xl font-extrabold text-slate-900 mt-3">₹24,999 <span className="text-xs font-normal text-slate-500">/ mo + ₹599/emp</span></p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Unlimited Multi-Entity Staff</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Custom Formulas & Biometric Sync</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 text-emerald-600 mr-2" /> Dedicated Account Exec (1h SLA)</li>
                </ul>
              </div>
              <Link to="/business-model" className="mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center block transition-colors">
                View Enterprise SLA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              360
            </div>
            <span className="font-bold text-slate-800">PeoplePay360 HR & Payroll</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
            <Link to="/payroll/payruns" className="hover:text-indigo-600 transition-colors">Payruns</Link>
            <Link to="/business-model" className="hover:text-indigo-600 transition-colors">Business Model</Link>
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">
              API Docs
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            Authored by <span className="text-slate-700 font-semibold">Jaimil Trivedi</span> • Grand Finale Hackathon Edition
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
