import api from './api';

export const migrationService = {
  /**
   * Migrate and sync browser localStorage data bundle to MongoDB database
   */
  async importLocalStorageData(payload) {
    const response = await api.post('/migration/import', payload);
    return response.data;
  }
};

export default migrationService;

