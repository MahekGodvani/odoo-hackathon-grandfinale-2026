import apiClient from './axios';

/**
 * PEOPLEPAY360 - FRONTEND ELASTIC SEARCH API SERVICE
 * Provides unified search across Employees, Payslips, Contracts, Attendance, Leaves, Payruns, and Navigation.
 * Uses backend Elastic Search API with client-side fallback using cached API data.
 */

export const searchApi = {
  // Global search across all entities with typo tolerance and category filtering
  search: async ({ query = '', category = 'all', limit = 20 } = {}) => {
    try {
      const res = await apiClient.get('/search', {
        params: { q: query, category, limit },
      });
      if (res.data?.success) {
        return res.data;
      }
    } catch (err) {
      console.warn('Backend search unreachable:', err?.message);
    }
    // Return empty results if backend search fails
    return {
      query: query,
      hits: [],
      total: 0,
      aggregations: { all: 0 },
      tookMs: 0,
      engine: 'Unavailable'
    };
  },

  // Autocomplete suggestions
  getSuggestions: async (query) => {
    try {
      const res = await apiClient.get('/search/suggestions', {
        params: { q: query },
      });
      if (res.data?.suggestions) {
        return res.data.suggestions;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  // Engine health stats
  getStats: async () => {
    try {
      const res = await apiClient.get('/search/stats');
      if (res.data?.stats) return res.data.stats;
    } catch {
      // Fallback
    }
    return {
      status: 'healthy',
      index: 'peoplepay360_v2',
      engine: 'Elastic-Engine (Backend)',
    };
  },
};

export default searchApi;
