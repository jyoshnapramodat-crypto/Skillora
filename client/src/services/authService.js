import api, { setStoredToken, clearStoredToken } from './api';

export const authService = {
  /**
   * Register a new user account
   */
  async register(registrationData) {
    const response = await api.post('/auth/register', registrationData);
    if (response.data.token) {
      setStoredToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Authenticate user with email and password
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setStoredToken(response.data.token);
    }
    return response.data;
  },

  /**
   * 1-Click Demo Login (Ananya Sharma)
   */
  async demoLogin() {
    const response = await api.post('/auth/demo');
    if (response.data.token) {
      setStoredToken(response.data.token);
    }
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  /**
   * Update current user profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data.user;
  },

  /**
   * Logout user and clear local token
   */
  logout() {
    clearStoredToken();
  }
};

export default authService;

