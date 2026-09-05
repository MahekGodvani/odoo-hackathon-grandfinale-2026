"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Button,
  Input,
  Select,
  Badge,
  Modal,
  Avatar,
} from "@/components/ui";
import { createEmployee, deleteEmployee } from "./actions";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  position: string;
  status: "ACTIVE" | "ON_LEAVE" | "TERMINATED";
  dateOfJoining: string | Date;
  department?: Department | null;
  contracts?: Array<{ id: string; status: string; baseWage: number }>;
}

export function EmployeesClient({
  employees: initialEmployees,
  departments,
  userRole,
}: {
  employees: Employee[];
  departments: Department[];
  userRole: string;
}) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canManage = ["ADMIN", "HR_MANAGER"].includes(userRole);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDept === "ALL" || emp.department?.id === selectedDept;
    const matchesStatus =
      selectedStatus === "ALL" || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
  const onLeaveCount = employees.filter((e) => e.status === "ON_LEAVE").length;
  const terminatedCount = employees.filter((e) => e.status === "TERMINATED").length;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      await createEmployee(formData);
      setIsAddModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to create employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate/delete ${name}?`)) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Employees</h1>
          <p className="text-sm text-slate-400">
            Manage your workforce lifecycle, contracts, and profiles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "kanban"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Kanban
            </button>
          </div>
          {canManage && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* KPI Mini-Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-slate-800/80 p-4">
          <div className="text-xs text-slate-400 font-medium">Total Directory</div>
          <div className="text-2xl font-bold text-white mt-1">{employees.length}</div>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800/80 p-4">
          <div className="text-xs text-emerald-400 font-medium">Active Personnel</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800/80 p-4">
          <div className="text-xs text-amber-400 font-medium">On Leave</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{onLeaveCount}</div>
        </Card>
        <Card className="bg-slate-900/60 border-slate-800/80 p-4">
          <div className="text-xs text-rose-400 font-medium">Terminated</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{terminatedCount}</div>
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
              placeholder="Search by name, ID, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* List View */}
      {viewMode === "list" ? (
        <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      No employees match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                          <div>
                            <Link
                              href={`/employees/${emp.id}`}
                              className="font-medium text-white group-hover:text-indigo-400 transition-colors"
                            >
                              {emp.firstName} {emp.lastName}
                            </Link>
                            <div className="text-xs text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-indigo-400">
                        {emp.employeeId}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {emp.department?.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{emp.position}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            emp.status === "ACTIVE"
                              ? "success"
                              : emp.status === "ON_LEAVE"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(emp.dateOfJoining).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/employees/${emp.id}`}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20"
                          >
                            Profile
                          </Link>
                          {canManage && (
                            <button
                              onClick={() =>
                                handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)
                              }
                              className="text-xs font-medium text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["ACTIVE", "ON_LEAVE", "TERMINATED"] as const).map((colStatus) => {
            const colEmployees = filteredEmployees.filter(
              (e) => e.status === colStatus
            );
            return (
              <div key={colStatus} className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        colStatus === "ACTIVE"
                          ? "bg-emerald-500"
                          : colStatus === "ON_LEAVE"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                    <h3 className="font-semibold text-sm text-slate-200 capitalize">
                      {colStatus.toLowerCase().replace("_", " ")}
                    </h3>
                  </div>
                  <Badge variant="default">{colEmployees.length}</Badge>
                </div>
                <div className="space-y-3">
                  {colEmployees.map((emp) => (
                    <Card
                      key={emp.id}
                      className="bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-all p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${emp.firstName} ${emp.lastName}`} size="md" />
                          <div>
                            <Link
                              href={`/employees/${emp.id}`}
                              className="font-semibold text-sm text-white hover:text-indigo-400"
                            >
                              {emp.firstName} {emp.lastName}
                            </Link>
                            <p className="text-xs text-slate-400">{emp.position}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          {emp.employeeId}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>{emp.department?.name || "General"}</span>
                        <Link
                          href={`/employees/${emp.id}`}
                          className="text-indigo-400 hover:underline"
                        >
                          View &rarr;
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Employee"
        >
          {error && (
            <div className="p-3 mb-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  required
                  placeholder="e.g. John"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Last Name *
                </label>
                <input
                  name="lastName"
                  required
                  placeholder="e.g. Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john.doe@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Department *
                </label>
                <select
                  name="departmentId"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Job Position *
                </label>
                <input
                  name="position"
                  required
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Date of Joining *
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Initial Status
                </label>
                <select
                  name="status"
                  defaultValue="ACTIVE"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              * Creates an employee directory record and auto-provisions an initial employee portal login with temporary password <code className="text-indigo-400">password123</code>.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Save Employee"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
