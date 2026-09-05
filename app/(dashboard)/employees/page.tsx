import { getEmployees, getDepartments } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { EmployeesClient } from "./employees-client";

export default async function EmployeesPage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const [employees, departments] = await Promise.all([getEmployees(), getDepartments()]);

  return (
    <EmployeesClient
      employees={JSON.parse(JSON.stringify(employees))}
      departments={JSON.parse(JSON.stringify(departments))}
      userRole={session.user.role}
    />
  );
}
