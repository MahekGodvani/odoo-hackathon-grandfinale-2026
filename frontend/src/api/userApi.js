import apiClient from './axios';

/**
 * PEOPLEPAY360 - USER & AUTHENTICATION API SERVICE
 * Connects directly to backend /api/auth — no mock fallback.
 */

export const userApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data && res.data.success) {
      const user = res.data.user || {};
      const token = res.data.token || res.data.access_token || res.data.tokens?.accessToken;
      const refreshToken = res.data.tokens?.refreshToken || res.data.refreshToken;

      if (token) {
        localStorage.setItem('peoplepay360_token', token);
      }
      if (refreshToken) {
        localStorage.setItem('peoplepay360_refresh_token', refreshToken);
      }

      return {
        data: {
          user: {
            id: user.id,
            name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email,
            email: user.email,
            role: user.role,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=4f46e5&color=fff&bold=true&rounded=true`,
            status: 'Active',
            employee_id: user.employee_id
          },
          token,
          refreshToken
        }
      };
    }
    throw new Error('Login failed');
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return { data: res.data.user || res.data };
  },

  getUsers: async () => {
    const res = await apiClient.get('/auth/users');
    if (res.data?.success && res.data.users) {
      return { data: res.data.users };
    }
    return { data: [] };
  },

  createUser: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return { data: res.data.user || res.data };
  },

  updateUserRole: async (id, role) => {
    const res = await apiClient.put(`/auth/users/${id}/role`, { role });
    return { data: res.data };
  },

  toggleUserStatus: async (id) => {
    const res = await apiClient.put(`/auth/users/${id}/status`);
    return { data: res.data };
  }
};
