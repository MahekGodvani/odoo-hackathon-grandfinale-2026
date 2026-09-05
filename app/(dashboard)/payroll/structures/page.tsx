import { getStructures } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { StructuresClient } from "./structures-client";

export default async function SalaryStructuresPage() {
  const session = await requireRole(HR_ROLES);
  const structures = await getStructures();

  return (
    <StructuresClient
      structures={JSON.parse(JSON.stringify(structures))}
      userRole={session.user.role}
    />
  );
}
