"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSchedules() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  return prisma.workSchedule.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      _count: { select: { contracts: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function createSchedule(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const name = formData.get("name") as string;
  const weeklyHours = parseFloat(formData.get("weeklyHours") as string) || 40;
  const startTime = (formData.get("startTime") as string) || "09:00";
  const endTime = (formData.get("endTime") as string) || "18:00";
  const daysSelected = formData.getAll("workDays") as string[];

  await prisma.workSchedule.create({
    data: {
      name,
      weeklyHours,
      startTime,
      endTime,
      workDays: daysSelected.length > 0 ? daysSelected : ["MON", "TUE", "WED", "THU", "FRI"],
      tenantId: session.user.tenantId,
    },
  });

  revalidatePath("/schedules");
  return { success: true };
}

export async function deleteSchedule(id: string) {
  const session = await requireRole(HR_ROLES);

  await prisma.workSchedule.delete({
    where: { id },
  });

  revalidatePath("/schedules");
  return { success: true };
}
