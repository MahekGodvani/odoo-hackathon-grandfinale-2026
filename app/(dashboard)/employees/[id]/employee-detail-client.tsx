"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  Badge,
  Button,
} from "@/components/ui";

export function EmployeeDetailClient({
  employee,
  userRole,
}: {
  employee: any;
  userRole: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "contract" | "attendance" | "leaves" | "bank"
  >("overview");

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const activeContract = employee.contracts?.find((c: any) => c.status === "ACTIVE") || employee.contracts?.[0];

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Directory
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs text-slate-300 font-mono">{employee.employeeId}</span>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border-b border-slate-800" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="ring-4 ring-slate-900 rounded-full bg-slate-900">
                <Avatar name={fullName} size="lg" className="w-20 h-20 text-xl font-bold" />
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
                  <Badge
                    variant={
                      employee.status === "ACTIVE"
                        ? "success"
                        : employee.status === "ON_LEAVE"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">
                  {employee.position} &bull;{" "}
                  <span className="text-indigo-400 font-medium">
                    {employee.department?.name || "General"}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {employee.employeeId}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-6 mt-4">
            {[
              { id: "overview", label: "Overview" },
              { id: "contract", label: "Contract & Salary" },
              { id: "attendance", label: "Attendance" },
              { id: "leaves", label: "Time Off" },
              { id: "bank", label: "Bank & Compliance" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white">Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Employee ID</span>
                <span className="font-mono text-indigo-400">{employee.employeeId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Department</span>
                <span className="text-white font-medium">{employee.department?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Designation</span>
                <span className="text-white font-medium">{employee.position}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Date of Joining</span>
                <span className="text-white font-medium">
                  {new Date(employee.dateOfJoining).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">System Role</span>
                <Badge variant="default">{employee.user?.role || "EMPLOYEE"}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white">Contact & Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Work Email</span>
                <span className="text-white font-medium">{employee.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Phone</span>
                <span className="text-white font-medium">{employee.phone || "Not recorded"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Date of Birth</span>
                <span className="text-white font-medium">
                  {employee.dateOfBirth
                    ? new Date(employee.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Status</span>
                <span className="text-white font-medium">{employee.status}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Contract & Compensation */}
      {activeTab === "contract" && (
        <div className="space-y-6">
          {activeContract ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/60 border-slate-800 p-5">
                <div className="text-xs text-slate-400">Contract Reference</div>
                <div className="text-lg font-bold text-white mt-1">{activeContract.name}</div>
                <div className="mt-2">
                  <Badge
                    variant={
                      activeContract.status === "ACTIVE"
                        ? "success"
                        : activeContract.status === "DRAFT"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {activeContract.status}
                  </Badge>
                </div>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 p-5">
                <div className="text-xs text-slate-400">Monthly Base Wage</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  ₹{Number(activeContract.baseWage).toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Annual CTC: ~₹{(Number(activeContract.baseWage) * 12).toLocaleString("en-IN")}
                </div>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800 p-5">
                <div className="text-xs text-slate-400">Assigned Salary Structure</div>
                <div className="text-base font-semibold text-indigo-400 mt-1">
                  {activeContract.structure?.name || "Standard Structure"}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Schedule: {activeContract.schedule?.name || "Standard 40h/week"}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-900/60 border-slate-800 p-8 text-center">
              <p className="text-slate-400 text-sm">No active contract found for this employee.</p>
              <Link href="/contracts">
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-500">
                  Create Contract
                </Button>
              </Link>
            </Card>
          )}

          {/* Past Contracts List */}
          {employee.contracts?.length > 0 && (
            <Card className="bg-slate-900/60 border-slate-800">
              <CardHeader>
                <CardTitle className="text-base text-white">Contract Timeline</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase">
                      <th className="py-3 px-4">Contract</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Start Date</th>
                      <th className="py-3 px-4">End Date</th>
                      <th className="py-3 px-4">Base Wage</th>
                      <th className="py-3 px-4">Structure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm">
                    {employee.contracts.map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-medium text-white">{c.name}</td>
                        <td className="py-3 px-4">
                          <Badge variant={c.status === "ACTIVE" ? "success" : "default"}>
                            {c.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {new Date(c.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {c.endDate ? new Date(c.endDate).toLocaleDateString() : "Open-ended"}
                        </td>
                        <td className="py-3 px-4 font-medium text-emerald-400">
                          ₹{Number(c.baseWage).toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {c.structure?.name || "Standard"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Tab 3: Attendance History */}
      {activeTab === "attendance" && (
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-white">Recent Attendance Logs</CardTitle>
            <Link href="/attendance">
              <Button variant="outline" size="sm">
                Open Full Attendance
              </Button>
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Worked Hours</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {employee.attendances?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No attendance logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  employee.attendances.map((att: any) => (
                    <tr key={att.id}>
                      <td className="py-3 px-4 font-medium text-white">
                        {new Date(att.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                        {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">
                        {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {att.workedHours ? `${att.workedHours.toFixed(1)} hrs` : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            att.status === "PRESENT"
                              ? "success"
                              : att.status === "HALF_DAY"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {att.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 4: Time Off */}
      {activeTab === "leaves" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {employee.timeOffAllocations?.map((alloc: any) => (
              <Card key={alloc.id} className="bg-slate-900/60 border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    {alloc.type?.name}
                  </span>
                  <Badge variant="default">{alloc.remainingDays} days left</Badge>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{alloc.remainingDays}</span>
                  <span className="text-xs text-slate-500">/ {alloc.totalDays} allocated</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (alloc.remainingDays / (alloc.totalDays || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base text-white">Leave Requests</CardTitle>
              <Link href="/time-off">
                <Button variant="outline" size="sm">
                  Apply Leave
                </Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase">
                    <th className="py-3 px-4">Leave Type</th>
                    <th className="py-3 px-4">Start</th>
                    <th className="py-3 px-4">End</th>
                    <th className="py-3 px-4">Days</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {employee.timeOffRequests?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No leave history found.
                      </td>
                    </tr>
                  ) : (
                    employee.timeOffRequests.map((req: any) => (
                      <tr key={req.id}>
                        <td className="py-3 px-4 font-medium text-white">{req.type?.name}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {new Date(req.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {new Date(req.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{req.days}</td>
                        <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
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
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 5: Bank & Compliance */}
      {activeTab === "bank" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white">Bank Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Bank Name</span>
                <span className="text-white font-medium">HDFC Bank Ltd.</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Account Number</span>
                <span className="font-mono text-white">••••••••4892</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">IFSC / Routing Code</span>
                <span className="font-mono text-indigo-400">HDFC0001248</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Account Type</span>
                <span className="text-white">Salary Account</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base text-white">Statutory & Tax Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">PAN / Tax ID</span>
                <span className="font-mono text-white">ABCDE1234F</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">UAN (Provident Fund)</span>
                <span className="font-mono text-indigo-400">101482910482</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">ESI Insurance IP</span>
                <span className="font-mono text-white">310492810482</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Compliance Status</span>
                <Badge variant="success">Verified & Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
