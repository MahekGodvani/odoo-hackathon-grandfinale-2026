import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  Zap,
  Award,
  CheckCircle2,
  Layers,
  ArrowRight,
  Calculator,
  Sparkles,
  Building2,
  Briefcase,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';

/**
 * PEOPLEPAY360 - INTERACTIVE BUSINESS MODEL & PRICING SUITE
 * High-impact investor-ready commercial strategy, live pricing matrix, and interactive ROI calculator.
 */
const BusinessModelPage = () => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'
  const [employeeCount, setEmployeeCount] = useState(65);
  const [payrollHoursPerMonth, setPayrollHoursPerMonth] = useState(24);
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing' | 'canvas' | 'roi' | 'competition'

  // Pricing calculations
  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1.0;

  // ROI Calculations in INR (₹)
  const hourlyRateHR = 650; // ₹650/hour average HR specialist cost
  const errorCorrectionCostPerMonth = 15000; // ₹15,000/month in compliance risk & manual error fixes
  const currentAnnualCost = (payrollHoursPerMonth * 12 * hourlyRateHR) + (errorCorrectionCostPerMonth * 12);

  // With PeoplePay360: 75% time reduction
  const newHoursPerMonth = Math.round(payrollHoursPerMonth * 0.25);
  const softwareCostAnnual = ((8999 + (employeeCount * 399)) * 12) * discountMultiplier;
  const newAnnualCost = (newHoursPerMonth * 12 * hourlyRateHR) + softwareCostAnnual;
  const annualSavings = Math.max(0, currentAnnualCost - newAnnualCost);
  const annualHoursSaved = (payrollHoursPerMonth - newHoursPerMonth) * 12;
  const paybackMonths = annualSavings > 0 ? ((softwareCostAnnual / annualSavings) * 12).toFixed(1) : '< 1';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-slate-900 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3 border border-indigo-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Commercial Strategy & Unit Economics</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">PeoplePay360 Business Model</h1>
            <p className="text-slate-600 mt-2 max-w-2xl text-sm leading-relaxed">
              An enterprise-grade B2B SaaS platform combining HR master records, time-tracking, and autonomous 2-step payroll computation with high-margin hybrid PEPM monetization.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2 text-slate-600" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-8 border-b border-slate-200 pt-2 overflow-x-auto pb-1">
          {[
            { id: 'pricing', label: 'Tiered Pricing & Add-ons', icon: DollarSign },
            { id: 'roi', label: 'Interactive ROI Calculator', icon: Calculator },
            { id: 'canvas', label: 'Business Model Canvas', icon: Layers },
            { id: 'competition', label: 'Competitive Moats', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all shrink-0 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PRICING MATRIX */}
      {activeTab === 'pricing' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Billing Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">Predictable Hybrid PEPM Pricing</h2>
              <p className="text-xs text-slate-500">Scale seamlessly with transparent per-employee-per-month licensing.</p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center space-x-1 ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tier 1: Starter */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300:border-slate-700 transition-all">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  Starter SMB
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-3">Essential HR</h3>
                <p className="text-xs text-slate-500 mt-1">Best for small businesses with 5–30 employees.</p>
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{Math.round(2999 * discountMultiplier).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ mo base</span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    + ₹{Math.round(249 * discountMultiplier)} / employee / mo
                  </p>
                </div>
                <ul className="space-y-2.5 mt-5 text-xs text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Up to 30 Employee Profiles</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Contracts & Standard Schedules</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Time Off Requests & Allocations</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Check-in/Out & Attendance</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> 1 Monthly Payrun + PDF Slips</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-800 text-xs font-bold transition-all">
                Get Started
              </button>
            </div>

            {/* Tier 2: Professional (Featured) */}
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-600 shadow-lg flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                Most Popular
              </div>
              <div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                  Growth
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-3">Professional</h3>
                <p className="text-xs text-slate-500 mt-1">Best for scaling companies with 30–250 employees.</p>
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{Math.round(8999 * discountMultiplier).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ mo base</span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    + ₹{Math.round(399 * discountMultiplier)} / employee / mo
                  </p>
                </div>
                <ul className="space-y-2.5 mt-5 text-xs text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Up to 250 Employee Profiles</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Dynamic Salary Rules Engine</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Unlimited Automated Payruns</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Bulk Payslip Email Distribution</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Pre-validation Warning Engine</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Priority 4-hour Support</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all">
                Start 14-Day Free Trial
              </button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300:border-slate-700 transition-all">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  Enterprise
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-3">Scale & Global</h3>
                <p className="text-xs text-slate-500 mt-1">Best for mid-to-large orgs with 250+ employees.</p>
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{Math.round(24999 * discountMultiplier).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ mo base</span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    + ₹{Math.round(599 * discountMultiplier)} / employee / mo
                  </p>
                </div>
                <ul className="space-y-2.5 mt-5 text-xs text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Unlimited Employees & Multi-Entity</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Custom Salary Computation Formulas</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Biometric Hardware & Kiosk API</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Custom Audit Trails & BI Exporter</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Dedicated Account Exec (1h SLA)</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-800 text-xs font-bold transition-all">
                Contact Enterprise Sales
              </button>
            </div>

            {/* Tier 4: Payroll Bureau / White-Label */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300:border-slate-700 transition-all">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                  Partner Edition
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-3">Payroll Bureau</h3>
                <p className="text-xs text-slate-500 mt-1">For accounting firms managing multiple client companies.</p>
                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{Math.round(49999 * discountMultiplier).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ mo base</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">
                    + ₹{Math.round(199 * discountMultiplier)} / client employee
                  </p>
                </div>
                <ul className="space-y-2.5 mt-5 text-xs text-slate-600">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Multi-Tenant Client Switching Hub</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Full White-Labeling (Logo & Domain)</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Batch Cross-Client Payrun Wizard</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> Client Portal Access for Approvals</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" /> 20% Recurring Partner Rev-Share</li>
                </ul>
              </div>
              <button className="w-full mt-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-800 text-xs font-bold transition-all">
                Become a Partner
              </button>
            </div>
          </div>

          {/* Value-Add Upsell Rails */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">High-Margin Expansion Revenue Streams (Fintech & AI Rails)</h3>
            <p className="text-xs text-slate-500 mb-4">Complementary monetization modules increasing Net Revenue Retention (NRR &gt; 130%).</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900">Direct Payout Rails</div>
                <div className="text-lg font-extrabold text-indigo-600 mt-1">₹15 <span className="text-xs font-normal text-slate-500">/ txn</span></div>
                <p className="text-[11px] text-slate-500 mt-1">1-click automated NEFT / IMPS / UPI salary disbursement.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900">Earned Wage Access</div>
                <div className="text-lg font-extrabold text-emerald-600 mt-1">1.50% <span className="text-xs font-normal text-slate-500">fee</span></div>
                <p className="text-[11px] text-slate-500 mt-1">On-demand earned pay with zero employer balance liability.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900">AI Payroll Auditor</div>
                <div className="text-lg font-extrabold text-purple-600 mt-1">₹99 <span className="text-xs font-normal text-slate-500">/ emp / mo</span></div>
                <p className="text-[11px] text-slate-500 mt-1">Detects overtime spikes, duplicate payments & tax drift.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-bold text-slate-900">Global Contractor EOR</div>
                <div className="text-lg font-extrabold text-amber-600 mt-1">₹1,999 <span className="text-xs font-normal text-slate-500">/ contractor</span></div>
                <p className="text-[11px] text-slate-500 mt-1">International contractor compliance & currency payouts.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ROI CALCULATOR */}
      {activeTab === 'roi' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Interactive Customer ROI & Efficiency Calculator</h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrate immediate cost reduction and time savings achieved by switching from manual spreadsheets or disjointed tools to PeoplePay360.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Sliders */}
              <div className="space-y-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Total Active Employees</label>
                    <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {employeeCount} Staff
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10 Employees</span>
                    <span>250</span>
                    <span>500 Employees</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Monthly HR / Payroll Hours Spent</label>
                    <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {payrollHoursPerMonth} Hours / mo
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={payrollHoursPerMonth}
                    onChange={(e) => setPayrollHoursPerMonth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>5 Hours</span>
                    <span>40 Hours</span>
                    <span>80 Hours</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="text-slate-500 flex justify-between">
                    <span>Calculated with Tier:</span>
                    <span className="font-semibold text-slate-900">Professional Plan (₹8,999 + ₹399/emp)</span>
                  </div>
                  <div className="text-slate-500 flex justify-between">
                    <span>Annual Software Investment:</span>
                    <span className="font-semibold text-slate-900">₹{Math.round(softwareCostAnnual).toLocaleString()} / yr</span>
                  </div>
                </div>
              </div>

              {/* ROI Results Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Annual Net Savings</span>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-2">
                    ₹{Math.round(annualSavings).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1">75% reduction in manual calculation & error rectification.</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Hours Saved Yearly</span>
                  <div className="text-3xl font-extrabold text-indigo-700 mt-2">
                    {annualHoursSaved} hrs
                  </div>
                  <p className="text-[11px] text-indigo-600 mt-1">Freed up for strategic talent development and culture.</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Payback Period</span>
                  <div className="text-3xl font-extrabold text-purple-700 mt-2">
                    {paybackMonths} mo
                  </div>
                  <p className="text-[11px] text-purple-600 mt-1">Rapid return on software investment.</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Estimated LTV : CAC</span>
                  <div className="text-3xl font-extrabold text-amber-700 mt-2">
                    5.8x
                  </div>
                  <p className="text-[11px] text-amber-600 mt-1">Industry-leading SaaS unit economic efficiency.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUSINESS MODEL CANVAS */}
      {activeTab === 'canvas' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">The 9-Pillar Business Model Canvas</h2>
            <p className="text-xs text-slate-500 mt-1">Structured architectural breakdown of PeoplePay360's operational and commercial engine.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
              {/* Key Partners */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">1. Key Partners</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Ecosystem Allies</h4>
                <ul className="mt-3 text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Cloud Infra (AWS/GCP)</li>
                  <li>Banking API Rails (ACH/NEFT)</li>
                  <li>Accounting Suites (Xero/QBO)</li>
                  <li>Certified Payroll Bureaus</li>
                </ul>
              </div>

              {/* Key Activities */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">2. Key Activities</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Core Operations</h4>
                <ul className="mt-3 text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Rule Computation R&D</li>
                  <li>Tax Compliance Engine</li>
                  <li>Platform Security (SOC2)</li>
                  <li>Inbound PLG & Sales</li>
                </ul>
              </div>

              {/* Value Propositions */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 lg:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">3. Value Proposition</span>
                <h4 className="text-xs font-bold text-indigo-950 mt-1">Unique Differentiation</h4>
                <ul className="mt-3 text-[11px] text-indigo-900 space-y-1.5 list-disc list-inside">
                  <li>Connected HR ➔ Payrun Flow</li>
                  <li>Zero-Error 2-Step Payrun</li>
                  <li>75% Time Reduction</li>
                  <li>Itemized PDF Invoices</li>
                </ul>
              </div>

              {/* Customer Relationships */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">4. Relationships</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Customer Touchpoints</h4>
                <ul className="mt-3 text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Self-Serve Onboarding</li>
                  <li>Dedicated Account Mgrs</li>
                  <li>Automated In-App Chat</li>
                  <li>Compliance Advisory</li>
                </ul>
              </div>

              {/* Customer Segments */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">5. Segments</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Target Market</h4>
                <ul className="mt-3 text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Startups (10-100 staff)</li>
                  <li>Mid-Market (100-2,500)</li>
                  <li>Payroll Bureaus</li>
                  <li>Multi-Branch Retail</li>
                </ul>
              </div>
            </div>

            {/* Bottom Row: Cost Structure & Revenue Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">6. Cost Structure</span>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>• Engineering & R&D (38%)</div>
                  <div>• Cloud & DB Infra (12%)</div>
                  <div>• Sales & Marketing (30%)</div>
                  <div>• Support & Legal (20%)</div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">7. Revenue Streams</span>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>• Monthly/Annual PEPM Subscriptions</div>
                  <div>• Fintech Payout Transaction Fees</div>
                  <div>• AI Payroll Auditor Add-on</div>
                  <div>• Partner Rev-Share & White-Label</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPETITIVE COMPARISON */}
      {activeTab === 'competition' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
            <h2 className="text-lg font-bold text-slate-900">Competitive Benchmark Matrix</h2>
            <p className="text-xs text-slate-500 mt-1">Why PeoplePay360 outperforms legacy desktop software and bloated legacy ERPs.</p>

            <table className="w-full text-left text-xs mt-6 border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700">Feature / Dimension</th>
                  <th className="p-3 font-bold text-slate-500">Legacy Desktop (Tally)</th>
                  <th className="p-3 font-bold text-slate-500">Generic HR (BambooHR)</th>
                  <th className="p-3 font-bold text-slate-500">Bloated ERP (SAP/Workday)</th>
                  <th className="p-3 font-bold text-indigo-600 bg-indigo-50/50">PeoplePay360</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Implementation Time</td>
                  <td className="p-3 text-slate-500">Weeks to Months</td>
                  <td className="p-3 text-slate-500">3 - 7 Days</td>
                  <td className="p-3 text-slate-500">6 - 12 Months</td>
                  <td className="p-3 font-bold text-emerald-600 bg-indigo-50/30">&lt; 30 Minutes (Self-serve)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Contract Period Auto-Resolution</td>
                  <td className="p-3 text-slate-500">Manual verification</td>
                  <td className="p-3 text-slate-500">Basic single contract</td>
                  <td className="p-3 text-slate-500">Requires ABAP custom code</td>
                  <td className="p-3 font-bold text-emerald-600 bg-indigo-50/30">Native Automated Matching</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Leave Allocation Auto-Consumption</td>
                  <td className="p-3 text-slate-500">Disconnected spreadsheet</td>
                  <td className="p-3 text-slate-500">Partial sync</td>
                  <td className="p-3 text-slate-500">Nightly batch job</td>
                  <td className="p-3 font-bold text-emerald-600 bg-indigo-50/30">Real-time Balance Deduction</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Salary Rule Sequence Engine</td>
                  <td className="p-3 text-slate-500">Hardcoded fixed fields</td>
                  <td className="p-3 text-slate-500">Limited predefined rules</td>
                  <td className="p-3 text-slate-500">Complex proprietary scripts</td>
                  <td className="p-3 font-bold text-emerald-600 bg-indigo-50/30">Visual Ordered Execution Engine</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Pre-Payrun Validation Warnings</td>
                  <td className="p-3 text-slate-500">None</td>
                  <td className="p-3 text-slate-500">Basic field checks</td>
                  <td className="p-3 text-slate-500">Post-execution error logs</td>
                  <td className="p-3 font-bold text-emerald-600 bg-indigo-50/30">Live Proactive Anomaly Alerts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessModelPage;
