import axios from 'axios';

const http = axios.create({ baseURL: 'https://flowboardwebservice.onrender.com' });

export const requestsApi = {
  async getAll() {
  const { data: employees } = await http.get('/api/v1/employees');

  const requests = [];

  for (const emp of employees) {
    try {
      const { data } = await http.get(`/api/v1/request/employee/${emp.id}`);
      requests.push(...data);
    } catch {
      // Si un empleado falla, se ignora y se sigue con el resto
    }
  }

  return { requests, employees };
},

  async getById(id) {
    const { data } = await http.get(`/api/v1/request/${id}`);
    return data;
  },

  async getByEmployeeId(employeeId) {
    const { data } = await http.get(`/api/v1/request/employee/${employeeId}`);
    return data;
  },

  async create(payload) {
    const { data } = await http.post('/api/v1/request', payload);
    return data;
  },

  async approve(id, reviewerId) {
    const { data } = await http.post(`/api/v1/request/${id}/approve`, reviewerId, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  },

  async reject(id, reviewerId, reason) {
    const { data } = await http.post(`/api/v1/request/${id}/reject`, {
      reviewerId,
      reason,
    });
    return data;
  },

  async cancel(id) {
    const { data } = await http.post(`/api/v1/request/${id}/cancel`);
    return data;
  },

  async delete(id) {
    return this.cancel(id);
  },
};