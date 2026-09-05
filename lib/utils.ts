import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateEmployeeId(sequence: number): string {
  return `EMP-${String(sequence).padStart(4, "0")}`;
}

export function calculateWorkedHours(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Employee status
    ONBOARDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    ON_LEAVE: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    OFFBOARDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    // Contract status
    DRAFT: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
    EXPIRED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    // Time Off request status
    PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    APPROVED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    REFUSED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    CANCELLED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    // Payrun status
    COMPUTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    VALIDATED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    PAID: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    // Attendance
    PRESENT: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    ABSENT: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    HALF_DAY: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
