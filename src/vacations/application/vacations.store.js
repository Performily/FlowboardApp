import { defineStore } from 'pinia';
// Importamos el objeto, no la clase
import { vacationsApi } from '../infrastructure/vacations-api.js'; 
import { VacationAssembler } from '../infrastructure/vacation-assembler.js';

export const useVacationsStore = defineStore('vacations', {
  state: () => ({
    employeesList: [],
    vacationRequests: [],
    loading: false,
    selectedEmployee: null,
  }),
  getters: {
    totalEmployees: (state) => state.employeesList.length,
    availableEmployees: (state) => state.employeesList.filter(e => e.status === 'Disponible').length,
    scheduledVacations: (state) => state.employeesList.filter(e => e.status === 'Aprobado').length,
    pendingRequests: (state) => state.employeesList.filter(e => e.status === 'Pendiente').length,
  },
  actions: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        // Llamamos al objeto vacationsApi
        const [employeesData, requestsData] = await Promise.all([
          vacationsApi.getEmployees(),
          vacationsApi.getVacationRequests()
        ]);

        // Transformamos directamente los arreglos a entidades
        this.vacationRequests = requestsData.map(dto => VacationAssembler.toVacationEntity(dto));
        this.employeesList = employeesData.map(dto => 
          VacationAssembler.toEmployeeVacationEntity(dto, requestsData)
        );
      } catch (error) {
        console.error("Error fetching vacations data", error);
      } finally {
        this.loading = false;
      }
    },
    selectEmployee(employee) {
      this.selectedEmployee = employee;
    },
    async createVacationRequest(vacationData) {
      try {
        await vacationsApi.createVacation(vacationData);
        // Opcional: Volver a cargar los datos para que la tabla se actualice
        await this.fetchDashboardData(); 
      } catch (error) {
        console.error("Error al guardar la vacación", error);
        throw error;
      }
    }
  }
});