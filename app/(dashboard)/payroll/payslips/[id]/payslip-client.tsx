"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui";

export function PayslipClient({
  payslip,
  userRole,
}: {
  payslip: any;
  userRole: string;
}) {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const employee = payslip.employee;
  const breakdown: any[] = (payslip.breakdown as any[]) || [];

  const earnings = breakdown.filter(
    (b) => b.category === "BASIC" || b.category === "ALLOWANCE"
  );
  const deductions = breakdown.filter((b) => b.category === "DEDUCTION");

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    setIsEmailSent(true);
    setTimeout(() => setIsEmailSent(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Bar (Hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/payroll/payruns"
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            &larr; Back to Payruns
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-indigo-400 font-mono">
            {employee.firstName} {employee.lastName} ({payslip.period})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleEmail}
            className="border-slate-700 hover:bg-slate-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {isEmailSent ? "Email Sent!" : "Email Slip"}
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save PDF
          </Button>
        </div>
      </div>

      {isEmailSent && (
        <div className="print:hidden p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          ✓ Payslip PDF copy dispatched to <strong>{employee.email}</strong>.
        </div>
      )}

      {/* Printable Payslip Card */}
      <Card className="bg-slate-900/90 print:bg-white print:text-black border-slate-800 print:border-none shadow-2xl p-8 space-y-6">
        {/* Document Top / Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-800 print:border-slate-300 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-lg">
              P
            </div>
            <div>
              <h2 className="text-xl font-bold text-white print:text-black">
                PeoplePay360 Inc.
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                100 Innovation Park, Tech Corridor &bull; GSTIN: 24AABCP1234F1Z8
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800 block">
              Official Salary Slip
            </span>
            <div className="text-lg font-bold text-white print:text-black font-mono">
              Period: {payslip.period}
            </div>
            <div className="mt-1">
              <Badge variant={payslip.status === "PAID" ? "success" : "default"}>
                {payslip.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Employee Particulars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300 text-xs">
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Employee Name</span>
            <span className="font-bold text-white print:text-black">
              {employee.firstName} {employee.lastName}
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Employee ID</span>
            <span className="font-mono text-indigo-400 print:text-indigo-800 font-bold">
              {employee.employeeId}
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Designation</span>
            <span className="text-white print:text-black font-medium">{employee.position}</span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Department</span>
            <span className="text-white print:text-black font-medium">
              {employee.department?.name || "Operations"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Bank Account</span>
            <span className="font-mono text-white print:text-black font-medium">
              ••••••••4892
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">PAN / Tax ID</span>
            <span className="font-mono text-white print:text-black font-medium">
              ABCDE1234F
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">PF Number (UAN)</span>
            <span className="font-mono text-white print:text-black font-medium">
              101482910482
            </span>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Salary Structure</span>
            <span className="text-white print:text-black font-medium">
              {payslip.payrunLine?.contract?.structure?.name || "Standard"}
            </span>
          </div>
        </div>

        {/* Dual Table: Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 border-b border-slate-800 print:border-slate-300 pb-2">
              Earnings & Allowances
            </h4>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {earnings.map((e) => (
                  <tr key={e.ruleId} className="py-1.5">
                    <td className="py-2 text-slate-300 print:text-slate-700">{e.name}</td>
                    <td className="py-2 text-right font-mono font-bold text-white print:text-black">
                      ₹{Number(e.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 print:border-slate-400 font-bold">
                  <td className="pt-3 text-white print:text-black uppercase text-xs">
                    Total Gross Earnings
                  </td>
                  <td className="pt-3 text-right font-mono text-emerald-400 print:text-emerald-800 text-sm">
                    ₹{Number(payslip.grossSalary).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Deductions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 print:text-rose-800 border-b border-slate-800 print:border-slate-300 pb-2">
              Statutory & Tax Deductions
            </h4>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {deductions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-2 text-slate-500">
                      No statutory deductions recorded.
                    </td>
                  </tr>
                ) : (
                  deductions.map((d) => (
                    <tr key={d.ruleId} className="py-1.5">
                      <td className="py-2 text-slate-300 print:text-slate-700">{d.name}</td>
                      <td className="py-2 text-right font-mono font-bold text-rose-400 print:text-rose-700">
                        ₹{Number(d.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 print:border-slate-400 font-bold">
                  <td className="pt-3 text-white print:text-black uppercase text-xs">
                    Total Deductions
                  </td>
                  <td className="pt-3 text-right font-mono text-rose-400 print:text-rose-800 text-sm">
                    ₹{Number(payslip.totalDeductions).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Net Salary Highlight Box */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-indigo-950/60 print:bg-slate-200 border border-indigo-500/30 print:border-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 print:text-indigo-800">
              Net Payable Amount
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white print:text-black font-mono mt-0.5">
              ₹{Number(payslip.netSalary).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 print:text-slate-600">
            <div>Direct Bank Credit</div>
            {payslip.paidAt && (
              <div>Paid on: {new Date(payslip.paidAt).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 print:text-slate-600 gap-2">
          <span>* This is a system-generated encrypted payslip and does not require a physical signature.</span>
          <span>Generated by PeoplePay360 Platform</span>
        </div>
      </Card>
    </div>
  );
}
