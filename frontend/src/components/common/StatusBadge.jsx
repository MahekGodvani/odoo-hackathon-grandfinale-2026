import React from 'react';

/**
 * PEOPLEPAY360 - STATUS BADGE COMPONENT
 * Formats status strings into visually clean, consistent color badges.
 */
const StatusBadge = ({ status }) => {
  if (!status) return null;

  const getStyle = (str) => {
    const s = String(str).toLowerCase();

    // Success / Active / Approved / Paid
    if (['active', 'approved', 'paid', 'present', 'validated', 'computed', 'corrected'].includes(s)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    // Warning / Pending / Late / Overtime
    if (['pending', 'late', 'overtime', 'draft'].includes(s)) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    // Danger / Absent / Refused / Expired / Missing
    if (['absent', 'refused', 'expired', 'cancelled', 'missing checkout'].includes(s)) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    // Default neutral
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
