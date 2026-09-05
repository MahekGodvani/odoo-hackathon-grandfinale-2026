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

// Default initial user for instant hackathon presentation demo
const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Rahul Patel',
  email: 'rahul.patel@peoplepay360.com',
  role: ROLES.HR_PAYROLL_MANAGER,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('peoplepay360_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('peoplepay360_user', JSON.stringify(user));
      localStorage.setItem('peoplepay360_token', user.token || 'mock-jwt-token-hackathon');
    } else {
      localStorage.removeItem('peoplepay360_user');
      localStorage.removeItem('peoplepay360_token');
    }
  }, [user]);

  const login = async (email, password) => {
    // Authenticate credentials through userApi
    const response = await userApi.login(email, password);
    const { user: authenticatedUser, token } = response.data;
    const userWithToken = { ...authenticatedUser, token };
    setUser(userWithToken);
    return userWithToken;
  };

  const logout = () => {
    setUser(null);
  };

  // Quick Role Switcher helper for hackathon live demo
  const switchRole = (newRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
    }
  };

  // Check if current user role matches permitted roles
  const hasPermission = (allowedRoles) => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (user.role === ROLES.ADMIN) return true; // Admin has full access
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        login,
        logout,
        switchRole,
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
