import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * PEOPLEPAY360 - ROLE PROTECTED ROUTE
 * Restricts route access based on specific user roles.
 */
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(allowedRoles)) {
    return (
      <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-600 mb-4">
          Your current role does not have permission to view this section.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
