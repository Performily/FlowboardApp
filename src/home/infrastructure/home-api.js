import axios from 'axios';

const API_URL = 'http://localhost:3000';

export class HomeApi {
  static async getEmployeesCount() {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data.length;
  }

  static async getPendingRequests() {
    const response = await axios.get(`${API_URL}/requests?status=Pendiente`);
    return response.data;
  }
}