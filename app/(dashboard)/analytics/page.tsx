import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await requireRole(HR_ROLES);

  const [employees, departments, payruns, attendances, contracts] = await Promise.all([
    prisma.employee.findMany({
      where: { tenantId: session.user.tenantId },
      include: { department: true },
    }),
    prisma.department.findMany({
      where: { tenantId: session.user.tenantId },
    }),
    prisma.payrun.findMany({
      where: { tenantId: session.user.tenantId, status: "PAID" },
      include: { lines: { include: { payslip: true } } },
      orderBy: { period: "asc" },
      take: 6,
    }),
    prisma.attendance.findMany({
      where: { employee: { tenantId: session.user.tenantId } },
      take: 200,
    }),
    prisma.contract.findMany({
      where: { employee: { tenantId: session.user.tenantId }, status: "ACTIVE" },
      include: { employee: { include: { department: true } } },
    }),
  ]);

  // Aggregate salary by department
  const deptSalaryMap: Record<string, { name: string; totalWage: number; count: number }> = {};
  for (const c of contracts) {
    const deptName = c.employee.department?.name || "General";
    if (!deptSalaryMap[deptName]) {
      deptSalaryMap[deptName] = { name: deptName, totalWage: 0, count: 0 };
    }
    deptSalaryMap[deptName].totalWage += c.wage;
    deptSalaryMap[deptName].count += 1;
  }

  const deptData = Object.values(deptSalaryMap);

  // Payrun cost trends
  const trendData = payruns.map((p) => {
    const totalNet = p.lines.reduce((acc, l) => acc + (l.payslip?.netSalary || 0), 0);
    const totalGross = p.lines.reduce((acc, l) => acc + (l.payslip?.grossSalary || 0), 0);
    return {
      period: p.period,
      net: Math.round(totalNet),
      gross: Math.round(totalGross),
    };
  });

  return (
    <AnalyticsClient
      employeeCount={employees.length}
      deptData={deptData}
      trendData={trendData}
      attendanceCount={attendances.length}
      userRole={session.user.role}
    />
  );
}
