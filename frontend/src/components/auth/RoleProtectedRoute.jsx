import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * PEOPLEPAY360 - ROLE PROTECTED ROUTE
 * Restricts route access based on specific user roles.
 */
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { hasPermission, role } = useAuth();

  if (!hasPermission(allowedRoles)) {
    return (
      <div className="p-8 max-w-md mx-auto my-16 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ShieldAlert className="w-7 h-7 text-rose-600" />
        </div>
        <h2 className="text-lg font-extrabold text-slate-900 mb-1.5">Access Restricted</h2>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          Your active account role (<span className="font-bold text-slate-700">{role || 'Standard User'}</span>) does not have permission to view this module.
        </p>
        <p className="text-[11px] text-slate-400 mb-6">
          Contact your PeoplePay360 System Administrator to request elevated privileges.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
