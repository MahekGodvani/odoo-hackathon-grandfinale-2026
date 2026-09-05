/**
 * PeoplePay360 — Salary Rule Engine
 *
 * The core differentiator. Evaluates salary rules in sequence to compute
 * a payslip breakdown from a contract's base wage.
 *
 * Rule types:
 *   FIXED      → context[code] = rule.amount
 *   PERCENTAGE → context[code] = context[rule.percentageOf] * rule.percentage / 100
 *   FORMULA    → context[code] = mathjs.evaluate(rule.formula, context)
 *   SLAB       → context[code] = lookupSlab(context[rule.slabOn], rule.taxSlabs)
 *
 * All computation is deterministic. AI is never used for salary math.
 */

import { evaluate } from "mathjs";

// ─── Types ──────────────────────────────────────────────────────

export interface TaxSlabEntry {
  minIncome: number;
  maxIncome: number;
  rate: number;
  fixedAmount: number;
}

export interface SalaryRuleInput {
  id: string;
  code: string;
  name: string;
  sequence: number;
  type: "FIXED" | "PERCENTAGE" | "FORMULA" | "SLAB";
  category: "BASIC" | "ALLOWANCE" | "DEDUCTION" | "GROSS" | "NET";
  amount?: number | null;
  percentage?: number | null;
  percentageOf?: string | null;
  formula?: string | null;
  slabOn?: string | null;
  isActive: boolean;
  taxSlabs?: TaxSlabEntry[];
}

export interface PayslipBreakdownItem {
  ruleId: string;
  code: string;
  name: string;
  category: string;
  amount: number;
  sequence: number;
}

export interface PayslipResult {
  basicSalary: number;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  breakdown: PayslipBreakdownItem[];
  context: Record<string, number>;
}

// ─── Slab Lookup ────────────────────────────────────────────────

export function computeSlabAmount(
  income: number,
  slabs: TaxSlabEntry[]
): number {
  if (!slabs || slabs.length === 0) return 0;

  // Sort slabs by minIncome ascending
  const sorted = [...slabs].sort((a, b) => a.minIncome - b.minIncome);

  for (const slab of sorted) {
    if (income >= slab.minIncome && income <= slab.maxIncome) {
      return slab.fixedAmount + (income * slab.rate) / 100;
    }
  }

  // If income exceeds all slabs, use the last slab
  const lastSlab = sorted[sorted.length - 1];
  if (income > lastSlab.maxIncome) {
    return lastSlab.fixedAmount + (income * lastSlab.rate) / 100;
  }

  return 0;
}

// ─── Rule Evaluator ─────────────────────────────────────────────

export function evaluateRule(
  rule: SalaryRuleInput,
  context: Record<string, number>
): number {
  if (!rule.isActive) return 0;

  switch (rule.type) {
    case "FIXED": {
      if (rule.amount == null) {
        throw new Error(`Rule ${rule.code}: FIXED rule requires an amount`);
      }
      return rule.amount;
    }

    case "PERCENTAGE": {
      if (rule.percentage == null || !rule.percentageOf) {
        throw new Error(
          `Rule ${rule.code}: PERCENTAGE rule requires percentage and percentageOf`
        );
      }
      const baseValue = context[rule.percentageOf];
      if (baseValue === undefined) {
        throw new Error(
          `Rule ${rule.code}: Referenced code '${rule.percentageOf}' not found in context`
        );
      }
      return (baseValue * rule.percentage) / 100;
    }

    case "FORMULA": {
      if (!rule.formula) {
        throw new Error(`Rule ${rule.code}: FORMULA rule requires a formula`);
      }
      try {
        const result = evaluate(rule.formula, { ...context });
        if (typeof result !== "number" || isNaN(result)) {
          throw new Error(`Formula evaluation returned non-numeric result`);
        }
        return result;
      } catch (err) {
        throw new Error(
          `Rule ${rule.code}: Formula evaluation failed — ${(err as Error).message}`
        );
      }
    }

    case "SLAB": {
      if (!rule.slabOn) {
        throw new Error(`Rule ${rule.code}: SLAB rule requires slabOn reference`);
      }
      const slabBase = context[rule.slabOn];
      if (slabBase === undefined) {
        throw new Error(
          `Rule ${rule.code}: Referenced code '${rule.slabOn}' not found in context`
        );
      }
      if (!rule.taxSlabs || rule.taxSlabs.length === 0) {
        throw new Error(`Rule ${rule.code}: SLAB rule requires tax slab entries`);
      }
      return computeSlabAmount(slabBase, rule.taxSlabs);
    }

    default:
      throw new Error(`Rule ${rule.code}: Unknown rule type '${rule.type}'`);
  }
}

// ─── Payslip Computation ────────────────────────────────────────

export function computePayslip(
  wage: number,
  rules: SalaryRuleInput[]
): PayslipResult {
  // Sort rules by sequence
  const sortedRules = [...rules].sort((a, b) => a.sequence - b.sequence);

  // Initialize context with the base wage
  const context: Record<string, number> = { BASIC: wage };
  const breakdown: PayslipBreakdownItem[] = [];

  let grossSalary = 0;
  let totalDeductions = 0;

  for (const rule of sortedRules) {
    if (!rule.isActive) continue;

    // Skip if it's the BASIC rule and we already set it
    if (rule.code === "BASIC" && rule.type === "FIXED") {
      // Basic is already in context from wage, but the rule might override it
      const amount = evaluateRule(rule, context);
      context[rule.code] = amount;
    } else {
      const amount = evaluateRule(rule, context);
      context[rule.code] = Math.round(amount * 100) / 100; // Round to 2 decimal places
    }

    const computedAmount = context[rule.code];

    breakdown.push({
      ruleId: rule.id,
      code: rule.code,
      name: rule.name,
      category: rule.category,
      amount: computedAmount,
      sequence: rule.sequence,
    });

    // Accumulate gross and deductions
    if (rule.category === "BASIC" || rule.category === "ALLOWANCE") {
      grossSalary += computedAmount;
    } else if (rule.category === "DEDUCTION") {
      totalDeductions += computedAmount;
    }
  }

  // If no BASIC rule was in the rules, add wage to gross
  if (!sortedRules.some((r) => r.category === "BASIC")) {
    grossSalary += wage;
  }

  // Set computed totals in context
  context.GROSS = Math.round(grossSalary * 100) / 100;
  context.TOTAL_DEDUCTIONS = Math.round(totalDeductions * 100) / 100;
  context.NET = Math.round((grossSalary - totalDeductions) * 100) / 100;

  // Process GROSS and NET rules if they exist
  for (const rule of sortedRules) {
    if (rule.category === "GROSS" && rule.isActive) {
      context[rule.code] = context.GROSS;
      const idx = breakdown.findIndex((b) => b.code === rule.code);
      if (idx >= 0) {
        breakdown[idx].amount = context.GROSS;
      } else {
        breakdown.push({
          ruleId: rule.id,
          code: rule.code,
          name: rule.name,
          category: rule.category,
          amount: context.GROSS,
          sequence: rule.sequence,
        });
      }
    }
    if (rule.category === "NET" && rule.isActive) {
      context[rule.code] = context.NET;
      const idx = breakdown.findIndex((b) => b.code === rule.code);
      if (idx >= 0) {
        breakdown[idx].amount = context.NET;
      } else {
        breakdown.push({
          ruleId: rule.id,
          code: rule.code,
          name: rule.name,
          category: rule.category,
          amount: context.NET,
          sequence: rule.sequence,
        });
      }
    }
  }

  return {
    basicSalary: context.BASIC,
    grossSalary: context.GROSS,
    totalDeductions: context.TOTAL_DEDUCTIONS,
    netSalary: context.NET,
    breakdown: breakdown.sort((a, b) => a.sequence - b.sequence),
    context,
  };
}

// ─── Helpers ────────────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month >= 3) {
    // April onwards
    return `${year}-${(year + 1).toString().slice(2)}`;
  }
  return `${year - 1}-${year.toString().slice(2)}`;
}
