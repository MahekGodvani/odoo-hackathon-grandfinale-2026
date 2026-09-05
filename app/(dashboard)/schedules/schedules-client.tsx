"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Modal,
} from "@/components/ui";
import { createSchedule, deleteSchedule } from "./actions";

interface Schedule {
  id: string;
  name: string;
  weeklyHours: number;
  workDays: string[];
  startTime: string;
  endTime: string;
  _count: {
    contracts: number;
  };
}

const ALL_DAYS = [
  { code: "MON", label: "Mon" },
  { code: "TUE", label: "Tue" },
  { code: "WED", label: "Wed" },
  { code: "THU", label: "Thu" },
  { code: "FRI", label: "Fri" },
  { code: "SAT", label: "Sat" },
  { code: "SUN", label: "Sun" },
];

export function SchedulesClient({
  schedules: initialSchedules,
  userRole,
}: {
  schedules: Schedule[];
  userRole: string;
}) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);

  const canManage = ["ADMIN", "HR_MANAGER", "HR_PAYROLL_MANAGER"].includes(userRole);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    // append selected days
    form.delete("workDays");
    selectedDays.forEach((d) => form.append("workDays", d));

    try {
      await createSchedule(form);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to create schedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete schedule "${name}"?`)) return;
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete schedule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Work Schedules</h1>
          <p className="text-sm text-slate-400">
            Define standard working hours, shifts, and weekly day distribution
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
            Add Schedule
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedules.map((sch) => (
          <Card
            key={sch.id}
            className="bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-all p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{sch.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {sch.weeklyHours} hours per week
                  </p>
                </div>
                <Badge variant="default">{sch._count.contracts} contracts</Badge>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Shift Hours:</span>
                  <span className="font-mono text-indigo-400 font-medium">
                    {sch.startTime} - {sch.endTime}
                  </span>
                </div>
                <div className="text-xs text-slate-400">Working Days:</div>
                <div className="flex gap-1.5 flex-wrap">
                  {ALL_DAYS.map((d) => {
                    const isActive = sch.workDays?.includes(d.code);
                    return (
                      <span
                        key={d.code}
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          isActive
                            ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                            : "bg-slate-800/40 text-slate-500 border border-slate-800"
                        }`}
                      >
                        {d.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {canManage && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                <button
                  onClick={() => handleDelete(sch.id, sch.name)}
                  disabled={sch._count.contracts > 0}
                  className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  title={sch._count.contracts > 0 ? "Cannot delete schedule assigned to active contracts" : ""}
                >
                  Delete Schedule
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Work Schedule"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Schedule Title *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Standard 40h (Mon-Fri) or Night Shift"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Weekly Hours *
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="weeklyHours"
                  defaultValue={40}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  defaultValue="09:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  defaultValue="18:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Select Active Working Days
              </label>
              <div className="flex gap-2 flex-wrap">
                {ALL_DAYS.map((d) => {
                  const isChecked = selectedDays.includes(d.code);
                  return (
                    <button
                      type="button"
                      key={d.code}
                      onClick={() => toggleDay(d.code)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                        isChecked
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
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
                {isSubmitting ? "Saving..." : "Create Schedule"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
