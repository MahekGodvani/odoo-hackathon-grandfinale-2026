import { notFound } from "next/navigation";
import { getEmployee } from "../actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { EmployeeDetailClient } from "./employee-detail-client";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  const employee = await getEmployee(id);
  if (!employee) {
    notFound();
  }

  // If role is EMPLOYEE, only allow viewing their own profile
  if (session.user.role === "EMPLOYEE" && employee.userId !== session.user.id) {
    notFound();
  }

  return (
    <EmployeeDetailClient
      employee={JSON.parse(JSON.stringify(employee))}
      userRole={session.user.role}
    />
  );
}
