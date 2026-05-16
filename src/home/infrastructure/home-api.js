import axios from 'axios';

const API_URL = 'https://flowboard-api-zmju.onrender.com';

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