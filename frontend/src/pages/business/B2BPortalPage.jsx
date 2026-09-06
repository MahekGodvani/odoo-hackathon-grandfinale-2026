import React, { useState, useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Toast from '../../components/common/Toast';
import Modal from '../../components/common/Modal';
import {
  Building2,
  ShieldCheck,
  CreditCard,
  Key,
  RefreshCw,
  Download,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  Lock,
  Server,
  Globe,
  Users,
  Layers,
  Sliders,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  Printer,
  FileText,
  Sparkles,
  Plus,
  AlertCircle,
  Zap,
  Calendar,
  Eye,
  Radio,
  Workflow,
  Cpu,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Award
} from 'lucide-react';

/**
 * PEOPLEPAY360 - ENTERPRISE B2B CLIENT PORTAL
 * Dedicated Multi-Tenant Corporate Management & Enterprise Governance Suite.
 * 
 * Modules:
 * 1. Corporate Multi-Entity Hierarchy & Tenant Identity Switcher
 * 2. B2B Subscription, Licenses & Automated PEPM Seat Provisioning
 * 3. Enterprise SSO & SAML 2.0 / SCIM Identity Federation (Okta, Azure AD)
 * 4. API Mesh, Webhook Web & Pre-built ERP Connectors (Odoo, SAP, QuickBooks)
 * 5. Mass Data Ingestion & Roster Migration Hub
 * 6. SOC2 Compliance, Data Residency & Immutable Audit Vault
 */

const CORPORATE_TENANTS = [
  {
    id: 'TEN-001',
    name: 'Apex Global Technologies Inc.',
    jurisdiction: 'United States (Delaware)',
    currency: 'USD ($)',
    contractTier: 'Enterprise Platinum',
    contractStatus: 'Active',
    seatsContracted: 500,
    seatsUtilized: 320,
    mrr: 12768,
    accountExecutive: 'Marcus Vance (Enterprise VP)',
    supportSLA: '15-Minute Critical Response (99.99%)',
    dataResidency: 'AWS US-East (N. Virginia)',
    domain: 'apexcorp.com',
    taxId: 'EIN: 84-2918402',
  },
  {
    id: 'TEN-002',
    name: 'PeoplePay Labs India Pvt Ltd',
    jurisdiction: 'India (Karnataka)',
    currency: 'INR (₹)',
    contractTier: 'Enterprise Gold',
    contractStatus: 'Active',
    seatsContracted: 250,
    seatsUtilized: 185,
    mrr: 82790,
    accountExecutive: 'Priya Shah (Director of Accounts)',
    supportSLA: '1-Hour Priority Response (99.95%)',
    dataResidency: 'AWS AP-South (Mumbai)',
    domain: 'peoplepaylabs.in',
    taxId: 'GSTIN: 29AABCU9603R1ZM',
  },
  {
    id: 'TEN-003',
    name: 'Horizon Cloud Systems UK Ltd',
    jurisdiction: 'United Kingdom (London)',
    currency: 'GBP (£)',
    contractTier: 'Enterprise Silver',
    contractStatus: 'Active',
    seatsContracted: 150,
    seatsUtilized: 92,
    mrr: 5520,
    accountExecutive: 'Elena Rostova (Compliance Lead)',
    supportSLA: '2-Hour Standard Enterprise',
    dataResidency: 'AWS EU-Central (Frankfurt)',
    domain: 'horizoncloud.co.uk',
    taxId: 'VAT: GB 982 1204 55',
  },
];

const B2B_INVOICES = [
  { id: 'INV-2026-08', date: '2026-08-31', period: 'August 2026', seats: 320, amount: '₹1,36,679', status: 'Paid', method: 'Corporate ACH Direct Debit' },
  { id: 'INV-2026-07', date: '2026-07-31', period: 'July 2026', seats: 310, amount: '₹1,32,689', status: 'Paid', method: 'Corporate ACH Direct Debit' },
  { id: 'INV-2026-06', date: '2026-06-30', period: 'June 2026', seats: 295, amount: '₹1,26,704', status: 'Paid', method: 'Corporate Wire Transfer' },
  { id: 'INV-2026-05', date: '2026-05-31', period: 'May 2026', seats: 280, amount: '₹1,20,719', status: 'Paid', method: 'Corporate Wire Transfer' },
];

const INTEGRATIONS = [
  {
    id: 'odoo',
    name: 'Odoo ERP v17 Enterprise',
    category: 'ERP & General Ledger',
    status: 'Connected',
    icon: 'https://www.odoo.com/web/image/res.company/1/logo?unique=2',
    desc: 'Bi-directional sync of Employee records, Contracts, and automated Payrun GL Journal entries.',
    syncFrequency: 'Real-time Webhook',
    lastSync: '10 mins ago',
  },
  {
    id: 'sap',
    name: 'SAP SuccessFactors',
    category: 'HCM Suite',
    status: 'Ready to Configure',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg',
    desc: 'Master org-chart hierarchy synchronization and executive compensation tier alignment.',
    syncFrequency: 'Daily Batch (02:00 UTC)',
    lastSync: 'Pending Credentials',
  },
  {
    id: 'quickbooks',
    name: 'Intuit QuickBooks Online',
    category: 'Accounting',
    status: 'Connected',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/QuickBooks_logo.svg',
    desc: 'Automated payroll expense ledger posting and bank disbursement reconciliation.',
    syncFrequency: 'Payrun Completion Trigger',
    lastSync: '2 hours ago',
  },
  {
    id: 'slack',
    name: 'Slack Enterprise Grid',
    category: 'Communication & Alerts',
    status: 'Connected',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    desc: 'Interactive notifications for Kiosk clock-in reminders, shift swaps, and manager leave approvals.',
    syncFrequency: 'Event-driven instant',
    lastSync: '3 mins ago',
  },
];

const AUDIT_LOGS = [
  { id: 'AUD-8901', timestamp: '2026-09-05 18:24:10 UTC', user: 'admin@apexcorp.com', action: 'API Key Rotated', target: 'Production Gateway Key 2', ip: '198.51.100.42', status: 'Success' },
  { id: 'AUD-8902', timestamp: '2026-09-05 14:12:05 UTC', user: 'hr.director@apexcorp.com', action: 'Seat Allocation Modified', target: 'Seats expanded from 300 to 320', ip: '198.51.100.18', status: 'Success' },
  { id: 'AUD-8903', timestamp: '2026-09-04 09:30:00 UTC', user: 'system@peoplepay360.com', action: 'Odoo ERP Sync Executed', target: '22 Employee Profiles Synchronized', ip: 'Internal Mesh', status: 'Success' },
  { id: 'AUD-8904', timestamp: '2026-09-03 11:45:22 UTC', user: 'cfo@apexcorp.com', action: 'Tax Invoice Downloaded', target: 'INV-2026-08 Tax Certificate', ip: '203.0.113.88', status: 'Success' },
  { id: 'AUD-8905', timestamp: '2026-09-02 16:20:11 UTC', user: 'sec.officer@apexcorp.com', action: 'SAML SSO Config Verified', target: 'Azure AD Metadata Fingerprint', ip: '198.51.100.99', status: 'Success' },
];

const B2BPortalPage = () => {
  const [selectedTenant, setSelectedTenant] = useState(CORPORATE_TENANTS[0]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'billing' | 'sso' | 'integrations' | 'migration' | 'compliance'

  // Seat Management Slider
  const [provisionedSeats, setProvisionedSeats] = useState(selectedTenant.seatsContracted);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [apiKey, setApiKey] = useState(`pp360_live_sec_${selectedTenant.id.toLowerCase()}_89b41c884e629bc1`);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Switch tenant
  const handleTenantChange = (tenantId) => {
    const found = CORPORATE_TENANTS.find((t) => t.id === tenantId) || CORPORATE_TENANTS[0];
    setSelectedTenant(found);
    setProvisionedSeats(found.seatsContracted);
    setApiKey(`pp360_live_sec_${found.id.toLowerCase()}_89b41c884e629bc1`);
    setShowSecret(false);
    setToastMessage(`Switched active enterprise tenant to: ${found.name}`);
  };

  // Rotate Key
  const handleRotateKey = () => {
    const rand = Math.random().toString(36).substring(2, 12);
    const newKey = `pp360_live_sec_${selectedTenant.id.toLowerCase()}_${rand}`;
    setApiKey(newKey);
    setToastMessage(`API Secret Key rotated for ${selectedTenant.name}. Previous key invalidated.`);
  };

  // Copy API Key
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setToastMessage('Enterprise Production API Secret copied to clipboard');
    setTimeout(() => setApiKeyCopied(false), 3000);
  };

  // Seat Provisioning Update
  const handleSaveSeats = () => {
    setToastMessage(`Contract updated: Provisioned seats adjusted to ${provisionedSeats}. Prorated billing synced.`);
  };

  // Calculate live utilization percentage
  const utilizationPct = Math.round((selectedTenant.seatsUtilized / provisionedSeats) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER WITH TENANT SWITCHER */}
      <PageHeader
        title="Enterprise B2B Client Portal"
        subtitle="Multi-tenant corporate governance, automated PEPM seat licensing, SAML 2.0 SSO federation, and ERP connectors."
        breadcrumbs={[{ label: 'Commercial' }, { label: 'B2B Client Portal' }]}
        actions={
          <div className="flex items-center space-x-3">
            {/* Corporate Tenant Switcher Dropdown */}
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">Active Tenant</p>
                <select
                  value={selectedTenant.id}
                  onChange={(e) => handleTenantChange(e.target.value)}
                  className="text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-4"
                >
                  {CORPORATE_TENANTS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.jurisdiction})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              variant="secondary"
              icon={Printer}
              onClick={() => window.print()}
            >
              Print Dossier
            </Button>
          </div>
        }
      />

      {/* TOP CORPORATE IDENTITY & SLA BANNER */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedTenant.contractTier} Contract</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SLA Guarantee: {selectedTenant.supportSLA}</span>
                </span>
                <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                  {selectedTenant.taxId}
                </span>
              </div>

              <h2 className="text-3xl font-black text-white tracking-tight">
                {selectedTenant.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
                Primary Corporate Domain: <strong className="text-white">{selectedTenant.domain}</strong> • Data Sovereignty: <strong className="text-indigo-300">{selectedTenant.dataResidency}</strong>
              </p>
            </div>

            {/* Account Team Card */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shrink-0 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Dedicated Technical Account Manager</span>
              <p className="text-xs font-extrabold text-white flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedTenant.accountExecutive}</span>
              </p>
              <div className="pt-2 flex items-center space-x-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Direct Slack Hotline Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Seat Licenses</span>
              <p className="text-2xl font-black text-white mt-1">
                {selectedTenant.seatsUtilized} <span className="text-sm font-normal text-slate-400">/ {provisionedSeats}</span>
              </p>
              <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${utilizationPct}%` }}
                />
              </div>
              <p className="text-[10px] font-semibold text-indigo-400 mt-1">{utilizationPct}% Provisioned</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Annual Contract Status</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">Active</p>
              <p className="text-[10px] text-slate-400 mt-1">Renews 1st Jan 2027</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Billing Model</span>
              <p className="text-2xl font-black text-indigo-300 mt-1">Hybrid PEPM</p>
              <p className="text-[10px] text-slate-400 mt-1">₹399 / employee / mo</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Compliance Standard</span>
              <p className="text-2xl font-black text-white mt-1">SOC2 Type II</p>
              <p className="text-[10px] text-emerald-400 mt-1">GDPR & ISO27001 Certified</p>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION STRIP */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'B2B Overview', icon: Building2 },
            { id: 'billing', label: 'Licenses & Invoices', icon: CreditCard },
            { id: 'sso', label: 'Enterprise SSO & SCIM', icon: Lock },
            { id: 'integrations', label: 'ERP Connectors & APIs', icon: Workflow },
            { id: 'migration', label: 'Bulk Roster Importer', icon: UploadCloud },
            { id: 'compliance', label: 'Compliance & Audit Vault', icon: ShieldCheck },
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

      {/* TAB 1: B2B OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Organization Profile */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Corporate Master Profile</h3>
                <p className="text-xs text-slate-500">Legal entity registration, tax hierarchy, and corporate billing details.</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-mono font-bold">
                Tenant: {selectedTenant.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Registered Corporate Name</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedTenant.name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Legal Jurisdiction</span>
                <p className="font-bold text-slate-800">{selectedTenant.jurisdiction}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Corporate Tax Identifier</span>
                <p className="font-mono font-bold text-indigo-700">{selectedTenant.taxId}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Billing Currency</span>
                <p className="font-bold text-slate-800">{selectedTenant.currency}</p>
              </div>
            </div>

            {/* Enterprise SLA Guarantees */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-950 font-black text-xs">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Enterprise Service Level Agreement (SLA) Matrix</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-indigo-100/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Platform Uptime</span>
                  <p className="text-lg font-black text-indigo-700 mt-0.5">99.99%</p>
                  <span className="text-[9px] text-emerald-600 font-bold">Financial Penalty Backed</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-indigo-100/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">P1 Critical Bug Response</span>
                  <p className="text-lg font-black text-indigo-700 mt-0.5">&lt; 15 Mins</p>
                  <span className="text-[9px] text-indigo-600 font-bold">24/7/365 War Room</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-indigo-100/80">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Payroll Batch Compute SLA</span>
                  <p className="text-lg font-black text-indigo-700 mt-0.5">&lt; 5.0 Secs</p>
                  <span className="text-[9px] text-purple-600 font-bold">Up to 5,000 Employees</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Security Posture */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Quick B2B Operations</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('billing')}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Manage Seat Licenses</p>
                      <p className="text-[10px] text-slate-500">Expand or contract corporate PEPM seats</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>

                <button
                  onClick={() => setActiveTab('sso')}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Configure Okta / SAML</p>
                      <p className="text-[10px] text-slate-500">Single Sign-On & SCIM directory sync</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>

                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Manage API Keys & Webhooks</p>
                      <p className="text-[10px] text-slate-500">REST credentials & event endpoints</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>

                <button
                  onClick={() => setActiveTab('migration')}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Mass Employee Ingestion</p>
                      <p className="text-[10px] text-slate-500">Upload CSV / XLSX master roster</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              </div>
            </div>

            {/* Cloud Region Box */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-xs">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Data Isolation & Encryption</span>
              </div>
              <p className="text-xs text-slate-500">
                This tenant’s database is partitioned in a dedicated isolated schema with AWS KMS envelope encryption (AES-256-GCM).
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Data Residency:</span>
                <span className="font-bold text-indigo-700">{selectedTenant.dataResidency}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LICENSES & INVOICES */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Seat Provisioning Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Dynamic Seat Provisioning & PEPM Billing</h3>
                <p className="text-xs text-slate-500">
                  Scale your enterprise seat pool instantly. Add seats as headcount expands; billing automatically prorates.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                ₹399 / seat / mo + ₹8,999 Platform Fee
              </span>
            </div>

            {/* Interactive Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600">Contracted Provisioned Seats:</span>
                  <div className="text-3xl font-black text-indigo-600 font-mono mt-0.5">{provisionedSeats} Seats</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-600">Estimated Monthly B2B Charge:</span>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                    ₹{(8999 + provisionedSeats * 399).toLocaleString()} / mo
                  </div>
                </div>
              </div>

              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={provisionedSeats}
                onChange={(e) => setProvisionedSeats(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>50 Minimum</span>
                <span>Active Utilized: {selectedTenant.seatsUtilized} Seats</span>
                <span>2,000 Enterprise Max</span>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" icon={Check} onClick={handleSaveSeats}>
                  Update Provisioned Seats
                </Button>
              </div>
            </div>
          </div>

          {/* B2B Invoices Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Tax Invoices & Billing History</h3>
                <p className="text-xs text-slate-500">GST-compliant B2B tax invoices with itemized PEPM headcount logs.</p>
              </div>
              <Button variant="secondary" size="sm" icon={Download}>
                Download Annual Statement
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-3 px-3">Invoice #</th>
                    <th className="py-3 px-3">Period</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Billed Seats</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {B2B_INVOICES.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 font-mono font-bold text-indigo-700">{inv.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{inv.period}</td>
                      <td className="py-3.5 px-3 text-slate-500">{inv.date}</td>
                      <td className="py-3.5 px-3 font-mono">{inv.seats} Seats</td>
                      <td className="py-3.5 px-3 font-mono font-black text-slate-900">{inv.amount}</td>
                      <td className="py-3.5 px-3 text-slate-500">{inv.method}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Tax Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE SSO & SCIM */}
      {activeTab === 'sso' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">SAML 2.0 & OIDC Single Sign-On</h3>
                <p className="text-xs text-slate-500">
                  Enforce zero-trust enterprise authentication. Seamlessly federate with Okta, Microsoft Entra ID (Azure AD), and Google.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SSO Active for @{selectedTenant.domain}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">Identity Provider (IdP)</span>
                <p className="font-extrabold text-slate-900 text-sm">Microsoft Entra ID (Azure AD)</p>
                <p className="text-[11px] text-slate-500">Federated via SAML 2.0 Profile</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Enforcement Policy</span>
                <p className="font-extrabold text-slate-900 text-sm">Mandatory for All Employees</p>
                <p className="text-[11px] text-slate-500">Password login disabled for domain</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">SCIM 2.0 User Provisioning</span>
                <p className="font-extrabold text-emerald-700 text-sm flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-Time Sync Active</span>
                </p>
                <p className="text-[11px] text-slate-500">Auto-onboard & de-provision users</p>
              </div>
            </div>

            {/* SAML Parameters */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Service Provider (SP) Metadata</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Single Sign-On (ACS) URL:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://auth.peoplepay360.com/sso/saml2/${selectedTenant.id}/acs`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-mono text-xs focus:outline-none"
                    />
                    <Button variant="secondary" size="sm" icon={Copy} onClick={() => setToastMessage('ACS URL copied!')}>
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Entity ID / Audience URI:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`urn:peoplepay360:sp:${selectedTenant.id}`}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-mono text-xs focus:outline-none"
                    />
                    <Button variant="secondary" size="sm" icon={Copy} onClick={() => setToastMessage('Entity ID copied!')}>
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ERP CONNECTORS & APIS */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Enterprise Connectors & API Ecosystem</h3>
                <p className="text-xs text-slate-500">
                  Pre-built integrations to sync master HR data and publish double-entry general ledger journal batches.
                </p>
              </div>
              <Button variant="primary" size="sm" icon={Key} onClick={() => setIsApiKeyModalOpen(true)}>
                Manage API Keys
              </Button>
            </div>

            {/* Connectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTEGRATIONS.map((conn) => (
                <div
                  key={conn.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {conn.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          conn.status === 'Connected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {conn.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm">{conn.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{conn.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Sync: {conn.syncFrequency}</span>
                    <button
                      onClick={() => setToastMessage(`Triggered sync check for ${conn.name}`)}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Production Webhooks Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Live Webhook Dispatcher</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Status: 200 OK (42ms)</span>
              </div>
              <p className="text-xs text-slate-300 font-mono">
                Listening endpoint: https://api.{selectedTenant.domain}/v1/webhooks/peoplepay360
              </p>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {['employee.created', 'attendance.verified', 'payrun.computed', 'payslip.released'].map((ev) => (
                  <span key={ev} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BULK ROSTER IMPORTER */}
      {activeTab === 'migration' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Mass Employee & Attendance Roster Importer</h3>
                <p className="text-xs text-slate-500">
                  Migrate existing headcount from Workday, ADP, or Excel sheets into PeoplePay360 in 1 click.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => setToastMessage('Sample CSV Template downloaded!')}
              >
                Download CSV Template
              </Button>
            </div>

            {/* Drag and drop upload zone */}
            <div className="border-2 border-dashed border-indigo-200 rounded-3xl p-8 text-center bg-indigo-50/30 hover:bg-indigo-50/50 transition-all cursor-pointer space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">Drag & drop your employee roster spreadsheet</p>
                <p className="text-xs text-slate-500 mt-0.5">Supports CSV, XLSX, or JSON formats up to 50MB (up to 10,000 rows)</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setToastMessage('File selected: employee_master_roster_q3.csv (320 rows validated)')}
              >
                Browse Local Files
              </Button>
            </div>

            {/* Pre-flight Checks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Duplicate Check</p>
                  <p className="text-[11px] text-slate-500">Validates unique PAN, Aadhaar, and email IDs</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Bank Routing Verification</p>
                  <p className="text-[11px] text-slate-500">Validates IFSC code and account checksums</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800">Automatic Contract Binding</p>
                  <p className="text-[11px] text-slate-500">Generates active contract & salary structure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLIANCE & AUDIT VAULT */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Immutable Enterprise Audit Vault</h3>
                <p className="text-xs text-slate-500">
                  Cryptographically sealed audit trail of all executive actions, wage adjustments, and API transactions.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => setToastMessage('Full compliance audit ZIP archive generated!')}
              >
                Export Audit Dossier
              </Button>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase text-[10px]">
                    <th className="py-3 px-3">Audit ID</th>
                    <th className="py-3 px-3">Timestamp (UTC)</th>
                    <th className="py-3 px-3">Actor</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Target / Scope</th>
                    <th className="py-3 px-3">IP Address</th>
                    <th className="py-3 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 font-mono font-bold text-indigo-700">{log.id}</td>
                      <td className="py-3.5 px-3 text-slate-500 font-mono">{log.timestamp}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{log.user}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{log.action}</td>
                      <td className="py-3.5 px-3 text-slate-600">{log.target}</td>
                      <td className="py-3.5 px-3 font-mono text-slate-500">{log.ip}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: API KEYS & WEBHOOKS */}
      <Modal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        title="Enterprise API Secret Credentials"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start space-x-2.5 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Production Credentials Secret</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Keep your secret key safe. Never expose it in client-side code or mobile apps.
              </p>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Production Client ID:</label>
            <input
              type="text"
              readOnly
              value={`pp360_client_${selectedTenant.id.toLowerCase()}`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600">Production Secret Key (HMAC-SHA256):</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  {showSecret ? 'Hide Secret' : 'Reveal Secret'}
                </button>
                <button
                  type="button"
                  onClick={handleRotateKey}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                >
                  Rotate Key
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type={showSecret ? 'text' : 'password'}
                readOnly
                value={apiKey}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs focus:outline-none"
              />
              <Button variant="primary" size="sm" icon={Copy} onClick={handleCopyApiKey}>
                {apiKeyCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsApiKeyModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: INVOICE DETAILS */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={`Tax Invoice (#${selectedInvoice?.id})`}
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{selectedTenant.name}</h4>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedTenant.taxId}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Billing Cycle</span>
                  <p className="font-bold text-slate-800">{selectedInvoice.period}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Billed Seats</span>
                  <p className="font-mono font-bold text-slate-800">{selectedInvoice.seats} Employees</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Payment Method</span>
                  <p className="font-medium text-slate-800">{selectedInvoice.method}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Disbursed</span>
                  <p className="font-mono font-black text-indigo-700 text-sm">{selectedInvoice.amount}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="secondary" onClick={() => setIsInvoiceModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={() => {
                  setToastMessage(`Downloading official PDF for ${selectedInvoice.id}`);
                  setIsInvoiceModalOpen(false);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
};

export default B2BPortalPage;
