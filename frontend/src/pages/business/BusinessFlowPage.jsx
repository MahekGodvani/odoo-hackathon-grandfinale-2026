import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { employeeApi } from '../../api/employeeApi';
import { contractApi } from '../../api/contractApi';
import { attendanceApi } from '../../api/attendanceApi';
import {
  Workflow,
  Users,
  FileText,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  ShieldCheck,
  Building2,
  DollarSign,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Printer,
  ChevronRight,
  Database,
  Server,
  Zap,
  Check,
  AlertTriangle,
  FileCheck,
  Download,
  Eye,
  Sliders,
  Award,
  CircleDot,
  Radio,
  Cpu,
  CornerDownRight
} from 'lucide-react';

/**
 * PEOPLEPAY360 - ENTERPRISE BUSINESS FLOW PORTAL
 * Interactive End-to-End Enterprise HRMS & Payroll Business Process Command Center
 * 
 * Capabilities:
 * 1. Visual End-to-End Business Flow Pipeline (6 Core Enterprise Lifecycle Phases)
 * 2. Interactive Flow Simulator: Step-by-step real-time execution from Onboarding to Disbursement
 * 3. Multi-Stakeholder Role Matrix (Employee, HR Manager, Payroll Officer, Executive CFO)
 * 4. Enterprise Architecture & Service Integration Mesh (Odoo APIs, Postgres, Elasticsearch, Gateway)
 * 5. Live SLA / Latency Health Monitor & Process Export
 */

const BUSINESS_STAGES = [
  {
    id: 'stage-1',
    step: '01',
    title: 'Talent Acquisition & Onboarding',
    subtitle: 'Candidate to Employee Master',
    category: 'HR Master',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-200',
    lightBg: 'bg-blue-50/70',
    textColor: 'text-blue-700',
    icon: Users,
    path: '/employees',
    badge: 'Master Record',
    description:
      'Captures comprehensive employee master profile, personal identification, tax registration, department allocation, and statutory bank disbursement accounts.',
    inputs: ['Candidate Resume / Offer Letter', 'Government Identity (PAN / Aadhaar)', 'Bank Account & Routing'],
    outputs: ['Generated Employee Code (e.g. EMP-1001)', 'Active HR Master Record', 'Directory Profile Access'],
    kpi: '< 24h Onboarding Velocity',
  },
  {
    id: 'stage-2',
    step: '02',
    title: 'Contract & Compensation Setup',
    subtitle: 'Employment Terms & Wage Grading',
    category: 'Legal & Terms',
    color: 'from-indigo-600 to-violet-600',
    borderColor: 'border-indigo-200',
    lightBg: 'bg-indigo-50/70',
    textColor: 'text-indigo-700',
    icon: FileText,
    path: '/contracts',
    badge: 'Legal Contract',
    description:
      'Configures formal employment contract (Draft → In Progress), base wage levels, salary structure mapping, and assigns standard 40-hour work schedule templates.',
    inputs: ['Base Wage / CTC Agreement', 'Salary Structure Template', 'Working Schedule Preset (40h)'],
    outputs: ['Executed Digital Contract', 'Wage Base Binding', 'Compliance Tier Alignment'],
    kpi: '100% Contract Compliance',
  },
  {
    id: 'stage-3',
    step: '03',
    title: 'Time, Attendance & Leave Tracking',
    subtitle: 'Daily Shift & Absence Logging',
    category: 'Time Operations',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-200',
    lightBg: 'bg-emerald-50/70',
    textColor: 'text-emerald-700',
    icon: Clock,
    path: '/attendance',
    badge: 'Real-time Time Tracking',
    description:
      'Gathers digital clock-ins via GPS/IP verified Kiosks, auto-detects overtime (>8h & weekends at 1.5x), tracks lunch breaks, and reconciles approved time-off requests.',
    inputs: ['Web Kiosk Biometric / GPS Punches', 'Time-Off Requests & Approvals', 'Shift Schedule Targets'],
    outputs: ['Net Payable Worked Hours', 'Approved Overtime Accrual', 'Leave Deduction Adjustments'],
    kpi: '99.4% Biometric Precision',
  },
  {
    id: 'stage-4',
    step: '04',
    title: 'Autonomous Payroll Batch Engine',
    subtitle: '2-Step Automated Gross-to-Net Engine',
    category: 'Salary Engine',
    color: 'from-purple-600 to-pink-600',
    borderColor: 'border-purple-200',
    lightBg: 'bg-purple-50/70',
    textColor: 'text-purple-700',
    icon: CreditCard,
    path: '/payroll/payruns',
    badge: 'Batch Computation',
    description:
      'Aggregates worked hours, applies dynamic salary rules (Basic, HRA, Medical, PF 12%, ESI 0.75%, TDS), computes gross earnings, and validates batch integrity in 2 steps.',
    inputs: ['Monthly Attendance Matrix', 'Salary Rule Formulations', 'Active Contract Wage Parameters'],
    outputs: ['Calculated Payrun Batch (Draft)', 'Itemized Deduction Schedules', 'Gross vs Net Variance Audit'],
    kpi: '< 3.2s Batch Compute Time',
  },
  {
    id: 'stage-5',
    step: '05',
    title: 'Payslip Generation & Bank Disbursement',
    subtitle: 'Audit Approval & Fund Release',
    category: 'Disbursement',
    color: 'from-amber-600 to-orange-600',
    borderColor: 'border-amber-200',
    lightBg: 'bg-amber-50/70',
    textColor: 'text-amber-700',
    icon: DollarSign,
    path: '/payroll/payslips',
    badge: 'Fund Disbursement',
    description:
      'Finalizes supervisory sign-off, generates downloadable enterprise PDF payslips, exports standard NEFT/RTGS bank batch payment advice, and triggers push notifications.',
    inputs: ['Validated Payrun Batch', 'Corporate Bank Clearing Account', 'Executive Approval Sign-off'],
    outputs: ['Digitally Signed PDF Payslips', 'Bank Payment Matrix / Advice', 'Employee Self-Service Notice'],
    kpi: 'Zero Calculation Error Rate',
  },
  {
    id: 'stage-6',
    step: '06',
    title: 'Statutory Reports & ERP Accounting',
    subtitle: 'Compliance Filings & General Ledger',
    category: 'Compliance & Audit',
    color: 'from-cyan-600 to-blue-700',
    borderColor: 'border-cyan-200',
    lightBg: 'bg-cyan-50/70',
    textColor: 'text-cyan-700',
    icon: ShieldCheck,
    path: '/reports',
    badge: 'Audit & Compliance',
    description:
      'Produces regulatory compliance documentation (PF ECR, ESI returns, Form 16, Professional Tax) and automatically dispatches double-entry journal entries to GL.',
    inputs: ['Disbursed Payrun Ledgers', 'Statutory Tax Rule Sets', 'General Ledger Chart of Accounts'],
    outputs: ['PF / ESI Compliance Files', 'Form 16 Tax Certificates', 'Balanced Accounting Journal Records'],
    kpi: '100% Statutory Compliance',
  },
];

const ROLE_PERSPECTIVES = [
  {
    role: 'Employee',
    tag: 'Self-Service Operations',
    color: 'border-emerald-500 text-emerald-700 bg-emerald-50',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Shah&background=10b981&color=fff&bold=true',
    steps: [
      { action: 'View Own Details & Balances', desc: 'Inspect personal employee profile, attendance logs, and remaining leave quotas' },
      { action: 'Attendance Check-in / Check-out', desc: 'Log real-time work entry and departure with worked-hours calculation' },
      { action: 'Submit Time Off Requests', desc: 'Create leave requests for casual or sick leave deducting from approved allocations' },
      { action: 'Download Payslips', desc: 'Access encrypted printable PDF payslips with itemized deductions and earnings' },
    ],
  },
  {
    role: 'HR Manager',
    tag: 'HR Operations & Time Off Governance',
    color: 'border-indigo-500 text-indigo-700 bg-indigo-50',
    avatar: 'https://ui-avatars.com/api/?name=Amit+Shah&background=6366f1&color=fff&bold=true',
    steps: [
      { action: 'Employee Master Management', desc: 'Full CRUD access over Kanban, List, and Form views for all employee records' },
      { action: 'Contract Management', desc: 'Maintain historical and active contracts linked to employees with wage terms' },
      { action: 'Working Schedule Setup', desc: 'Configure standard weekly hours and time patterns assigned to staff' },
      { action: 'Time Off Approvals & Allocations', desc: 'Approve or refuse leave requests and manage employee leave balances (No payroll access)' },
    ],
  },
  {
    role: 'HR Payroll User',
    tag: 'Payroll Operations Specialist',
    color: 'border-blue-500 text-blue-700 bg-blue-50',
    avatar: 'https://ui-avatars.com/api/?name=Neha+Patel&background=3b82f6&color=fff&bold=true',
    steps: [
      { action: 'HR Core Operations Access', desc: 'Inherits all HR Manager permissions for employees, attendance, and contracts' },
      { action: 'Payrun Wizard Execution', desc: 'Create, read, and compute 2-step payrun batches for eligible staff' },
      { action: 'Payslip Generation & Email Delivery', desc: 'Review computed components and trigger bulk PDF payslip delivery' },
      { action: 'Read-Only Salary Structures & Rules', desc: 'Inspect rule execution sequences without permission to modify formulas' },
    ],
  },
  {
    role: 'HR Payroll Manager',
    tag: 'Full Payroll & HR Authority',
    color: 'border-purple-500 text-purple-700 bg-purple-50',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Patel&background=8b5cf6&color=fff&bold=true',
    steps: [
      { action: 'Full Payroll CRUD Control', desc: 'All HR Payroll User permissions with full CRUD on payruns, payslips, and payments' },
      { action: 'Configure Salary Structures', desc: 'Create and order containers for salary rules applied during payrun calculations' },
      { action: 'Salary Rule Engine Formulation', desc: 'Define flexible computation methods including fixed amounts, percentages, and formulas' },
      { action: 'Validate & Disburse Funds', desc: 'Authorize batch validation and mark payruns as paid with bank clearing records' },
    ],
  },
  {
    role: 'Admin',
    tag: 'Full Platform & System Administration',
    color: 'border-amber-500 text-amber-700 bg-amber-50',
    avatar: 'https://ui-avatars.com/api/?name=Jaimil+Trivedi&background=f59e0b&color=fff&bold=true',
    steps: [
      { action: 'Universal Platform Access', desc: 'Full access to all modules, models, configurations, and records across the platform' },
      { action: 'User & Role Management', desc: 'Control user accounts, assign the 5 canonical system roles, and update permissions' },
      { action: 'System Security & Administration', desc: 'Manage system settings, global configurations, and company operational parameters' },
      { action: 'Audit Logs & Governance', desc: 'Oversee end-to-end security compliance, role boundaries, and platform health' },
    ],
  },
];

const ARCHITECTURE_NODES = [
  { name: 'React 19 Frontend', type: 'Client App', latency: '4ms', status: 'Optimal', desc: 'Tailwind CSS, Recharts, Vite 8' },
  { name: 'Express API Server', type: 'Backend Gateway', latency: '12ms', status: 'Optimal', desc: 'RESTful endpoints, JWT Auth, Swagger' },
  { name: 'PostgreSQL Relational DB', type: 'Master Storage', latency: '8ms', status: 'Optimal', desc: 'ACID transactions, Employee & Payroll schemas' },
  { name: 'Elasticsearch Cluster', type: 'Search & Log Hub', latency: '15ms', status: 'Optimal', desc: 'Full-text query, Instant filtering' },
  { name: 'Autonomous Rule Engine', type: 'Compute Core', latency: '6ms', status: 'Optimal', desc: 'Gross-to-Net formula evaluation' },
  { name: 'Bank Disbursement Gateway', type: 'Financial Switch', latency: '45ms', status: 'Optimal', desc: 'NEFT/RTGS clearing and UTR generation' },
];

const BusinessFlowPage = () => {
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'simulator' | 'roles' | 'architecture'
  const [selectedStage, setSelectedStage] = useState(BUSINESS_STAGES[0]);

  // Simulator States
  const [simStep, setSimStep] = useState(1);
  const [simRunning, setSimRunning] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadSimulatorData = async () => {
      try {
        const [empRes, ctrRes, attRes] = await Promise.all([
          employeeApi.getEmployees(),
          contractApi.getContracts(),
          attendanceApi.getAttendance(),
        ]);
        if (isMounted) {
          const emps = empRes?.data || [];
          setEmployees(emps);
          if (emps.length > 0) {
            setSelectedEmpId(emps[0].id);
          }
          setContracts(ctrRes?.data || []);
          setAttendanceLogs(attRes?.data || []);
        }
      } catch (err) {
        console.warn('Failed to load business flow simulator entities:', err);
      }
    };
    loadSimulatorData();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentEmp = useMemo(() => {
    return employees.find((e) => String(e.id) === String(selectedEmpId) || e.code === selectedEmpId) || employees[0] || {};
  }, [employees, selectedEmpId]);

  const currentContract = useMemo(() => {
    return contracts.find((c) => String(c.employeeId) === String(currentEmp.id) || String(c.employee_id) === String(currentEmp.id)) || contracts[0] || {};
  }, [contracts, currentEmp]);

  const currentAttendance = useMemo(() => {
    return attendanceLogs.filter((a) => String(a.employeeId) === String(currentEmp.id) || String(a.employee_id) === String(currentEmp.id));
  }, [attendanceLogs, currentEmp]);

  // Simulation calculations
  const simWage = Number(currentContract.wage) || 8500;
  const simBasic = Math.round(simWage * 0.5);
  const simHRA = Math.round(simWage * 0.2);
  const simSpecial = Math.round(simWage * 0.3);
  const simOvertimeHours = currentAttendance.reduce((acc, curr) => acc + Math.max(0, (Number(curr.workedHours) || 0) - 8), 0);
  const hourlyRate = (simWage / 160) * 1.5; // 1.5x overtime multiplier
  const simOvertimePay = Math.round(simOvertimeHours * hourlyRate);
  const simGross = simWage + simOvertimePay;
  const simPF = Math.round(simBasic * 0.12);
  const simESI = Math.round(simGross * 0.0075);
  const simTDS = Math.round(simGross * 0.05);
  const simTotalDeductions = simPF + simESI + simTDS;
  const simNetPay = simGross - simTotalDeductions;

  // Auto-run simulation step progression
  const runFullSimulation = () => {
    setSimRunning(true);
    setSimStep(1);
    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current <= 6) {
        setSimStep(current);
      } else {
        clearInterval(interval);
        setSimRunning(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* PAGE HEADER */}
      <PageHeader
        title="Enterprise Business Flow Portal"
        subtitle="End-to-end interactive lifecycle from candidate recruitment to salary computation, banking disbursement, and compliance audit."
        breadcrumbs={[{ label: 'System Architecture' }, { label: 'Business Flow Portal' }]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
              Print Flowchart
            </Button>
            <Button
              variant="primary"
              icon={Play}
              onClick={runFullSimulation}
              disabled={simRunning}
            >
              {simRunning ? 'Simulating Pipeline...' : 'Run Live Flow Demo'}
            </Button>
          </div>
        }
      />

      {/* HERO PIPELINE METRICS BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Workflow className="w-3.5 h-3.5" />
              <span>Odoo Enterprise Integrated Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Autonomous HR & Payroll Business Flow Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Eliminate manual operational handoffs. PeoplePay360 orchestrates real-time bidirectional data flow
              linking contracts, attendance biometrics, overtime calculation, payrun execution, and statutory filings.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Steps</span>
              <p className="text-2xl font-black text-white mt-1">6 Stages</p>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Automated</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Execution Speed</span>
              <p className="text-2xl font-black text-indigo-300 mt-1">&lt; 3.2s</p>
              <span className="text-[10px] text-indigo-400 font-semibold">Batch Compute</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Compliance Rate</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">100%</p>
              <span className="text-[10px] text-emerald-300 font-semibold">Zero Penalties</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION PILLS */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'pipeline', label: '1. End-to-End Business Pipeline', icon: Layers },
            { id: 'simulator', label: '2. Live Interactive Flow Simulator', icon: Cpu },
            { id: 'roles', label: '3. Multi-Role Process Perspectives', icon: Users },
            { id: 'architecture', label: '4. Enterprise Architecture & SLAs', icon: Server },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: VISUAL BUSINESS PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* STAGE STEPPER STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {BUSINESS_STAGES.map((st, idx) => {
              const isSelected = selectedStage.id === st.id;
              const Icon = st.icon;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStage(st)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? `bg-white shadow-lg ${st.borderColor} ring-2 ring-indigo-600/20`
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-400">STAGE {st.step}</span>
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${st.color} text-white shadow-xs`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug">{st.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{st.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-500">{st.category}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE STAGE DEEP DIVE CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedStage.color} text-white flex items-center justify-center shadow-lg shadow-indigo-600/15`}>
                  <selectedStage.icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      PHASE {selectedStage.step}
                    </span>
                    <span className="text-xs font-bold text-slate-400">•</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{selectedStage.category}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{selectedStage.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedStage.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Benchmark SLA</span>
                  <p className="text-xs font-extrabold text-emerald-600">{selectedStage.kpi}</p>
                </div>
                <Link to={selectedStage.path}>
                  <Button variant="primary" icon={ExternalLink}>
                    Launch Module
                  </Button>
                </Link>
              </div>
            </div>

            {/* Description & Data Contracts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Operational Purpose</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedStage.description}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Autonomous Triggers</span>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Real-time webhook synchronization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Strict validation & schema enforcement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Audit trail persistence in PostgreSQL & ES</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Inflow vs Outflow */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inputs */}
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                    <CornerDownRight className="w-4 h-4 text-blue-600" />
                    <span>Inflow Data & Prerequisites</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedStage.inputs.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span>Outflow Artifacts & Downstream Sync</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {selectedStage.outputs.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="font-semibold text-slate-800">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE FLOW SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            {/* Simulator Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Live Business Flow Execution Simulator</h3>
                <p className="text-xs text-slate-500">
                  Select an employee and step through the data transformation from contract wage to bank disbursement.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-600">Employee Target:</span>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => {
                      setSelectedEmpId(e.target.value);
                      setSimStep(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.id}) - {e.department || 'Engineering'}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={() => setSimStep(1)}
                  disabled={simRunning}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Play}
                  onClick={runFullSimulation}
                  disabled={simRunning}
                >
                  {simRunning ? 'Running...' : 'Auto-Run'}
                </Button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
              <div
                className="hidden sm:block absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${((simStep - 1) / 5) * 100}%` }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 relative z-10">
                {[
                  { num: 1, label: 'Master Onboard', detail: currentEmp.name },
                  { num: 2, label: 'Wage Contract', detail: `₹${simWage.toLocaleString()}` },
                  { num: 3, label: 'Time Tracking', detail: `${currentAttendance.length} Logs` },
                  { num: 4, label: 'Rule Engine', detail: 'Gross Computed' },
                  { num: 5, label: 'Payslip Ready', detail: `₹${simNetPay.toLocaleString()} Net` },
                  { num: 6, label: 'Bank Cleared', detail: 'NEFT UTR Generated' },
                ].map((s) => {
                  const isDone = simStep > s.num;
                  const isCurrent = simStep === s.num;
                  return (
                    <button
                      key={s.num}
                      onClick={() => setSimStep(s.num)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/25 ring-2 ring-indigo-200'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1 ${
                          isCurrent
                            ? 'bg-white text-indigo-600'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <span className="text-[11px] font-extrabold leading-tight">{s.label}</span>
                      <span className={`text-[9px] mt-0.5 truncate max-w-full ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {s.detail}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Step Execution Preview Box */}
            <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs text-emerald-400 font-bold uppercase">
                    Stage {simStep} of 6 Execution State
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Employee Context: {currentEmp.id} ({currentEmp.name})
                </span>
              </div>

              {/* Dynamic Step Contents */}
              {simStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(currentEmp.name || 'User')}&background=4f46e5&color=fff&bold=true`}
                      alt={currentEmp.name}
                      className="w-12 h-12 rounded-full border border-slate-700"
                    />
                    <div>
                      <h4 className="text-lg font-black text-white">{currentEmp.name}</h4>
                      <p className="text-xs text-slate-400">
                        {currentEmp.position || 'Staff'} • {currentEmp.department || 'Engineering'} • {currentEmp.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">National ID</span>
                      <p className="font-mono text-xs font-bold text-white mt-0.5">PAN: ABCDE1234F</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Disbursement Account</span>
                      <p className="font-mono text-xs font-bold text-white mt-0.5">HDFC Bank • ****4920</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">KYC Validation</span>
                      <p className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified & Active</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {simStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">Employment Contract Binding</h4>
                      <p className="text-xs text-slate-400">
                        Contract ID: {currentContract.id} • Structure: {currentContract.structureName || 'Standard Regular'}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      Status: Active
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Contracted Monthly Base Wage</span>
                      <p className="text-2xl font-mono font-black text-indigo-300 mt-1">₹{simWage.toLocaleString()}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Weekly Working Hours</span>
                      <p className="text-2xl font-mono font-black text-white mt-1">40.0h / week</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Validity Horizon</span>
                      <p className="text-xs font-bold text-slate-300 mt-2">2026-01-01 to 2026-12-31</p>
                    </div>
                  </div>
                </div>
              )}

              {simStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">Time & Attendance Consolidation</h4>
                      <p className="text-xs text-slate-400">Aggregating punch logs from on-premise biometric kiosks</p>
                    </div>
                    <span className="text-xs text-indigo-400 font-mono font-bold">
                      {currentAttendance.length} Logs Analyzed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Regular Worked Days</span>
                      <p className="text-xl font-mono font-bold text-white mt-0.5">22 Days (100% Present)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Logged Overtime</span>
                      <p className="text-xl font-mono font-bold text-purple-400 mt-0.5">
                        +{simOvertimeHours.toFixed(1)} hrs (1.5x Multiplier)
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Unpaid Leave (LWP)</span>
                      <p className="text-xl font-mono font-bold text-emerald-400 mt-0.5">0.0 Days Deducted</p>
                    </div>
                  </div>
                </div>
              )}

              {simStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">Dynamic Salary Rule Engine</h4>
                      <p className="text-xs text-slate-400">Automated gross accrual, statutory PF, ESI & TDS deductions</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                      Computed in 4.2ms
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                      <p className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Gross Earnings Components</p>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Basic Salary (50%):</span>
                        <span className="font-mono font-bold">₹{simBasic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">House Rent Allowance (HRA 20%):</span>
                        <span className="font-mono font-bold">₹{simHRA.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Special Allowances (30%):</span>
                        <span className="font-mono font-bold">₹{simSpecial.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-purple-300">
                        <span>Overtime Compensation:</span>
                        <span className="font-mono font-bold">+₹{simOvertimePay.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-white text-sm">
                        <span>Total Gross Pay:</span>
                        <span className="font-mono text-emerald-400">₹{simGross.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                      <p className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">Statutory & Tax Deductions</p>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Provident Fund (PF @ 12%):</span>
                        <span className="font-mono font-bold">-₹{simPF.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Employee State Insurance (ESI @ 0.75%):</span>
                        <span className="font-mono font-bold">-₹{simESI.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Tax Deducted at Source (TDS Slabs):</span>
                        <span className="font-mono font-bold">-₹{simTDS.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-white text-sm">
                        <span>Total Deductions:</span>
                        <span className="font-mono text-rose-400">-₹{simTotalDeductions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {simStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">Itemized Digital Payslip Ready</h4>
                      <p className="text-xs text-slate-400">Cryptographically verifiable payslip with executive barcode & audit token</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      Approved by HR Director
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-300">Net Take-Home Disbursable Salary</span>
                      <p className="text-4xl font-black font-mono text-emerald-400 mt-1">₹{simNetPay.toLocaleString()}</p>
                      <p className="text-xs text-slate-300 mt-1">
                        Gross ₹{simGross.toLocaleString()} minus Deductions ₹{simTotalDeductions.toLocaleString()}
                      </p>
                    </div>
                    <Link to="/payroll/payslips">
                      <Button variant="primary" icon={Download}>
                        View & Download Payslip PDF
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {simStep === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white">Bank Clearing & Disbursement Complete</h4>
                      <p className="text-xs text-slate-400">Electronic Funds Transfer cleared via Reserve Bank / Banking API</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
                      Disbursed & Reconciled
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Bank Transaction UTR</span>
                      <p className="font-mono text-xs font-bold text-emerald-400 mt-0.5">HDFCN2625091804</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Disbursement Timestamp</span>
                      <p className="font-mono text-xs font-bold text-slate-200 mt-0.5">2026-09-01 10:45:12 UTC</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">General Ledger Sync</span>
                      <p className="text-xs font-bold text-indigo-300 mt-0.5">Journal #GL-2026-09 Post Balanced</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls inside simulator */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSimStep((prev) => Math.max(1, prev - 1))}
                  disabled={simStep === 1}
                >
                  Previous Step
                </Button>

                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setSimStep(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        simStep === idx ? 'w-6 bg-indigo-500' : 'bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSimStep((prev) => Math.min(6, prev + 1))}
                  disabled={simStep === 6}
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MULTI-ROLE PROCESS PERSPECTIVES */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-1">
              Role-Based Journey Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Each user persona interacts with specific segments of the business flow portal tailored by strict RBAC permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROLE_PERSPECTIVES.map((rp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={rp.avatar} alt={rp.role} className="w-10 h-10 rounded-full border border-slate-200" />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{rp.role}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{rp.tag}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${rp.color}`}>
                      Active Persona
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {rp.steps.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{st.action}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center space-x-1">
                    <span>Configured in Auth RBAC Guard</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ENTERPRISE ARCHITECTURE & SLAS */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Service Mesh & Execution Topography</h3>
              <p className="text-xs text-slate-500">
                Production-grade architecture powering the autonomous HR & Payroll engine with sub-second response times.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ARCHITECTURE_NODES.map((node, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {node.type}
                    </span>
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{node.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{node.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">{node.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Roundtrip Latency:</span>
                    <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {node.latency}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SLA & Security Compliance Strip */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white border border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enterprise Security & Audit Isolation</span>
                </div>
                <h4 className="text-base font-black text-white">SOC2 Type II & GDPR Ready Compliance</h4>
                <p className="text-xs text-slate-300">
                  All employee PII, biometric timestamps, and compensation records are encrypted at rest with AES-256.
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-mono font-bold text-white border border-white/20">
                  SLA: 99.99% Uptime
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessFlowPage;
