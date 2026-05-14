import axios from 'axios';

const http = axios.create({ baseURL: '/api/v1' });

export const requestsApi = {
  async getAll() {
    const [{ data: requests }, { data: employees }] = await Promise.all([
      http.get('/requests'),
      http.get('/employees'),
    ]);
    return { requests, employees };
  },

  async getById(id) {
    const { data } = await http.get(`/requests/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await http.post('/requests', payload);
    return data;
  },

  // PATCH con múltiples campos (status + comentarios)
  async updateRequest(id, patch) {
    const { data } = await http.patch(`/requests/${id}`, patch);
    return data;
  },

  async delete(id) {
    await http.delete(`/requests/${id}`);
    return { success: true };
  },
};