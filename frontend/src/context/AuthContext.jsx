import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../api/userApi';

/**
 * PEOPLEPAY360 - AUTHENTICATION CONTEXT
 * 
 * For HTML/JS Developers:
 * Context in React works like a global data provider. Instead of passing the current
 * logged-in user to every single HTML component via arguments, `AuthContext` makes
 * `user`, `role`, and `hasPermission()` accessible to any component in the app!
 */

const AuthContext = createContext(null);

export const ROLES = {
  EMPLOYEE: 'Employee',
  HR_MANAGER: 'HR Manager',
  HR_PAYROLL_USER: 'HR Payroll User',
  HR_PAYROLL_MANAGER: 'HR Payroll Manager',
  ADMIN: 'Admin',
};

// Normalize any role string into canonical internal identifier:
// 'admin' | 'hr_payroll_manager' | 'hr_payroll_user' | 'hr_manager' | 'employee'
export const normalizeRole = (role) => {
  if (!role) return 'employee';
  const r = String(role).toLowerCase().trim().replace(/[\s-]+/g, '_');
  if (r === 'admin') return 'admin';
  if (r === 'hr_payroll_manager' || r === 'payroll_manager') return 'hr_payroll_manager';
  if (r === 'hr_payroll_user' || r === 'payroll_user') return 'hr_payroll_user';
  if (r === 'payroll') return 'hr_payroll_manager';
  if (r === 'hr_manager' || r === 'hr') return 'hr_manager';
  if (r === 'employee' || r === 'user') return 'employee';
  if (r.includes('payroll_user') || r.includes('payroll user')) return 'hr_payroll_user';
  if (r.includes('payroll_manager') || r.includes('payroll manager')) return 'hr_payroll_manager';
  if (r.includes('hr_manager') || r.includes('hr manager')) return 'hr_manager';
  return 'employee';
};

// Normalize to display format for UI labels and badges
export const normalizeRoleToDisplay = (role) => {
  if (!role) return ROLES.EMPLOYEE;
  const canonical = normalizeRole(role);
  switch (canonical) {
    case 'admin':
      return ROLES.ADMIN;
    case 'hr_payroll_manager':
      return ROLES.HR_PAYROLL_MANAGER;
    case 'hr_payroll_user':
      return ROLES.HR_PAYROLL_USER;
    case 'hr_manager':
      return ROLES.HR_MANAGER;
    case 'employee':
    default:
      return ROLES.EMPLOYEE;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('peoplepay360_user');
      const token = localStorage.getItem('peoplepay360_token');
      // Discard legacy/hardcoded mock tokens
      if (token === 'mock-jwt-token-hackathon') {
        localStorage.removeItem('peoplepay360_user');
        localStorage.removeItem('peoplepay360_token');
        return null;
      }
      if (saved && token) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          role: normalizeRoleToDisplay(parsed.role),
          token
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user && user.token && user.token !== 'mock-jwt-token-hackathon') {
      localStorage.setItem('peoplepay360_user', JSON.stringify(user));
      localStorage.setItem('peoplepay360_token', user.token);
    } else {
      localStorage.removeItem('peoplepay360_user');
      localStorage.removeItem('peoplepay360_token');
    }
  }, [user]);

  const login = async (email, password) => {
    // Authenticate credentials through userApi
    const response = await userApi.login(email, password);
    const { user: authenticatedUser, token, refreshToken } = response.data;
    const userWithToken = {
      ...authenticatedUser,
      role: normalizeRoleToDisplay(authenticatedUser.role),
      token,
      refreshToken
    };
    if (refreshToken) {
      localStorage.setItem('peoplepay360_refresh_token', refreshToken);
    }
    setUser(userWithToken);
    return userWithToken;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('peoplepay360_user');
    localStorage.removeItem('peoplepay360_token');
    localStorage.removeItem('peoplepay360_refresh_token');
  };

  // Check if current user role matches permitted roles according to Odoo hierarchy
  const hasPermission = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const currentNormalized = normalizeRole(user.role);
    // 1. Admin has full access to all modules and models across the platform
    if (currentNormalized === 'admin') return true;

    const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));

    // 2. Direct match
    if (normalizedAllowed.includes(currentNormalized)) return true;

    // 3. Hierarchy inheritance:
    // HR Payroll Manager inherits all HR Payroll User permissions
    if (currentNormalized === 'hr_payroll_manager' && normalizedAllowed.includes('hr_payroll_user')) {
      return true;
    }

    // HR Payroll User & HR Payroll Manager inherit all HR Manager permissions (HR modules)
    if (
      (currentNormalized === 'hr_payroll_user' || currentNormalized === 'hr_payroll_manager') &&
      normalizedAllowed.includes('hr_manager')
    ) {
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
