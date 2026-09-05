import { getSchedules } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { SchedulesClient } from "./schedules-client";

export default async function SchedulesPage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const schedules = await getSchedules();

  return (
    <SchedulesClient
      schedules={JSON.parse(JSON.stringify(schedules))}
      userRole={session.user.role}
    />
  );
}
