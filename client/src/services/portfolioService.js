import api from './api';

export const portfolioService = {
  /**
   * Get user portfolio configuration settings
   */
  async getSettings() {
    const response = await api.get('/portfolio/settings');
    return response.data.settings;
  },

  /**
   * Update user portfolio visibility settings
   */
  async updateSettings(settings) {
    const response = await api.put('/portfolio/settings', settings);
    return response.data.settings;
  },

  /**
   * Fetch public portfolio by publicId (NO AUTH REQUIRED)
   */
  async getPublicPortfolio(publicId) {
    const response = await api.get(`/portfolio/public/${publicId}`);
    return response.data.portfolio;
  }
};

export default portfolioService;

