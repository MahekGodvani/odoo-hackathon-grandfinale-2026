import axios from 'axios';

/**
 * PEOPLEPAY360 - CENTRALIZED AXIOS INSTANCE
 * Configured with base URL, timeout, and JWT authorization headers.
 * Connects directly to Node.js / Express backend at http://localhost:5000/api
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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

// Response Interceptor for clean data extraction & error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error Response:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
