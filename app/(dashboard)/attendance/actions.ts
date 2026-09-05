"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAttendanceData() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  const isEmployee = session.user.role === "EMPLOYEE";
  let myEmployeeId: string | null = null;
  let todayRecord: any = null;

  const currentEmployee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
  });

  if (currentEmployee) {
    myEmployeeId = currentEmployee.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    todayRecord = await prisma.attendance.findFirst({
      where: {
        employeeId: currentEmployee.id,
        date: { gte: startOfToday, lte: endOfToday },
      },
    });
  }

  // Attendance history query
  let attendances: any[] = [];
  if (isEmployee && currentEmployee) {
    attendances = await prisma.attendance.findMany({
      where: { employeeId: currentEmployee.id },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { date: "desc" },
      take: 60,
    });
  } else {
    attendances = await prisma.attendance.findMany({
      where: {
        employee: { tenantId: session.user.tenantId },
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { date: "desc" },
      take: 100,
    });
  }

  const allEmployees = await prisma.employee.findMany({
    where: { tenantId: session.user.tenantId, status: "ACTIVE" },
    select: { id: true, firstName: true, lastName: true, employeeId: true },
  });

  return {
    attendances,
    myEmployeeId,
    todayRecord,
    allEmployees,
  };
}

export async function punchClock() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  const employee = await prisma.employee.findFirst({
    where: { userId: session.user.id },
  });
  if (!employee) throw new Error("Employee profile not found");

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: startOfToday, lte: endOfToday },
    },
  });

  if (!existing) {
    // Punch IN
    await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: now,
        checkIn: now,
        status: "PRESENT",
      },
    });
  } else if (!existing.checkOut) {
    // Punch OUT
    const checkInTime = new Date(existing.checkIn!).getTime();
    const checkOutTime = now.getTime();
    const workedHours = Math.max(0, (checkOutTime - checkInTime) / (1000 * 60 * 60));
    const status = workedHours < 4 ? "HALF_DAY" : "PRESENT";

    await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        workedHours: parseFloat(workedHours.toFixed(2)),
        status,
      },
    });
  } else {
    throw new Error("Already clocked out for today");
  }

  revalidatePath("/attendance");
  return { success: true };
}

export async function logManualAttendance(formData: FormData) {
  const session = await requireRole(HR_ROLES);

  const employeeId = formData.get("employeeId") as string;
  const dateStr = formData.get("date") as string;
  const checkInStr = formData.get("checkIn") as string;
  const checkOutStr = formData.get("checkOut") as string;
  const status = (formData.get("status") as any) || "PRESENT";
  const notes = formData.get("notes") as string || null;

  const date = new Date(dateStr);
  let checkIn: Date | null = null;
  let checkOut: Date | null = null;
  let workedHours: number | null = null;

  if (checkInStr) {
    checkIn = new Date(`${dateStr}T${checkInStr}:00`);
  }
  if (checkOutStr) {
    checkOut = new Date(`${dateStr}T${checkOutStr}:00`);
  }

  if (checkIn && checkOut) {
    workedHours = Math.max(0, (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: { gte: startOfDay, lte: endOfDay },
    },
  });

  if (existing) {
    await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkIn,
        checkOut,
        workedHours: workedHours ? parseFloat(workedHours.toFixed(2)) : undefined,
        status,
        notes,
      },
    });
  } else {
    await prisma.attendance.create({
      data: {
        employeeId,
        date,
        checkIn,
        checkOut,
        workedHours: workedHours ? parseFloat(workedHours.toFixed(2)) : undefined,
        status,
        notes,
      },
    });
  }

  revalidatePath("/attendance");
  return { success: true };
}
