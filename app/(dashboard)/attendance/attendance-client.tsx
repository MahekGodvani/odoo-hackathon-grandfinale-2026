"use client";

import { useState, useEffect } from "react";
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
import { punchClock, logManualAttendance } from "./actions";

export function AttendanceClient({
  initialData,
  userRole,
}: {
  initialData: {
    attendances: any[];
    myEmployeeId: string | null;
    todayRecord: any | null;
    allEmployees: any[];
  };
  userRole: string;
}) {
  const [attendances, setAttendances] = useState(initialData.attendances);
  const [todayRecord, setTodayRecord] = useState(initialData.todayRecord);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isPunching, setIsPunching] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const canManage = ["ADMIN", "HR_MANAGER", "HR_PAYROLL_MANAGER"].includes(userRole);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = async () => {
    setIsPunching(true);
    try {
      await punchClock();
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to record attendance");
    } finally {
      setIsPunching(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await logManualAttendance(form);
      setIsManualModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to save attendance");
    }
  };

  const filteredAttendances = attendances.filter((att) => {
    const name = `${att.employee.firstName} ${att.employee.lastName}`.toLowerCase();
    const matchesSearch =
      name.includes(search.toLowerCase()) ||
      att.employee.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || att.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const halfDayCount = attendances.filter((a) => a.status === "HALF_DAY").length;
  const absentCount = attendances.filter((a) => a.status === "ABSENT").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Attendance & Time Tracking</h1>
          <p className="text-sm text-slate-400">
            Real-time punch-clock, shift verification, and daily work records
          </p>
        </div>
        {canManage && (
          <Button
            onClick={() => setIsManualModalOpen(true)}
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Manual Entry
          </Button>
        )}
      </div>

      {/* Hero Punch Clock & Live Time Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/20 p-6 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                Self-Service Time Clock
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider mt-1">
                {currentTime || "00:00:00"}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div>
              {!todayRecord ? (
                <Button
                  onClick={handlePunch}
                  disabled={isPunching}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-6 text-base font-semibold shadow-lg shadow-emerald-600/20"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {isPunching ? "Recording..." : "Check In Now"}
                </Button>
              ) : !todayRecord.checkOut ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Checked In At
                    </span>
                    <span className="font-mono text-sm text-emerald-400 font-bold">
                      {new Date(todayRecord.checkIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <Button
                    onClick={handlePunch}
                    disabled={isPunching}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-6 text-base font-semibold shadow-lg shadow-amber-600/20"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {isPunching ? "Recording..." : "Check Out"}
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center">
                  <Badge variant="success">Completed Shift Today</Badge>
                  <p className="text-xs text-slate-400 mt-1">
                    Worked: <span className="text-white font-bold">{todayRecord.workedHours} hrs</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-slate-900/60 border-slate-800 p-4">
            <div className="text-xs text-emerald-400 font-medium">Present Logs</div>
            <div className="text-2xl font-bold text-white mt-1">{presentCount}</div>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800 p-4">
            <div className="text-xs text-amber-400 font-medium">Half Day</div>
            <div className="text-2xl font-bold text-white mt-1">{halfDayCount}</div>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800 p-4">
            <div className="text-xs text-rose-400 font-medium">Absences</div>
            <div className="text-2xl font-bold text-white mt-1">{absentCount}</div>
          </Card>
          <Card className="bg-slate-900/60 border-slate-800 p-4">
            <div className="text-xs text-indigo-400 font-medium">Total Entries</div>
            <div className="text-2xl font-bold text-white mt-1">{attendances.length}</div>
          </Card>
        </div>
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
              placeholder="Search logs by employee name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="ABSENT">Absent</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </CardContent>
      </Card>

      {/* Attendance Logs Table */}
      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Check In</th>
                <th className="py-3.5 px-4">Check Out</th>
                <th className="py-3.5 px-4">Worked Hours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      {new Date(att.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/employees/${att.employee.id}`}
                        className="text-indigo-400 hover:underline font-medium"
                      >
                        {att.employee.firstName} {att.employee.lastName}
                      </Link>
                      <div className="text-xs text-slate-500 font-mono">
                        {att.employee.employeeId}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">
                      {att.checkIn
                        ? new Date(att.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-300">
                      {att.checkOut
                        ? new Date(att.checkOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
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
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {att.notes || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Manual Attendance Modal */}
      {isManualModalOpen && (
        <Modal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          title="Manual Attendance Entry"
        >
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Employee *
              </label>
              <select
                name="employeeId"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="">Select Employee</option>
                {initialData.allEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Check In Time
                </label>
                <input
                  type="time"
                  name="checkIn"
                  defaultValue="09:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Check Out Time
                </label>
                <input
                  type="time"
                  name="checkOut"
                  defaultValue="18:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Attendance Status
              </label>
              <select
                name="status"
                defaultValue="PRESENT"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="HALF_DAY">HALF DAY</option>
                <option value="ABSENT">ABSENT</option>
                <option value="ON_LEAVE">ON LEAVE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Notes
              </label>
              <input
                name="notes"
                placeholder="e.g. Approved on-site client visit"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsManualModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Attendance Record</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
