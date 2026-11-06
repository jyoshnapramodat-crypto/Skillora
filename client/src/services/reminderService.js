import api from './api';

export const reminderService = {
  /**
   * Get reminder settings and deadline alerts
   */
  async getReminders() {
    const response = await api.get('/reminders');
    return response.data;
  },

  /**
   * Update reminder preferences
   */
  async updateReminders(settings) {
    const response = await api.put('/reminders', settings);
    return response.data.settings;
  }
};

export default reminderService;

