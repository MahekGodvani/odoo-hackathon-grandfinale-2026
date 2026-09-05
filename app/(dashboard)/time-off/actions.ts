"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTimeOffData() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  const isEmployee = session.user.role === "EMPLOYEE";
  const currentEmployee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
  });

  const types = await prisma.timeOffType.findMany({
    where: { tenantId: session.user.tenantId },
  });

  let allocations: any[] = [];
  let requests: any[] = [];

  if (isEmployee && currentEmployee) {
    allocations = await prisma.timeOffAllocation.findMany({
      where: { employeeId: currentEmployee.id },
      include: { type: true },
    });

    requests = await prisma.timeOffRequest.findMany({
      where: { employeeId: currentEmployee.id },
      include: {
        type: true,
        approver: { select: { name: true } },
        employee: { select: { firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    requests = await prisma.timeOffRequest.findMany({
      where: { employee: { tenantId: session.user.tenantId } },
      include: {
        type: true,
        approver: { select: { name: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (currentEmployee) {
      allocations = await prisma.timeOffAllocation.findMany({
        where: { employeeId: currentEmployee.id },
        include: { type: true },
      });
    }
  }

  const allEmployees = await prisma.employee.findMany({
    where: { tenantId: session.user.tenantId, status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true, employeeId: true },
  });

  return {
    types,
    allocations,
    requests,
    currentEmployee,
    allEmployees,
  };
}

export async function requestTimeOff(formData: FormData) {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  let employeeId = formData.get("employeeId") as string;
  if (session.user.role === "EMPLOYEE" || !employeeId) {
    const currentEmp = await prisma.employee.findFirst({
      where: { userId: session.user.id },
    });
    if (!currentEmp) throw new Error("Employee profile not found");
    employeeId = currentEmp.id;
  }

  const typeId = formData.get("typeId") as string;
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  const reason = formData.get("reason") as string || null;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  await prisma.timeOffRequest.create({
    data: {
      employeeId,
      typeId,
      startDate,
      endDate,
      days,
      reason,
      status: "PENDING",
    },
  });

  revalidatePath("/time-off");
  return { success: true };
}

export async function updateRequestStatus(id: string, status: "APPROVED" | "REFUSED" | "CANCELLED") {
  const session = await requireRole(HR_ROLES);

  const req = await prisma.timeOffRequest.findUnique({
    where: { id },
  });
  if (!req) throw new Error("Request not found");

  await prisma.timeOffRequest.update({
    where: { id },
    data: {
      status,
      approverId: session.user.id,
      approvedAt: status === "APPROVED" ? new Date() : null,
    },
  });

  // If approved, update allocation
  if (status === "APPROVED") {
    const year = new Date(req.startDate).getFullYear();
    const alloc = await prisma.timeOffAllocation.findFirst({
      where: { employeeId: req.employeeId, typeId: req.typeId, year },
    });
    if (alloc) {
      await prisma.timeOffAllocation.update({
        where: { id: alloc.id },
        data: { usedDays: alloc.usedDays + req.days },
      });
    }
  }

  revalidatePath("/time-off");
  return { success: true };
}
