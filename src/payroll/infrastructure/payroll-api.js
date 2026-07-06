import axios from 'axios';

const API_BASE_URL = 'https://flowboardwebservice.onrender.com';

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