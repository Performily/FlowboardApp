import axios from 'axios';

const API_BASE_URL = '/api/v1/payroll'; 

export const PayrollAPI = {
  async fetchPaySlips(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/slips`, { 
        params,
      });
      
      return response.data; 
    } catch (error) {
      console.error('Error fetching pay slips:', error);
      throw error;
    }
  },

  async downloadPaySlipPdf(slipId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/slips/${slipId}/download`, {
        responseType: 'blob', 
      });
      
      return response.data; 
    } catch (error) {
      console.error(`Error downloading PDF for slip ${slipId}:`, error);
      throw error;
    }
  }
};