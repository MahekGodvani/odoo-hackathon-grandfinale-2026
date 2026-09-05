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
  Modal,
} from "@/components/ui";
import {
  createPayrun,
  computePayrunAction,
  validatePayrunAction,
  markPaidPayrunAction,
} from "./actions";

interface PayrunLine {
  id: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    position?: string;
  };
  contract: {
    wage: number;
  };
  payslip?: {
    id: string;
    grossSalary: number;
    totalDeductions: number;
    netSalary: number;
    status: string;
  } | null;
}

interface Payrun {
  id: string;
  name: string;
  period: string;
  status: "DRAFT" | "COMPUTED" | "VALIDATED" | "PAID";
  lines: PayrunLine[];
}

export function PayrunsClient({
  payruns: initialPayruns,
  userRole,
}: {
  payruns: Payrun[];
  userRole: string;
}) {
  const [payruns, setPayruns] = useState(initialPayruns);
  const [expandedPayrunId, setExpandedPayrunId] = useState<string | null>(
    payruns[0]?.id || null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const canManage = ["ADMIN", "HR_PAYROLL_MANAGER"].includes(userRole);

  const handleCompute = async (id: string) => {
    setIsProcessing(true);
    try {
      await computePayrunAction(id);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to compute payrun");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await validatePayrunAction(id);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to validate payrun");
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaidPayrunAction(id);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to mark payrun as paid");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    const form = new FormData(e.currentTarget);
    try {
      await createPayrun(form);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to create payrun");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payruns & Batch Payroll</h1>
          <p className="text-sm text-slate-400">
            Automated salary calculations, statutory deductions, approvals, and disbursement
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate Payrun
          </Button>
        )}
      </div>

      {payruns.length === 0 ? (
        <Card className="bg-slate-900/60 border-slate-800 p-12 text-center">
          <p className="text-slate-400">No payruns created yet.</p>
          {canManage && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500"
            >
              Generate First Payrun
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {payruns.map((payrun) => {
            const isExpanded = expandedPayrunId === payrun.id;
            const totalGross = payrun.lines.reduce(
              (acc, l) => acc + (l.payslip?.grossSalary || l.contract.wage || 0),
              0
            );
            const totalDeductions = payrun.lines.reduce(
              (acc, l) => acc + (l.payslip?.totalDeductions || 0),
              0
            );
            const totalNet = payrun.lines.reduce(
              (acc, l) => acc + (l.payslip?.netSalary || 0),
              0
            );

            return (
              <Card
                key={payrun.id}
                className="bg-slate-900/70 border-slate-800 overflow-hidden transition-all"
              >
                {/* Payrun Header Bar */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setExpandedPayrunId(isExpanded ? null : payrun.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{payrun.name}</h3>
                        <Badge
                          variant={
                            payrun.status === "PAID"
                              ? "success"
                              : payrun.status === "VALIDATED"
                              ? "default"
                              : payrun.status === "COMPUTED"
                              ? "warning"
                              : "default"
                          }
                        >
                          {payrun.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Period: <span className="font-mono text-indigo-400">{payrun.period}</span> &bull; {payrun.lines.length} Employees Included
                      </p>
                    </div>
                  </div>

                  {/* Summary Figures & Actions */}
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                        Net Disbursed
                      </span>
                      <span className="text-lg font-bold text-emerald-400 font-mono">
                        ₹{totalNet.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-2">
                        {payrun.status === "DRAFT" && (
                          <Button
                            size="sm"
                            onClick={() => handleCompute(payrun.id)}
                            disabled={isProcessing}
                            className="bg-indigo-600 hover:bg-indigo-500 shadow-sm"
                          >
                            ⚡ Compute All
                          </Button>
                        )}
                        {payrun.status === "COMPUTED" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompute(payrun.id)}
                              disabled={isProcessing}
                              className="border-slate-700"
                            >
                              Re-compute
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleValidate(payrun.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                            >
                              Validate
                            </Button>
                          </>
                        )}
                        {payrun.status === "VALIDATED" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(payrun.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 shadow-sm"
                          >
                            Mark as Disbursed / Paid
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Employee Lines Table */}
                {isExpanded && (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-950/20 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Employee</th>
                            <th className="py-3 px-4">Base Contract</th>
                            <th className="py-3 px-4">Gross Earnings</th>
                            <th className="py-3 px-4">Statutory Deductions</th>
                            <th className="py-3 px-4">Net Salary</th>
                            <th className="py-3 px-4">Payslip Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                          {payrun.lines.map((line) => (
                            <tr key={line.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-3 px-4">
                                <Link
                                  href={`/employees/${line.employee.id}`}
                                  className="font-medium text-white hover:text-indigo-400"
                                >
                                  {line.employee.firstName} {line.employee.lastName}
                                </Link>
                                <div className="text-xs text-slate-500 font-mono">
                                  {line.employee.employeeId}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-300 font-mono">
                                ₹{Number(line.contract.wage).toLocaleString("en-IN")}
                              </td>
                              <td className="py-3 px-4 text-emerald-400 font-mono font-medium">
                                {line.payslip
                                  ? `₹${Number(line.payslip.grossSalary).toLocaleString("en-IN")}`
                                  : "—"}
                              </td>
                              <td className="py-3 px-4 text-rose-400 font-mono font-medium">
                                {line.payslip
                                  ? `₹${Number(line.payslip.totalDeductions).toLocaleString("en-IN")}`
                                  : "—"}
                              </td>
                              <td className="py-3 px-4 text-white font-mono font-bold">
                                {line.payslip
                                  ? `₹${Number(line.payslip.netSalary).toLocaleString("en-IN")}`
                                  : "Pending Compute"}
                              </td>
                              <td className="py-3 px-4">
                                {line.payslip ? (
                                  <Badge
                                    variant={
                                      line.payslip.status === "PAID"
                                        ? "success"
                                        : "default"
                                    }
                                  >
                                    {line.payslip.status}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-slate-500">Uncomputed</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {line.payslip ? (
                                  <Link
                                    href={`/payroll/payslips/${line.payslip.id}`}
                                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20"
                                  >
                                    View Payslip &rarr;
                                  </Link>
                                ) : (
                                  <span className="text-xs text-slate-600">No Slip</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Generate Payrun */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Generate Monthly Payrun"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Payrun Title *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. September 2024 General Payroll"
                defaultValue={`Payroll - ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Payroll Period (YYYY-MM) *
              </label>
              <input
                type="month"
                name="period"
                required
                defaultValue={new Date().toISOString().substring(0, 7)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <p className="text-xs text-slate-400">
              Generating this payrun will automatically enroll all employees with an <strong>ACTIVE</strong> contract and prepare them for batch calculation.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? "Generating..." : "Generate Payrun"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
