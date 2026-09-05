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
import { createOrUpdateSalaryRule, deleteSalaryRule } from "./actions";

export function RulesClient({
  initialData,
  userRole,
}: {
  initialData: {
    structures: any[];
  };
  userRole: string;
}) {
  const [structures, setStructures] = useState(initialData.structures);
  const [selectedStructureId, setSelectedStructureId] = useState<string>(
    structures[0]?.id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [ruleType, setRuleType] = useState<"FIXED" | "PERCENTAGE" | "FORMULA" | "SLAB">("PERCENTAGE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = ["ADMIN", "HR_PAYROLL_MANAGER"].includes(userRole);

  const currentStructure = structures.find((s) => s.id === selectedStructureId) || structures[0];
  const rules = currentStructure?.rules || [];

  const openCreateModal = () => {
    setEditingRule(null);
    setRuleType("PERCENTAGE");
    setIsModalOpen(true);
  };

  const openEditModal = (rule: any) => {
    setEditingRule(rule);
    setRuleType(rule.type);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    form.append("structureId", selectedStructureId);
    if (editingRule) {
      form.append("id", editingRule.id);
    }
    try {
      await createOrUpdateSalaryRule(form);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to save salary rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete rule "${name}"? This may affect payrun computation.`)) return;
    try {
      await deleteSalaryRule(id);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to delete rule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Salary Rule Engine</h1>
          <p className="text-sm text-slate-400">
            Design mathematical computation pipelines, allowances, and statutory deductions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/payroll/structures">
            <Button variant="outline" className="border-slate-700">
              Structures &rarr;
            </Button>
          </Link>
          {canManage && (
            <Button
              onClick={openCreateModal}
              className="bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Rule
            </Button>
          )}
        </div>
      </div>

      {/* Structure Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Structure:
        </span>
        {structures.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStructureId(s.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedStructureId === s.id
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            }`}
          >
            {s.name} ({s.rules.length} rules)
          </button>
        ))}
      </div>

      {/* Rules Computation Pipeline Table */}
      <Card className="bg-slate-900/60 border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base text-white flex items-center justify-between">
            <span>Execution Pipeline for: {currentStructure?.name}</span>
            <span className="text-xs font-normal text-slate-400">
              Evaluated sequentially in ascending order #
            </span>
          </CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">Seq #</th>
                <th className="py-3.5 px-4">Rule Name</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Computation Definition</th>
                {canManage && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No rules defined for this structure yet.
                  </td>
                </tr>
              ) : (
                rules.map((rule: any) => (
                  <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-400">
                      #{rule.sequence}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {rule.name}
                      {rule.description && (
                        <p className="text-[11px] text-slate-500 font-normal">{rule.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs font-bold bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                        {rule.code}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          rule.category === "BASIC"
                            ? "default"
                            : rule.category === "ALLOWANCE"
                            ? "success"
                            : rule.category === "DEDUCTION"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {rule.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-400">
                      {rule.type}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-emerald-400">
                      {rule.type === "FIXED" && `₹${rule.amount}`}
                      {rule.type === "PERCENTAGE" && `${rule.percentage}% of [${rule.percentageOf || "WAGE"}]`}
                      {rule.type === "FORMULA" && (
                        <span className="text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                          {rule.formula}
                        </span>
                      )}
                      {rule.type === "SLAB" && `Tax Slabs on [${rule.slabOn || "GROSS"}]`}
                    </td>
                    {canManage && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(rule)}
                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rule.id, rule.name)}
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

      {/* Modal: Create/Edit Rule */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRule ? `Edit Rule: ${editingRule.name}` : "Add Salary Rule"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Rule Name *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={editingRule?.name || ""}
                  placeholder="e.g. House Rent Allowance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Unique Code *
                </label>
                <input
                  name="code"
                  required
                  defaultValue={editingRule?.code || ""}
                  placeholder="e.g. HRA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Sequence # *
                </label>
                <input
                  type="number"
                  name="sequence"
                  required
                  defaultValue={editingRule?.sequence || rules.length + 1}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  defaultValue={editingRule?.category || "ALLOWANCE"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="ALLOWANCE">ALLOWANCE</option>
                  <option value="DEDUCTION">DEDUCTION</option>
                  <option value="GROSS">GROSS</option>
                  <option value="NET">NET</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Computation Type *
                </label>
                <select
                  name="type"
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FORMULA">FORMULA</option>
                  <option value="FIXED">FIXED</option>
                  <option value="SLAB">TAX SLAB</option>
                </select>
              </div>
            </div>

            {/* Dynamic fields based on Rule Type */}
            {ruleType === "FIXED" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Fixed Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  defaultValue={editingRule?.amount || ""}
                  required
                  placeholder="200"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            )}

            {ruleType === "PERCENTAGE" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Percentage (%) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="percentage"
                    defaultValue={editingRule?.percentage || 50}
                    required
                    placeholder="40"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Percentage of Code *
                  </label>
                  <input
                    name="percentageOf"
                    defaultValue={editingRule?.percentageOf || "BASIC"}
                    required
                    placeholder="e.g. WAGE or BASIC"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase"
                  />
                </div>
              </div>
            )}

            {ruleType === "FORMULA" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Mathematical Expression *
                </label>
                <input
                  name="formula"
                  defaultValue={editingRule?.formula || ""}
                  required
                  placeholder="e.g. GROSS - PF - PT"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Use standard arithmetic: +, -, *, /. Reference preceding rule codes like{" "}
                  <code className="text-indigo-400">BASIC</code>, <code className="text-indigo-400">HRA</code>, <code className="text-indigo-400">GROSS</code>.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Description / Notes
              </label>
              <textarea
                name="description"
                defaultValue={editingRule?.description || ""}
                rows={2}
                placeholder="Statutory explanation or compliance section..."
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
                {isSubmitting ? "Saving..." : "Save Rule"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
