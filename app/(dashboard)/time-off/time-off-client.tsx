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
import { requestTimeOff, updateRequestStatus } from "./actions";

export function TimeOffClient({
  initialData,
  userRole,
}: {
  initialData: {
    types: any[];
    allocations: any[];
    requests: any[];
    currentEmployee: any;
    allEmployees: any[];
  };
  userRole: string;
}) {
  const [requests, setRequests] = useState(initialData.requests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const canApprove = ["ADMIN", "HR_MANAGER", "HR_PAYROLL_MANAGER"].includes(userRole);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (e < s) return 0;
    const diff = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await requestTimeOff(form);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to submit time off request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REFUSED") => {
    try {
      await updateRequestStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update request");
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Time Off & Leaves</h1>
          <p className="text-sm text-slate-400">
            Request vacation, sick leave, track balances, and manage team approvals
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Time Off
        </Button>
      </div>

      {/* Leave Balance Cards */}
      {initialData.allocations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {initialData.allocations.map((alloc) => {
            const remaining = Math.max(0, alloc.totalDays - alloc.usedDays);
            const percentage = Math.min(100, Math.round((remaining / alloc.totalDays) * 100));
            return (
              <Card key={alloc.id} className="bg-slate-900/60 border-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {alloc.type?.name}
                  </span>
                  <Badge variant="default">{alloc.year}</Badge>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-400">{remaining}</span>
                  <span className="text-xs text-slate-400">
                    days available / {alloc.totalDays} total
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>Used: {alloc.usedDays} days</span>
                  <span>{percentage}% remaining</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-slate-900/60 border-slate-800 p-5">
            <div className="text-xs text-amber-400 font-medium">Pending Requests</div>
            <div className="text-3xl font-black text-white mt-1">{pendingCount}</div>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800 p-5">
            <div className="text-xs text-emerald-400 font-medium">Approved Requests</div>
            <div className="text-3xl font-black text-white mt-1">{approvedCount}</div>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800 p-5">
            <div className="text-xs text-indigo-400 font-medium">Total Requests</div>
            <div className="text-3xl font-black text-white mt-1">{requests.length}</div>
          </Card>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {["ALL", "PENDING", "APPROVED", "REFUSED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {status}
            {status === "PENDING" && pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-slate-950 font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Type</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                {canApprove && <th className="py-3.5 px-4 text-right">Approval Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={canApprove ? 7 : 6} className="py-12 text-center text-slate-500">
                    No time off requests found for this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">
                        {req.employee?.firstName} {req.employee?.lastName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {req.employee?.employeeId}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {req.type?.name}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">
                      <div>From: {new Date(req.startDate).toLocaleDateString()}</div>
                      <div>To: {new Date(req.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {req.days} {req.days === 1 ? "day" : "days"}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400 max-w-xs truncate">
                      {req.reason || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "success"
                            : req.status === "PENDING"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                    {canApprove && (
                      <td className="py-3 px-4 text-right">
                        {req.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(req.id, "REFUSED")}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                            >
                              Refuse
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">
                            {req.approver ? `by ${req.approver.name}` : "Processed"}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Request Time Off */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Apply for Time Off"
        >
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            {canApprove && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Employee (Admin override)
                </label>
                <select
                  name="employeeId"
                  defaultValue={initialData.currentEmployee?.id || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  {initialData.allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Leave Type *
              </label>
              <select
                name="typeId"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Leave Type</option>
                {initialData.types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            {startDate && endDate && (
              <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-500/30 text-xs text-indigo-300 flex items-center justify-between">
                <span>Calculated Duration:</span>
                <span className="font-bold text-white text-sm">
                  {calculateDays()} Day(s)
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Reason / Note
              </label>
              <textarea
                name="reason"
                rows={3}
                placeholder="Describe reason for leave (medical appointment, family visit, etc.)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Leave Request"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
