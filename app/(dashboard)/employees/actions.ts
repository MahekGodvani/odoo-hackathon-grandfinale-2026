"use server";

import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { employeeSchema } from "@/lib/validations/schemas";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getEmployees() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  if (session.user.role === "EMPLOYEE") {
    const employee = await prisma.employee.findFirst({
      where: { userId: session.user.id },
      include: { department: true, contracts: { where: { status: "ACTIVE" } } },
    });
    return employee ? [employee] : [];
  }

  return prisma.employee.findMany({
    where: { tenantId: session.user.tenantId },
    include: {
      department: true,
      contracts: { where: { status: "ACTIVE" }, take: 1 },
      user: { select: { role: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployee(id: string) {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  return prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      contracts: { include: { schedule: true, structure: true }, orderBy: { startDate: "desc" } },
      timeOffAllocations: { include: { type: true } },
      timeOffRequests: { include: { type: true, approver: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 10 },
      attendances: { orderBy: { date: "desc" }, take: 30 },
      user: { select: { email: true, role: true } },
    },
  });
}

export async function createEmployee(formData: FormData) {
  const session = await requireRole(HR_ROLES);
  const raw = Object.fromEntries(formData.entries());
  const data = employeeSchema.parse(raw);

  // Generate next employee ID
  const lastEmp = await prisma.employee.findFirst({
    where: { tenantId: session.user.tenantId },
    orderBy: { employeeId: "desc" },
  });
  const nextNum = lastEmp ? parseInt(lastEmp.employeeId.split("-")[1]) + 1 : 1;
  const employeeId = `EMP-${String(nextNum).padStart(4, "0")}`;

  // Create user account for the employee
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      password: passwordHash,
      role: "EMPLOYEE",
      tenantId: session.user.tenantId,
    },
  });

  await prisma.employee.create({
    data: {
      employeeId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      dateOfJoining: new Date(data.dateOfJoining),
      position: data.position,
      status: data.status,
      departmentId: data.departmentId,
      userId: user.id,
      tenantId: session.user.tenantId,
    },
  });

  revalidatePath("/employees");
  return { success: true };
}

export async function updateEmployee(id: string, formData: FormData) {
  const session = await requireRole(HR_ROLES);
  const raw = Object.fromEntries(formData.entries());
  const data = employeeSchema.parse(raw);

  await prisma.employee.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      dateOfJoining: new Date(data.dateOfJoining),
      position: data.position,
      status: data.status,
      departmentId: data.departmentId,
    },
  });

  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
  return { success: true };
}

export async function deleteEmployee(id: string) {
  const session = await requireRole(HR_ROLES);
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/employees");
  return { success: true };
}

export async function getDepartments() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  return prisma.department.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: "asc" },
  });
}
