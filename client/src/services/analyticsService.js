import api from './api';

export const analyticsService = {
  /**
   * Fetch aggregated dashboard statistics
   */
  async getDashboardStats() {
    const response = await api.get('/analytics/dashboard');
    return response.data.stats;
  },

  /**
   * Fetch chart comparison & trend data
   */
  async getChartData() {
    const response = await api.get('/analytics/charts');
    return response.data.data;
  }
};

export default analyticsService;

