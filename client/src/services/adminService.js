import api, { setStoredToken, getStoredToken, clearStoredToken } from './api';

const ADMIN_TOKEN_KEY = 'skillora_admin_token';
const ADMIN_USER_KEY = 'skillora_admin_user';

export const adminService = {
  /**
   * Admin Login with email and password
   */
  async login(email, password) {
    const response = await api.post('/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.data.user));
      // Also set standard token so axios interceptor uses it
      setStoredToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Fetch live platform statistics and financial profit analytics
   */
  async getMetrics() {
    const response = await api.get('/admin/metrics');
    return response.data;
  },

  /**
   * Get cached admin profile if signed in
   */
  getCurrentAdmin() {
    try {
      const stored = localStorage.getItem(ADMIN_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Admin Logout
   */
  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    clearStoredToken();
  }
};

export default adminService;
