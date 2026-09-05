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
import { createStructure, deleteStructure } from "./actions";

interface SalaryRule {
  id: string;
  name: string;
  code: string;
  sequence: number;
  type: string;
  category: string;
  amount?: number | null;
  percentage?: number | null;
  percentageOf?: string | null;
  formula?: string | null;
}

interface Structure {
  id: string;
  name: string;
  description?: string | null;
  rules: SalaryRule[];
  _count: {
    contracts: number;
  };
}

export function StructuresClient({
  structures: initialStructures,
  userRole,
}: {
  structures: Structure[];
  userRole: string;
}) {
  const [structures, setStructures] = useState(initialStructures);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = ["ADMIN", "HR_PAYROLL_MANAGER"].includes(userRole);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      await createStructure(form);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to create structure");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete structure "${name}"?`)) return;
    try {
      await deleteStructure(id);
      setStructures((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete structure");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Salary Structures</h1>
          <p className="text-sm text-slate-400">
            Define calculation pipelines, statutory contributions, and compensation blueprints
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/payroll/rules">
            <Button variant="outline" className="border-slate-700">
              Salary Rules Builder &rarr;
            </Button>
          </Link>
          {canManage && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Structure
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structures.map((s) => (
          <Card
            key={s.id}
            className="bg-slate-900/70 border-slate-800 hover:border-slate-700 transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.description || "Standard payroll structure template"}
                  </p>
                </div>
                <Badge variant="default">{s._count.contracts} contracts assigned</Badge>
              </div>

              {/* Rules Sequence Preview */}
              <div className="mt-5 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Execution Rules ({s.rules.length})</span>
                  <span>Category</span>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {s.rules.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500 w-4">
                          #{r.sequence}
                        </span>
                        <span className="font-medium text-white">{r.name}</span>
                        <code className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-400">
                          {r.code}
                        </code>
                      </div>
                      <Badge
                        variant={
                          r.category === "BASIC"
                            ? "default"
                            : r.category === "ALLOWANCE"
                            ? "success"
                            : r.category === "DEDUCTION"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {r.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href="/payroll/rules"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Configure Rules &rarr;
              </Link>
              {canManage && (
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  disabled={s._count.contracts > 0}
                  className="text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40"
                >
                  Delete Structure
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Salary Structure"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Structure Name *
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Regular Indian Tech CTC Structure"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="Details about components and target employee tier..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-500/30 text-xs text-slate-300">
              💡 <span className="font-semibold text-indigo-300">Auto-Provisioning:</span>{" "}
              Creating this structure will automatically generate default statutory rules (BASIC, HRA, SPECIAL, GROSS, PF, PT, and NET) with customizable formula pipelines.
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
                {isSubmitting ? "Creating..." : "Create & Initialize"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
