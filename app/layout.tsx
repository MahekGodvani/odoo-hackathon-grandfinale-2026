import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "PeoplePay360 — Integrated HR & Payroll Platform",
  description:
    "A self-governing HR and Payroll platform where Employee, Contract, Attendance, Time Off, and Payroll flow as one intelligent operational system.",
  keywords: ["HR", "Payroll", "Employee Management", "Attendance", "Time Off", "Salary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(23, 23, 23, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fafafa",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
