import api from './api';

export const skillService = {
  /**
   * Fetch all skills with optional filters/sorting
   */
  async getSkills(params = {}) {
    const response = await api.get('/skills', { params });
    return response.data.skills;
  },

  /**
   * Fetch single skill by ID
   */
  async getSkillById(id) {
    const response = await api.get(`/skills/${id}`);
    return response.data.skill;
  },

  /**
   * Create a new skill
   */
  async createSkill(skillData) {
    const response = await api.post('/skills', skillData);
    return response.data.skill;
  },

  /**
   * Update an existing skill
   */
  async updateSkill(id, skillData) {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data.skill;
  },

  /**
   * Delete a skill
   */
  async deleteSkill(id) {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  /**
   * Add a task to a skill
   */
  async addTask(skillId, title) {
    const response = await api.post(`/skills/${skillId}/tasks`, { title });
    return response.data.skill;
  },

  /**
   * Toggle or update a task
   */
  async updateTask(skillId, taskId, updates) {
    const response = await api.patch(`/skills/${skillId}/tasks/${taskId}`, updates);
    return response.data.skill;
  },

  /**
   * Delete a task from a skill
   */
  async deleteTask(skillId, taskId) {
    const response = await api.delete(`/skills/${skillId}/tasks/${taskId}`);
    return response.data.skill;
  }
};

export default skillService;

