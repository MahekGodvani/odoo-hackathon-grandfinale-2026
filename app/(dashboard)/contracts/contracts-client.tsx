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
import { createContract, updateContractStatus, deleteContract } from "./actions";

interface Contract {
  id: string;
  name: string;
  wage: number;
  startDate: string | Date;
  endDate?: string | Date | null;
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED";
  notes?: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    position?: string;
  };
  schedule: {
    id: string;
    name: string;
    weeklyHours: number;
  };
  structure: {
    id: string;
    name: string;
  };
}

export function ContractsClient({
  contracts: initialContracts,
  formData,
  userRole,
}: {
  contracts: Contract[];
  formData: {
    employees: Array<{ id: string; firstName: string; lastName: string; employeeId: string }>;
    schedules: Array<{ id: string; name: string; weeklyHours: number }>;
    structures: Array<{ id: string; name: string }>;
  };
  userRole: string;
}) {
  const [contracts, setContracts] = useState(initialContracts);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = ["ADMIN", "HR_MANAGER", "HR_PAYROLL_MANAGER"].includes(userRole);

  const filteredContracts = contracts.filter((c) => {
    const empName = `${c.employee.firstName} ${c.employee.lastName}`.toLowerCase();
    const matchesSearch =
      empName.includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.employee.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const draftCount = contracts.filter((c) => c.status === "DRAFT").length;
  const expiredCount = contracts.filter((c) => c.status === "EXPIRED" || c.status === "TERMINATED").length;

  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      await updateContractStatus(id, newStatus);
      setContracts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update contract status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete contract "${name}"?`)) return;
    try {
      await deleteContract(id);
      setContracts((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await createContract(form);
      setIsCreateModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to create contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contracts</h1>
          <p className="text-sm text-slate-400">
            Employee compensation agreements, working schedules, and salary structures
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Contract
          </Button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900/60 border-slate-800 p-4">
          <div className="text-xs text-emerald-400 font-medium">Active Contracts</div>
          <div className="text-2xl font-bold text-white mt-1">{activeCount}</div>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800 p-4">
          <div className="text-xs text-amber-400 font-medium">Draft Agreements</div>
          <div className="text-2xl font-bold text-white mt-1">{draftCount}</div>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800 p-4">
          <div className="text-xs text-slate-400 font-medium">Expired / Terminated</div>
          <div className="text-2xl font-bold text-white mt-1">{expiredCount}</div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search contracts by employee name, ID, or contract title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="EXPIRED">Expired</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Contract Name</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Monthly Base Wage</th>
                <th className="py-3.5 px-4">Salary Structure</th>
                <th className="py-3.5 px-4">Work Schedule</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                {canManage && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 8 : 7} className="py-12 text-center text-slate-500">
                    No contracts found.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">{c.name}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/employees/${c.employee.id}`}
                        className="text-indigo-400 hover:underline font-medium"
                      >
                        {c.employee.firstName} {c.employee.lastName}
                      </Link>
                      <div className="text-xs text-slate-500 font-mono">{c.employee.employeeId}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      ₹{Number(c.wage).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{c.structure?.name}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {c.schedule?.name} ({c.schedule?.weeklyHours}h)
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      <div>From {new Date(c.startDate).toLocaleDateString()}</div>
                      <div>{c.endDate ? `To ${new Date(c.endDate).toLocaleDateString()}` : "Open-ended"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          c.status === "ACTIVE"
                            ? "success"
                            : c.status === "DRAFT"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {c.status === "DRAFT" && (
                            <button
                              onClick={() => handleStatusChange(c.id, "ACTIVE")}
                              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20"
                            >
                              Activate
                            </button>
                          )}
                          {c.status === "ACTIVE" && (
                            <button
                              onClick={() => handleStatusChange(c.id, "TERMINATED")}
                              className="text-xs font-medium text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20"
                            >
                              Terminate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="text-xs font-medium text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: New Contract */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Contract"
        >
          {error && (
            <div className="p-3 mb-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Contract Reference Title *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Software Engineer - Full Time 2024"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Select Employee *
              </label>
              <select
                name="employeeId"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Employee</option>
                {formData.employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Salary Structure *
                </label>
                <select
                  name="structureId"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Select Structure</option>
                  {formData.structures.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Working Schedule *
                </label>
                <select
                  name="scheduleId"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Select Schedule</option>
                  {formData.schedules.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.weeklyHours}h/week)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Monthly Base Wage (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="wage"
                  required
                  placeholder="75000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Contract Status *
                </label>
                <select
                  name="status"
                  defaultValue="ACTIVE"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="ACTIVE">ACTIVE (Running)</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Terms / Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Notice period, probation terms, or special clauses..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Save Contract"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
