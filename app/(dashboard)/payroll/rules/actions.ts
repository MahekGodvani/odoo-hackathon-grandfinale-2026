"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSalaryRulesData() {
  const session = await requireRole(HR_ROLES);

  const structures = await prisma.salaryStructure.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      rules: {
        orderBy: { sequence: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return { structures };
}

export async function createOrUpdateSalaryRule(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const id = formData.get("id") as string;
  const structureId = formData.get("structureId") as string;
  const name = formData.get("name") as string;
  const code = (formData.get("code") as string).toUpperCase();
  const sequence = parseInt(formData.get("sequence") as string) || 1;
  const type = formData.get("type") as any;
  const category = formData.get("category") as any;
  const amountStr = formData.get("amount") as string;
  const percentageStr = formData.get("percentage") as string;
  const percentageOf = (formData.get("percentageOf") as string) || null;
  const formula = (formData.get("formula") as string) || null;
  const description = (formData.get("description") as string) || null;

  const amount = amountStr ? parseFloat(amountStr) : null;
  const percentage = percentageStr ? parseFloat(percentageStr) : null;

  if (id) {
    await prisma.salaryRule.update({
      where: { id },
      data: {
        name,
        code,
        sequence,
        type,
        category,
        amount,
        percentage,
        percentageOf,
        formula,
        description,
      },
    });
  } else {
    await prisma.salaryRule.create({
      data: {
        structureId,
        name,
        code,
        sequence,
        type,
        category,
        amount,
        percentage,
        percentageOf,
        formula,
        description,
      },
    });
  }

  revalidatePath("/payroll/rules");
  revalidatePath("/payroll/structures");
  return { success: true };
}

export async function deleteSalaryRule(id: string) {
  const session = await requireRole(HR_ROLES);

  await prisma.salaryRule.delete({
    where: { id },
  });

  revalidatePath("/payroll/rules");
  revalidatePath("/payroll/structures");
  return { success: true };
}
