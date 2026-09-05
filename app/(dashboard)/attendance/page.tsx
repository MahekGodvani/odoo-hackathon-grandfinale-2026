import { getAttendanceData } from "./actions";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { AttendanceClient } from "./attendance-client";

export default async function AttendancePage() {
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);
  const data = await getAttendanceData();

  return (
    <AttendanceClient
      initialData={JSON.parse(JSON.stringify(data))}
      userRole={session.user.role}
    />
  );
}
