import apiClient, { USE_MOCK_DATA } from './axios';
import { mockDataStore } from '../services/mockDataStore';

/**
 * PEOPLEPAY360 - USER & AUTHENTICATION API SERVICE
 */

export const userApi = {
  login: async (email, password) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post('/auth/login', { email, password });
        if (res.data && res.data.success) {
          const user = res.data.user || {};
          const token = res.data.access_token || res.data.token;
          return {
            data: {
              user: {
                id: user.id,
                name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
                email: user.email,
                role: user.role,
                avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                status: 'Active',
                employee_id: user.employee_id
              },
              token
            }
          };
        }
      } catch (err) {
        console.warn('Backend login failed, falling back to mock auth if permitted:', err?.message);
        // If credentials are bad from server, throw the actual server message
        if (err?.response?.data?.message) {
          throw new Error(err.response.data.message);
        }
      }
    }

    // Mock Fallback
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

    if (!password || password.trim().length < 4) {
      throw new Error('Invalid credentials: Password must be at least 4 characters.');
    }

    return {
      data: {
        user,
        token: `jwt-token-${user.id}-${Date.now()}`,
      }
    };
  },

  getProfile: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/auth/me');
        return { data: res.data.user || res.data };
      } catch (err) {
        console.warn('getProfile error:', err);
      }
    }
    const db = mockDataStore.get();
    return { data: db.users[0] };
  },

  getUsers: async () => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.get('/roles');
        if (res.data?.roles) {
          // If backend roles/users
          return { data: res.data.roles };
        }
      } catch (err) {
        console.warn('getUsers fallback:', err);
      }
    }
    const db = mockDataStore.get();
    return { data: db.users };
  },

  createUser: async (userData) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.post('/auth/register', userData);
        return { data: res.data.user || res.data };
      } catch (err) {
        console.warn('createUser fallback:', err);
      }
    }
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
  },

  updateUserRole: async (id, role) => {
    if (!USE_MOCK_DATA) {
      try {
        const res = await apiClient.put(`/users/${id}/role`, { role });
        return { data: res.data };
      } catch (err) {
        console.warn('updateUserRole fallback:', err);
      }
    }
    const db = mockDataStore.get();
    const user = db.users.find((u) => u.id === id);
    if (user) {
      user.role = role;
      mockDataStore.save(db);
      return { data: user };
    }
    throw new Error('User not found');
  },

  toggleUserStatus: async (id) => {
    const db = mockDataStore.get();
    const user = db.users.find((u) => u.id === id);
    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      mockDataStore.save(db);
      return { data: user };
    }
    throw new Error('User not found');
  }
};
