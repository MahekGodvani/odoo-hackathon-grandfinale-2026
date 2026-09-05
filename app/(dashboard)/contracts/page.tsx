import { getContracts, getContractFormData } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { ContractsClient } from "./contracts-client";

export default async function ContractsPage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const contracts = await getContracts();
  const isHR = HR_ROLES.includes(session.user.role as any);
  const formData = isHR ? await getContractFormData() : { employees: [], schedules: [], structures: [] };

  return (
    <ContractsClient
      contracts={JSON.parse(JSON.stringify(contracts))}
      formData={JSON.parse(JSON.stringify(formData))}
      userRole={session.user.role}
    />
  );
}
