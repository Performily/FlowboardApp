import axios from 'axios';

const http = axios.create({ baseURL: '/api/v1' });

export const vacationsApi = {
  async getEmployees() {
    const { data } = await http.get('/employees');
    return data; 
  },

  async getVacationRequests() {
    const { data } = await http.get('/requests');
    return data.filter(req => req.type === 'Vacaciones');
  },
  async createVacation(payload) {
    const { data } = await http.post('/requests', payload);
    return data;
  }
};