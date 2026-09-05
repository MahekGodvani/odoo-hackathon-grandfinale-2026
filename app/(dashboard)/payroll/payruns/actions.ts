"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { computePayslip } from "@/lib/payroll/engine";
import { revalidatePath } from "next/cache";

export async function getPayruns() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  if (session.user.role === "EMPLOYEE") {
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });
    if (!employee) return [];

    return prisma.payrun.findMany({
      where: {
        lines: {
          some: { employeeId: employee.id },
        },
      },
      include: {
        lines: {
          where: { employeeId: employee.id },
          include: {
            employee: true,
            payslip: true,
          },
        },
      },
      orderBy: { period: "desc" },
    });
  }

  return prisma.payrun.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      lines: {
        include: {
          employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, position: true } },
          contract: { select: { wage: true } },
          payslip: true,
        },
      },
    },
    orderBy: { period: "desc" },
  });
}

export async function createPayrun(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const name = formData.get("name") as string;
  const period = formData.get("period") as string; // YYYY-MM

  // Check if payrun already exists for period
  const existing = await prisma.payrun.findFirst({
    where: { period, tenantId: session.user.tenantId },
  });
  if (existing) {
    throw new Error(`Payrun for period ${period} already exists`);
  }

  const payrun = await prisma.payrun.create({
    data: {
      name,
      period,
      status: "DRAFT",
      tenantId: session.user.tenantId,
    },
  });

  // Find all employees with an ACTIVE contract
  const activeContracts = await prisma.contract.findMany({
    where: {
      status: "ACTIVE",
      employee: { tenantId: session.user.tenantId, status: "ACTIVE" },
    },
    include: { employee: true },
  });

  for (const contract of activeContracts) {
    await prisma.payrunLine.create({
      data: {
        payrunId: payrun.id,
        employeeId: contract.employeeId,
        contractId: contract.id,
      },
    });
  }

  revalidatePath("/payroll/payruns");
  return { success: true, payrunId: payrun.id };
}

export async function computePayrunAction(payrunId: string) {
  const session = await requireRole(HR_ROLES);

  const payrun = await prisma.payrun.findUnique({
    where: { id: payrunId },
    include: {
      lines: {
        include: {
          contract: {
            include: {
              structure: {
                include: {
                  rules: {
                    include: { taxSlabs: true },
                    orderBy: { sequence: "asc" },
                  },
                },
              },
            },
          },
          payslip: true,
        },
      },
    },
  });

  if (!payrun) throw new Error("Payrun not found");

  for (const line of payrun.lines) {
    const contract = line.contract;
    const structure = contract.structure;

    // Run computePayslip from engine
    const rulesInput: any = structure.rules.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      sequence: r.sequence,
      type: r.type,
      category: r.category,
      amount: r.amount,
      percentage: r.percentage,
      percentageOf: r.percentageOf,
      formula: r.formula,
      slabOn: r.slabOn,
      isActive: r.isActive,
      taxSlabs: r.taxSlabs,
    }));

    const result = computePayslip(contract.wage, rulesInput);

    if (line.payslip) {
      await prisma.payslip.update({
        where: { id: line.payslip.id },
        data: {
          period: payrun.period,
          grossSalary: result.grossSalary,
          totalDeductions: result.totalDeductions,
          netSalary: result.netSalary,
          breakdown: result.breakdown as any,
          status: "COMPUTED",
        },
      });
    } else {
      await prisma.payslip.create({
        data: {
          payrunLineId: line.id,
          employeeId: line.employeeId,
          period: payrun.period,
          grossSalary: result.grossSalary,
          totalDeductions: result.totalDeductions,
          netSalary: result.netSalary,
          breakdown: result.breakdown as any,
          status: "COMPUTED",
        },
      });
    }
  }

  await prisma.payrun.update({
    where: { id: payrunId },
    data: { status: "COMPUTED" },
  });

  revalidatePath("/payroll/payruns");
  return { success: true };
}

export async function validatePayrunAction(payrunId: string) {
  const session = await requireRole(HR_ROLES);

  await prisma.payrun.update({
    where: { id: payrunId },
    data: { status: "VALIDATED" },
  });

  await prisma.payslip.updateMany({
    where: { payrunLine: { payrunId } },
    data: { status: "VALIDATED" },
  });

  revalidatePath("/payroll/payruns");
  return { success: true };
}

export async function markPaidPayrunAction(payrunId: string) {
  const session = await requireRole(HR_ROLES);

  const now = new Date();
  await prisma.payrun.update({
    where: { id: payrunId },
    data: { status: "PAID" },
  });

  await prisma.payslip.updateMany({
    where: { payrunLine: { payrunId } },
    data: { status: "PAID", paidAt: now },
  });

  revalidatePath("/payroll/payruns");
  return { success: true };
}
