import api from './api';

export const goalService = {
  /**
   * Fetch all goals for the user
   */
  async getGoals() {
    const response = await api.get('/goals');
    return response.data.goals;
  },

  /**
   * Create a new goal
   */
  async createGoal(goalData) {
    const response = await api.post('/goals', goalData);
    return response.data.goal;
  },

  /**
   * Update an existing goal
   */
  async updateGoal(id, goalData) {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data.goal;
  },

  /**
   * Toggle completion status of a goal
   */
  async toggleGoal(id) {
    const response = await api.patch(`/goals/${id}/toggle`);
    return response.data.goal;
  },

  /**
   * Delete a goal
   */
  async deleteGoal(id) {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default goalService;

