import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/paySlips'; 

export class PayrollApi {
  
  getPaySlips(params = {}) {
    return axios.get(API_BASE_URL, { params });
  }

  downloadPaySlipPdf(slipId) {
    return axios.get(`${API_BASE_URL}/${slipId}`, {
      responseType: 'blob'
    });
  }
}