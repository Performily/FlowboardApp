import { defineStore } from 'pinia';
import { HomeApi } from '../infrastructure/home-api.js';

export const useHomeStore = defineStore('home', {
  state: () => ({
    totalEmployees: 0,
    pendingRequests: [],
    isLoading: false,
    error: null
  }),

  getters: {
    pendingRequestsCount: (state) => state.pendingRequests.length
  },

  actions: {
    async fetchDashboardData() {
      this.isLoading = true;
      this.error = null;
      try {
        const [employeesCount, requests] = await Promise.all([
          HomeApi.getEmployeesCount(),
          HomeApi.getPendingRequests()
        ]);

        this.totalEmployees = employeesCount;
        this.pendingRequests = requests;
      } catch (err) {
        console.error("Error al cargar el dashboard", err);
        this.error = "No se pudo cargar la información.";
      } finally {
        this.isLoading = false;
      }
    }
  }
});

export default useHomeStore;