import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - USER & AUTHENTICATION API SERVICE
 */

export const userApi = {
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const user = db.users.find(
        (u) => u.email.toLowerCase() === String(email).trim().toLowerCase()
      );

      if (!user) {
        throw new Error('Invalid credentials: No account found with this email.');
      }

      if (user.status !== 'Active') {
        throw new Error('Account deactivated: Please contact your system administrator.');
      }

      // Password verification (for mock mode, standard password is 'password123' or any non-empty input)
      if (!password || password.trim().length < 4) {
        throw new Error('Invalid credentials: Password must be at least 4 characters.');
      }

      return {
        data: {
          user,
          token: `jwt-token-${user.id}-${Date.now()}`,
        }
      };
    }

    return apiClient.post('/auth/login', { email, password });
  },

  getUsers: async () => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      return { data: db.users };
    }
    return apiClient.get('/users');
  },

  createUser: async (userData) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const newUser = {
        id: `usr-${db.users.length + 1}`,
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        ...userData,
      };
      db.users.push(newUser);
      mockDataStore.save(db);
      return { data: newUser };
    }
    return apiClient.post('/users', userData);
  },

  updateUserRole: async (id, role) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const user = db.users.find((u) => u.id === id);
      if (user) {
        user.role = role;
        mockDataStore.save(db);
        return { data: user };
      }
      throw new Error('User not found');
    }
    return apiClient.put(`/users/${id}/role`, { role });
  },

  toggleUserStatus: async (id) => {
    if (USE_MOCK_DATA) {
      const db = mockDataStore.get();
      const user = db.users.find((u) => u.id === id);
      if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        mockDataStore.save(db);
        return { data: user };
      }
      throw new Error('User not found');
    }
    return apiClient.put(`/users/${id}/toggle-status`);
  }
};
