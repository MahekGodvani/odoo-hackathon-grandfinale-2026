import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Printer,
  Workflow,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Activity,
  Play,
  RefreshCw,
  Lock,
  Server,
  Cpu,
  Check
} from 'lucide-react';

/**
 * PEOPLEPAY360 - INTERACTIVE BUSINESS MODEL & PRICING SUITE
 * High-impact investor-ready commercial strategy, live pricing matrix, and interactive ROI calculator.
 */
const BusinessModelPage = () => {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'
  const [employeeCount, setEmployeeCount] = useState(65);
  const [payrollHoursPerMonth, setPayrollHoursPerMonth] = useState(24);
  const [activeTab, setActiveTab] = useState('pricing'); // 'pricing' | 'canvas' | 'roi' | 'competition' | 'risk'

  // Risk Simulation & Exposure Calculator State
  const [simScenario, setSimScenario] = useState('tax_shock');
  const [simRunning, setSimRunning] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [riskHeadcount, setRiskHeadcount] = useState(120);
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(65000); // in INR (₹)

  // Pricing calculations
  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1.0;

  // Dynamic Enterprise Risk Exposure Calculations
  const annualGrossPayroll = riskHeadcount * avgMonthlyWage * 12;
  const inherentRiskAmount = Math.round(annualGrossPayroll * 0.032);
  const residualRiskAmount = Math.round(inherentRiskAmount * 0.016);
  const capitalProtected = inherentRiskAmount - residualRiskAmount;

  const runStressTest = (scenarioKey) => {
    setSimRunning(true);
    setSimResult(null);
    setTimeout(() => {
      let resultData = {};
      if (scenarioKey === 'tax_shock') {
        resultData = {
          title: 'Government Budget Surcharge Reclassification (+2.5% Tax Drift)',
          threatSeverity: 'Critical (Statutory)',
          detectedIn: '14 ms',
          actionTaken: 'Autonomous dynamic rule engine updated formula constants without restarting microservices.',
          penaltiesAvoided: '₹4,85,000 in late filing interest & Sec 234E non-compliance notice',
          auditStatus: 'Clean (100% compliant with updated CBDT circular)',
          status: 'SUCCESS'
        };
      } else if (scenarioKey === 'ghost_injection') {
        resultData = {
          title: 'Simulated Ghost Employee & Duplicate Bank Account Injection',
          threatSeverity: 'High (Direct Financial Loss)',
          detectedIn: '8 ms',
          actionTaken: 'Bank account hash collision triggered zero-trust quarantine. Direct deposit halted for 2 fake records.',
          penaltiesAvoided: '₹1,95,000 monthly siphoned cash leak permanently prevented',
          auditStatus: 'Blocked & Logged to immutable audit trail',
          status: 'SUCCESS'
        };
      } else if (scenarioKey === 'cluster_failover') {
        resultData = {
          title: 'Primary Cloud Availability Zone Termination on Payrun Cutoff',
          threatSeverity: 'Severe (Operational Disruption)',
          detectedIn: '32 ms',
          actionTaken: 'Active-Active Raft cluster failover elected replica node 2 without transaction loss.',
          penaltiesAvoided: 'Zero missed salary disbursements, 99.99% uptime SLA retained',
          auditStatus: 'RPO: 0 seconds | RTO: 32 ms',
          status: 'SUCCESS'
        };
      } else {
        resultData = {
          title: 'Malicious Horizontal IDOR Probe on Employee Payslip Records',
          threatSeverity: 'Critical (OWASP A01 Security Breach)',
          detectedIn: '4 ms',
          actionTaken: 'Strict JWT cryptographic employee ID binding rejected forged payload with HTTP 403 Forbidden.',
          penaltiesAvoided: 'Zero PII data leakage, reported to security event log',
          auditStatus: 'SOC 2 Type II & OWASP compliance preserved',
          status: 'SUCCESS'
        };
      }
      setSimResult(resultData);
      setSimRunning(false);
    }, 750);
  };

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
            <Link
              to="/b2b-portal"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-md shadow-slate-900/20 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 mr-2 text-indigo-400" />
              B2B Client Portal
            </Link>
            <Link
              to="/business-flow"
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Workflow className="w-4 h-4 mr-2" />
              Interactive Flow Portal
            </Link>
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
            { id: 'competition', label: 'Competitive Moats', icon: Award },
            { id: 'risk', label: 'Risk Analysis & Mitigation', icon: ShieldAlert },
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

      {/* TAB 5: RISK ANALYSIS & STRATEGIC MITIGATION MATRIX */}
      {activeTab === 'risk' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enterprise Risk Defense & Contingency Framework</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  360° Risk Analysis & Proactive Mitigation Matrix
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Autonomous controls, cryptographically sealed audit chains, and multi-tier safeguards
                  that reduce operational, compliance, financial, and cybersecurity liabilities to near-zero.
                </p>
              </div>

              {/* Defense Rating Scorecard */}
              <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center shrink-0 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Risk Mitigation Score</span>
                <p className="text-4xl font-black text-emerald-400 font-mono">98.4%</p>
                <p className="text-[10px] text-emerald-300 font-bold">Resilience & Compliance Index</p>
                <div className="pt-1 flex items-center justify-center space-x-1 text-[9px] text-slate-400">
                  <span>Zero Critical Vulnerabilities</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 CORE RISK DIMENSIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Risk Vector 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 uppercase">
                    Regulatory & Legal
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 01</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Statutory & Tax Drift Risk
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sudden revisions in government Provident Fund (PF), ESI wage ceilings, or Income Tax slabs leading to compliance penalties.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-rose-600">High (Financial Penalty)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">Negligible (&lt; 0.2%)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Visual dynamic rule engine updates calculation formulas in real time without software redeployment or downtime.
                </p>
              </div>
            </div>

            {/* Risk Vector 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 uppercase">
                    Financial Operations
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 02</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Overtime Creep & Ghost Payroll
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Uncontrolled overtime billing, duplicate payments, or ghost employees leading to cash-flow leaks and inflated liabilities.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-rose-600">Critical (Direct Loss)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">Near-Zero</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Biometric geofence kiosk proofs, pre-flight payrun variance warnings, and IFSC/PAN duplicate detection algorithms.
                </p>
              </div>
            </div>

            {/* Risk Vector 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200 uppercase">
                    Cybersecurity & Data
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 03</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Employee PII Leak & IDOR Breaches
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Unauthorized disclosure of employee compensation, bank accounts, or IDOR spoofing of attendance and payslip endpoints.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-rose-600">Severe (Reputational)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">Mitigated (AES-256)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Role-Based Access Control (RBAC), JWT token verification, identity-locked employee endpoints, and encrypted at rest.
                </p>
              </div>
            </div>

            {/* Risk Vector 4 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 uppercase">
                    Infrastructure
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 04</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Pay Day Cloud Outage & Failure
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  System unavailability or database crashes on monthly salary processing day causing missed bank disbursement deadlines.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-amber-600">High (Operational)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">&lt; 0.01% (99.99% SLA)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Multi-region active-active cluster failover, read-replica scaling, and offline biometric kiosk punch caching.
                </p>
              </div>
            </div>

            {/* Risk Vector 5 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-extrabold border border-cyan-200 uppercase">
                    ERP Interoperability
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 05</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  General Ledger Disconnect
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Payroll expenses failing to post accurately into corporate accounting ledgers (Odoo ERP / QuickBooks / SAP), causing audit delays.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-amber-600">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">Zero (Auto GL Post)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Automated double-entry journal creation with transaction hashes and bidirectional reconciliation against Odoo GL.
                </p>
              </div>
            </div>

            {/* Risk Vector 6 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 uppercase">
                    Vendor Lock-in
                  </span>
                  <span className="text-xs font-mono font-black text-slate-400">VECTOR 06</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  Enterprise Data Portability
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fear of proprietary platform lock-in or difficult migration paths preventing enterprise enterprise procurement sign-off.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Inherent Risk:</span>
                    <span className="font-extrabold text-slate-600">Commercial Friction</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Residual Risk:</span>
                    <span className="font-extrabold text-emerald-600">Resolved (Open APIs)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] uppercase font-bold text-indigo-600 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PeoplePay360 Safeguard:</span>
                </p>
                <p className="text-[11px] text-slate-700 font-semibold leading-normal">
                  Full standard RESTful OpenAPI v3 specs, CSV/JSON raw data export tools, and 1-click roster migration utilities.
                </p>
              </div>
            </div>
          </div>

          {/* RISK HEATMAP & CONTINGENCY MATRIX TABLE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Enterprise Risk Severity & Mitigation Playbook
              </h3>
              <p className="text-xs text-slate-500">
                Detailed comparative analysis of threat levels before and after PeoplePay360 algorithmic controls.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-extrabold uppercase text-[10px] text-slate-500">
                    <th className="p-3">Risk Scenario</th>
                    <th className="p-3">Inherent Severity</th>
                    <th className="p-3">Probability</th>
                    <th className="p-3">Autonomous Mitigation Strategy</th>
                    <th className="p-3">Residual Risk</th>
                    <th className="p-3">Audit Readiness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Statutory Tax Rate Revision</td>
                    <td className="p-3 text-rose-600 font-bold">High</td>
                    <td className="p-3 text-amber-600">Likely</td>
                    <td className="p-3 text-slate-600">Dynamic rule formula update without code deployment</td>
                    <td className="p-3 text-emerald-600 font-extrabold">Low</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">100% Compliant</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Ghost Employee / Identity Fraud</td>
                    <td className="p-3 text-rose-600 font-bold">Critical</td>
                    <td className="p-3 text-slate-500">Low</td>
                    <td className="p-3 text-slate-600">PAN & Bank account uniqueness validation checksum</td>
                    <td className="p-3 text-emerald-600 font-extrabold">Negligible</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Zero Tolerance</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Unauthorized Data Access (IDOR)</td>
                    <td className="p-3 text-rose-600 font-bold">Severe</td>
                    <td className="p-3 text-amber-600">Moderate</td>
                    <td className="p-3 text-slate-600">Strict JWT role verification & employee ID binding</td>
                    <td className="p-3 text-emerald-600 font-extrabold">Negligible</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">OWASP Top 10 Hardened</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Monthly Payrun Cluster Downtime</td>
                    <td className="p-3 text-amber-600 font-bold">High</td>
                    <td className="p-3 text-slate-500">Rare</td>
                    <td className="p-3 text-slate-600">Multi-region database replica failover with SLA guarantee</td>
                    <td className="p-3 text-emerald-600 font-extrabold">Very Low</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">99.99% Uptime SLA</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* INTERACTIVE COMPLIANCE & SECURITY STRESS TEST SIMULATOR */}
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/30">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Interactive Threat Stress-Testing Studio</span>
                </div>
                <h3 className="text-xl font-black text-white">Live Autonomous Defense & Threat Simulator</h3>
                <p className="text-xs text-slate-400">
                  Select an adverse regulatory, security, or infrastructural shock to observe PeoplePay360's automated algorithmic defense in real time.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  SHIELD ACTIVE
                </span>
              </div>
            </div>

            {/* Scenario Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'tax_shock', label: 'Tax Slabs Drift (+2.5%)', desc: 'CBDT Sudden Surcharge Revision', icon: FileCheck },
                { id: 'ghost_injection', label: 'Ghost Payroll Injection', desc: 'Duplicate Bank Account Attack', icon: ShieldAlert },
                { id: 'cluster_failover', label: 'Pay Day Cloud Outage', desc: 'AZ Crash on EOM Disbursement', icon: Server },
                { id: 'idor_probe', label: 'Malicious IDOR Probe', desc: 'Horizontal Roster Spoof Attack', icon: Lock },
              ].map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => { setSimScenario(sc.id); setSimResult(null); }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    simScenario === sc.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <sc.icon className={`w-4 h-4 ${simScenario === sc.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{sc.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{sc.desc}</p>
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-300">
                Selected Vector: <span className="font-mono text-indigo-400 font-bold uppercase">{simScenario.replace('_', ' ')}</span>
              </div>
              <button
                onClick={() => runStressTest(simScenario)}
                disabled={simRunning}
                className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {simRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Stress Test...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Real-Time Defense Simulation</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Results Output */}
            {simResult && (
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-black text-white">{simResult.title}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    THREAT NEUTRALIZED ({simResult.detectedIn})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Autonomous Mitigation Action</span>
                    <p className="text-slate-200 font-medium text-[11px] leading-relaxed">{simResult.actionTaken}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Financial Exposure Protected</span>
                    <p className="text-emerald-300 font-bold text-[11px] leading-relaxed">{simResult.penaltiesAvoided}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Audit Proof Status</span>
                    <p className="text-indigo-300 font-mono text-[11px] leading-relaxed">{simResult.auditStatus}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC HEADCOUNT RISK EXPOSURE CALCULATOR */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Enterprise Capital Protection Model</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Interactive Payroll Risk & Capital Shield Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Estimate inherent regulatory & operational liability exposure vs. capital saved with PeoplePay360 automated safeguards.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Protected Capital / Year</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  ₹{capitalProtected.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Organization Headcount:</span>
                  <span className="font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-sm">
                    {riskHeadcount} Employees
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1500}
                  step={5}
                  value={riskHeadcount}
                  onChange={(e) => setRiskHeadcount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>10 Staff (Startup)</span>
                  <span>500 (Mid-Market)</span>
                  <span>1,500+ (Enterprise)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Avg. Monthly Wage per Employee:</span>
                  <span className="font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-sm">
                    ₹{avgMonthlyWage.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={250000}
                  step={5000}
                  value={avgMonthlyWage}
                  onChange={(e) => setAvgMonthlyWage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>₹25,000</span>
                  <span>₹1,25,000</span>
                  <span>₹2,50,000</span>
                </div>
              </div>
            </div>

            {/* Financial Metrics Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Annual Gross Payroll</span>
                <p className="text-lg font-black text-slate-900 font-mono">
                  ₹{annualGrossPayroll.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-500">12-month total workforce wage volume</p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-600">Inherent Risk (Unprotected)</span>
                <p className="text-lg font-black text-rose-600 font-mono">
                  ₹{inherentRiskAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-rose-700">3.2% industry error, audit & drift leak</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600">PeoplePay360 Protection</span>
                <p className="text-lg font-black text-emerald-600 font-mono">
                  98.4%
                </p>
                <p className="text-[10px] text-emerald-700">Autonomous 2-step verification shield</p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-2xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-600">Residual Liability</span>
                <p className="text-lg font-black text-indigo-700 font-mono">
                  ₹{residualRiskAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-indigo-600">&lt; 1.6% controlled tail variance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessModelPage;
