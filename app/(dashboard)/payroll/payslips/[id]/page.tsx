import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole, HR_ROLES } from "@/lib/auth";
import { PayslipClient } from "./payslip-client";

export default async function PayslipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole([...HR_ROLES, "EMPLOYEE"]);

  const payslip = await prisma.payslip.findUnique({
    where: { id },
    include: {
      employee: {
        include: {
          department: true,
          contracts: { where: { status: "ACTIVE" }, include: { schedule: true } },
        },
      },
      payrunLine: {
        include: {
          payrun: true,
          contract: { include: { structure: true } },
        },
      },
    },
  });

  if (!payslip) {
    notFound();
  }

  // If role is EMPLOYEE, ensure this payslip belongs to them
  if (session.user.role === "EMPLOYEE" && payslip.employee.userId !== session.user.id) {
    notFound();
  }

  return (
    <PayslipClient
      payslip={JSON.parse(JSON.stringify(payslip))}
      userRole={session.user.role}
    />
  );
}
