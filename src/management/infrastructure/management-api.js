import axios from 'axios';

const API_URL = 'http://localhost:3000/employees';

export class ManagementApi {
  static async getAllEmployees() {
    const response = await axios.get(API_URL);
    return response.data;
  }

  static async createEmployee(employeeData) {
    const response = await axios.post(API_URL, employeeData);
    return response.data;
  }

  static async updateEmployee(id, employeeData) {
    const response = await axios.put(`${API_URL}/${id}`, employeeData);
    return response.data;
  }

  static async terminateEmployee(id, terminationData) {
    const response = await axios.patch(`${API_URL}/${id}`, terminationData);
    return response.data;
  }
}