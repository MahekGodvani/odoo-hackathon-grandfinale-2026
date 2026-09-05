import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

async function getDashboardData(tenantId: string) {
  const [
    totalEmployees,
    activeEmployees,
    pendingLeaveRequests,
    totalPayruns,
    departments,
    recentPayslips,
    attendanceToday,
    leaveDistribution,
  ] = await Promise.all([
    prisma.employee.count({ where: { tenantId } }),
    prisma.employee.count({ where: { tenantId, status: "ACTIVE" } }),
    prisma.timeOffRequest.count({ where: { employee: { tenantId }, status: "PENDING" } }),
    prisma.payrun.count({ where: { tenantId } }),
    prisma.department.findMany({
      where: { tenantId },
      include: {
        employees: {
          include: {
            contracts: { where: { status: "ACTIVE" }, take: 1 },
          },
        },
      },
    }),
    prisma.payslip.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { employee: true },
    }),
    prisma.attendance.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: "PRESENT",
      },
    }),
    prisma.timeOffRequest.groupBy({
      by: ["status"],
      _count: { id: true },
      where: { employee: { tenantId } },
    }),
  ]);

  // Salary by department
  const salaryByDept = departments.map((dept) => {
    const totalSalary = dept.employees.reduce((sum, emp) => {
      const contract = emp.contracts[0];
      return sum + (contract?.wage || 0);
    }, 0);
    return {
      department: dept.name,
      totalSalary,
      employeeCount: dept.employees.length,
    };
  });

  // Monthly payroll trend (mock based on departments)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const totalMonthlySalary = salaryByDept.reduce((s, d) => s + d.totalSalary, 0);
  const payrollTrend = months.map((month, i) => ({
    month,
    amount: Math.round(totalMonthlySalary * (0.95 + Math.random() * 0.1)),
  }));

  return {
    kpis: {
      totalEmployees,
      activeEmployees,
      pendingLeaveRequests,
      totalPayruns,
      attendanceToday,
      totalMonthlySalary,
    },
    salaryByDept,
    payrollTrend,
    leaveDistribution: leaveDistribution.map((l) => ({
      status: l.status,
      count: l._count.id,
    })),
    recentPayslips: recentPayslips.map((p) => ({
      id: p.id,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      period: p.period,
      netSalary: p.netSalary,
      status: p.status,
    })),
  };
}

export default async function DashboardPage() {
  const session = await requireAuth();
  const data = await getDashboardData(session.user.tenantId);
  return <DashboardClient data={data} role={session.user.role} />;
}
