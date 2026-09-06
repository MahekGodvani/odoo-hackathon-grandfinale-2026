import axios from 'axios';

/**
 * PEOPLEPAY360 - CENTRALIZED AXIOS INSTANCE
 * Configured with base URL, timeout, JWT authorization headers, and automatic retry logic.
 * Connects directly to Node.js / Express backend at http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to automatically attach Auth Bearer Token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('peoplepay360_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with automatic token refresh on 401 and retry for server errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Token Expiration: automatically refresh token and retry
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('peoplepay360_refresh_token');

      if (refreshToken) {
        try {
          const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const newAccessToken =
            refreshRes.data?.tokens?.accessToken ||
            refreshRes.data?.accessToken ||
            refreshRes.data?.token;

          const newRefreshToken =
            refreshRes.data?.tokens?.refreshToken ||
            refreshRes.data?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('peoplepay360_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('peoplepay360_refresh_token', newRefreshToken);
            }

            // Sync user state in localStorage
            try {
              const savedUser = localStorage.getItem('peoplepay360_user');
              if (savedUser) {
                const u = JSON.parse(savedUser);
                u.token = newAccessToken;
                localStorage.setItem('peoplepay360_user', JSON.stringify(u));
              }
            } catch {}

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          console.warn('Token auto-refresh failed. Redirecting to login:', refreshErr?.message);
          localStorage.removeItem('peoplepay360_token');
          localStorage.removeItem('peoplepay360_refresh_token');
          localStorage.removeItem('peoplepay360_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    }

    // Retry up to 2 times for 5xx errors (not for auth failures)
    if (error.response?.status >= 500 && originalRequest && (!originalRequest._retryCount || originalRequest._retryCount < 2)) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const delay = originalRequest._retryCount * 1000; // 1s, 2s
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiClient(originalRequest);
    }

    // Normalize error for consumers
    const message = error.response?.data?.message || error.message || 'Network error';
    console.warn(`API Error [${error.response?.status || 'NETWORK'}]:`, message);
    return Promise.reject(error);
  }
);

export default apiClient;
