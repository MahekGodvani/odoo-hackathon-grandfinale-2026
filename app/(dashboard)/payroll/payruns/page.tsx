import { getPayruns } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { PayrunsClient } from "./payruns-client";

export default async function PayrunsPage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const payruns = await getPayruns();

  return (
    <PayrunsClient
      payruns={JSON.parse(JSON.stringify(payruns))}
      userRole={session.user.role}
    />
  );
}
