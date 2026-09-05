import axios from 'axios';

/**
 * PEOPLEPAY360 - CENTRALIZED AXIOS INSTANCE
 * 
 * For HTML/JS Developers:
 * Axios is an HTTP client library (like a supercharged `fetch()`).
 * This file creates a configured instance with base URL, timeout, and authorization headers.
 * When the backend is ready, set `VITE_USE_MOCK=false` in `.env` to hit real REST endpoints!
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK !== 'false'; // default to true for hackathon

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

// Response Interceptor for clean data extraction & global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Response:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
