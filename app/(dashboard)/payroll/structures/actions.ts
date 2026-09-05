"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getStructures() {
  const session = await requireRole(HR_ROLES);
  return prisma.salaryStructure.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      rules: { orderBy: { sequence: "asc" } },
      _count: { select: { contracts: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function createStructure(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string || null;

  const struct = await prisma.salaryStructure.create({
    data: {
      name,
      description,
      tenantId: session.user.tenantId,
    },
  });

  // Seed default core rules for any new structure: BASIC, HRA, PF, GROSS, NET
  const defaultRules = [
    {
      name: "Basic Salary",
      code: "BASIC",
      sequence: 1,
      type: "PERCENTAGE" as const,
      category: "BASIC" as const,
      percentage: 50,
      percentageOf: "WAGE",
      description: "50% of Base Contract Wage",
    },
    {
      name: "House Rent Allowance (HRA)",
      code: "HRA",
      sequence: 2,
      type: "PERCENTAGE" as const,
      category: "ALLOWANCE" as const,
      percentage: 40,
      percentageOf: "BASIC",
      description: "40% of Basic Pay",
    },
    {
      name: "Special Allowance",
      code: "SPECIAL",
      sequence: 3,
      type: "FORMULA" as const,
      category: "ALLOWANCE" as const,
      formula: "WAGE - BASIC - HRA",
      description: "Balancing component to equal full wage",
    },
    {
      name: "Gross Salary",
      code: "GROSS",
      sequence: 4,
      type: "FORMULA" as const,
      category: "GROSS" as const,
      formula: "BASIC + HRA + SPECIAL",
      description: "Total Earnings",
    },
    {
      name: "Provident Fund (Employee PF)",
      code: "PF",
      sequence: 5,
      type: "PERCENTAGE" as const,
      category: "DEDUCTION" as const,
      percentage: 12,
      percentageOf: "BASIC",
      description: "12% of Basic capped or calculated",
    },
    {
      name: "Professional Tax",
      code: "PT",
      sequence: 6,
      type: "FIXED" as const,
      category: "DEDUCTION" as const,
      amount: 200,
      description: "State Statutory Professional Tax",
    },
    {
      name: "Net Payable Salary",
      code: "NET",
      sequence: 7,
      type: "FORMULA" as const,
      category: "NET" as const,
      formula: "GROSS - PF - PT",
      description: "Take-home pay after deductions",
    },
  ];

  for (const r of defaultRules) {
    await prisma.salaryRule.create({
      data: {
        structureId: struct.id,
        ...r,
      },
    });
  }

  revalidatePath("/payroll/structures");
  revalidatePath("/payroll/rules");
  return { success: true };
}

export async function deleteStructure(id: string) {
  const session = await requireRole(HR_ROLES);

  await prisma.salaryStructure.delete({
    where: { id },
  });

  revalidatePath("/payroll/structures");
  return { success: true };
}
