import { getSalaryRulesData } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { RulesClient } from "./rules-client";

export default async function SalaryRulesPage() {
  const session = await requireRole(HR_ROLES);
  const data = await getSalaryRulesData();

  return (
    <RulesClient
      initialData={JSON.parse(JSON.stringify(data))}
      userRole={session.user.role}
    />
  );
}
