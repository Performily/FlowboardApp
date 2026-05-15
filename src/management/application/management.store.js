import { defineStore } from 'pinia';
import { ManagementApi } from '../infrastructure/management-api.js';

export const useManagementStore = defineStore('management', {
  state: () => ({
    employees: []
  }),

  actions: {
    async fetchEmployees() {
      try {
        this.employees = await ManagementApi.getAllEmployees();
      } catch (error) {
        console.error('Error al obtener colaboradores:', error);
        throw error;
      }
    },

    async registerEmployee(employeeData) {
      try {
        const employees = await ManagementApi.getAllEmployees();

        let nextNumber = 1;

        if (employees.length > 0) {
          const numbers = employees.map(emp => {
            const parts = emp.code?.split('-');
            return parts?.length === 2 ? parseInt(parts[1]) : 0;
          });

          nextNumber = Math.max(...numbers) + 1;
        }

        const newCode = `COL-${String(nextNumber).padStart(3, '0')}`;

        const newEmployee = {
          ...employeeData,
          code: newCode
        };

        await ManagementApi.createEmployee(newEmployee);

        return true;
      } catch (error) {
        console.error('Error al registrar colaborador:', error);
        throw error;
      }
    },

    async updateEmployee(id, employeeData) {
      try {
        const updatedEmployee = await ManagementApi.updateEmployee(id, employeeData);

        const index = this.employees.findIndex(employee => employee.id === id);

        if (index !== -1) {
          this.employees[index] = updatedEmployee;
        }

        return updatedEmployee;
      } catch (error) {
        console.error('Error al actualizar colaborador:', error);
        throw error;
      }
    }
  }
});