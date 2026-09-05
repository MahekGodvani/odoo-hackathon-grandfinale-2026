"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getContracts() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  if (session.user.role === "EMPLOYEE") {
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });
    if (!employee) return [];
    return prisma.contract.findMany({
      where: { employeeId: employee.id },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        schedule: { select: { id: true, name: true, weeklyHours: true } },
        structure: { select: { id: true, name: true } },
      },
      orderBy: { startDate: "desc" },
    });
  }

  return prisma.contract.findMany({
    where: {
      employee: { tenantId: session.user.tenantId },
    },
    include: {
      employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, position: true } },
      schedule: { select: { id: true, name: true, weeklyHours: true } },
      structure: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getContractFormData() {
  const session = await requireRole(HR_ROLES);
  const [employees, schedules, structures] = await Promise.all([
    prisma.employee.findMany({
      where: { tenantId: session.user.tenantId },
      select: { id: true, firstName: true, lastName: true, employeeId: true },
      orderBy: { firstName: "asc" },
    }),
    prisma.workSchedule.findMany({
      where: { tenantId: session.user.tenantId },
      select: { id: true, name: true, weeklyHours: true },
    }),
    prisma.salaryStructure.findMany({
      where: { tenantId: session.user.tenantId },
      select: { id: true, name: true },
    }),
  ]);

  return { employees, schedules, structures };
}

export async function createContract(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const name = formData.get("name") as string;
  const employeeId = formData.get("employeeId") as string;
  const scheduleId = formData.get("scheduleId") as string;
  const structureId = formData.get("structureId") as string;
  const wage = parseFloat(formData.get("wage") as string);
  const startDate = new Date(formData.get("startDate") as string);
  const endDateStr = formData.get("endDate") as string;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  const status = (formData.get("status") as any) || "DRAFT";
  const notes = formData.get("notes") as string || null;

  // If new contract is ACTIVE, optionally transition previous active contracts to EXPIRED
  if (status === "ACTIVE") {
    await prisma.contract.updateMany({
      where: { employeeId, status: "ACTIVE" },
      data: { status: "EXPIRED" },
    });
  }

  await prisma.contract.create({
    data: {
      name,
      employeeId,
      scheduleId,
      structureId,
      wage,
      startDate,
      endDate,
      status,
      notes,
    },
  });

  revalidatePath("/contracts");
  revalidatePath("/employees");
  return { success: true };
}

export async function updateContractStatus(id: string, status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED") {
  const session = await requireRole(HR_ROLES);

  await prisma.contract.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/contracts");
  revalidatePath("/employees");
  return { success: true };
}

export async function deleteContract(id: string) {
  const session = await requireRole(HR_ROLES);

  await prisma.contract.delete({
    where: { id },
  });

  revalidatePath("/contracts");
  return { success: true };
}
