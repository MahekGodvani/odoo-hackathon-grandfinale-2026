import { z } from "zod";

// ─── User / Auth ────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userRoles = [
  "EMPLOYEE",
  "HR_MANAGER",
  "HR_PAYROLL_USER",
  "HR_PAYROLL_MANAGER",
  "ADMIN",
] as const;

export type UserRoleType = (typeof userRoles)[number];

// ─── Employee ───────────────────────────────────────────────────

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  position: z.string().min(1, "Position is required"),
  departmentId: z.string().min(1, "Department is required"),
  status: z.enum(["ONBOARDING", "ACTIVE", "ON_LEAVE", "OFFBOARDED"]).default("ONBOARDING"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

// ─── Department ─────────────────────────────────────────────────

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

// ─── Contract ───────────────────────────────────────────────────

export const contractSchema = z.object({
  name: z.string().min(1, "Contract name is required"),
  employeeId: z.string().min(1, "Employee is required"),
  scheduleId: z.string().min(1, "Schedule is required"),
  structureId: z.string().min(1, "Salary structure is required"),
  wage: z.coerce.number().positive("Wage must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "EXPIRED", "TERMINATED"]).default("DRAFT"),
  notes: z.string().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;

// ─── Work Schedule ──────────────────────────────────────────────

export const scheduleSchema = z.object({
  name: z.string().min(1, "Schedule name is required"),
  weeklyHours: z.coerce.number().positive().default(40),
  workDays: z.array(z.string()).min(1, "Select at least one work day"),
  startTime: z.string().default("09:00"),
  endTime: z.string().default("17:00"),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

// ─── Attendance ─────────────────────────────────────────────────

export const attendanceSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  date: z.string().min(1, "Date is required"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(["PRESENT", "ABSENT", "HALF_DAY", "ON_LEAVE"]).default("PRESENT"),
  notes: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceSchema>;

// ─── Time Off ───────────────────────────────────────────────────

export const timeOffTypeSchema = z.object({
  name: z.string().min(1, "Leave type name is required"),
  color: z.string().default("#3B82F6"),
  requiresApproval: z.boolean().default(true),
});

export const timeOffAllocationSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  typeId: z.string().min(1, "Leave type is required"),
  totalDays: z.coerce.number().positive("Total days must be positive"),
  year: z.coerce.number().int().min(2020).max(2030),
});

export const timeOffRequestSchema = z.object({
  typeId: z.string().min(1, "Leave type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  days: z.coerce.number().positive("Days must be positive"),
  reason: z.string().optional(),
});

export type TimeOffRequestFormData = z.infer<typeof timeOffRequestSchema>;

// ─── Salary Structure ───────────────────────────────────────────

export const salaryStructureSchema = z.object({
  name: z.string().min(1, "Structure name is required"),
  description: z.string().optional(),
});

// ─── Salary Rule ────────────────────────────────────────────────

export const salaryRuleSchema = z.object({
  structureId: z.string().min(1, "Structure is required"),
  name: z.string().min(1, "Rule name is required"),
  code: z.string().min(1, "Code is required").regex(/^[A-Z_]+$/, "Code must be uppercase with underscores"),
  sequence: z.coerce.number().int().min(1, "Sequence must be at least 1"),
  type: z.enum(["FIXED", "PERCENTAGE", "FORMULA", "SLAB"]),
  category: z.enum(["BASIC", "ALLOWANCE", "DEDUCTION", "GROSS", "NET"]),
  amount: z.coerce.number().optional(),
  percentage: z.coerce.number().optional(),
  percentageOf: z.string().optional(),
  formula: z.string().optional(),
  slabOn: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type SalaryRuleFormData = z.infer<typeof salaryRuleSchema>;

// ─── Tax Slab ───────────────────────────────────────────────────

export const taxSlabSchema = z.object({
  ruleId: z.string().min(1, "Rule is required"),
  minIncome: z.coerce.number().min(0),
  maxIncome: z.coerce.number().positive(),
  rate: z.coerce.number().min(0).max(100),
  fixedAmount: z.coerce.number().default(0),
  financialYear: z.string().min(1, "Financial year is required"),
});

// ─── Payrun ─────────────────────────────────────────────────────

export const payrunCreateSchema = z.object({
  name: z.string().min(1, "Payrun name is required"),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be YYYY-MM format"),
  employeeIds: z.array(z.string()).min(1, "Select at least one employee"),
});

export type PayrunCreateFormData = z.infer<typeof payrunCreateSchema>;
