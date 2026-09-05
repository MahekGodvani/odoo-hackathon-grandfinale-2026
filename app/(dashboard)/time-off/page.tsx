import { getTimeOffData } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { TimeOffClient } from "./time-off-client";

export default async function TimeOffPage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const data = await getTimeOffData();

  return (
    <TimeOffClient
      initialData={JSON.parse(JSON.stringify(data))}
      userRole={session.user.role}
    />
  );
}
