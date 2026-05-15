import { defineStore } from 'pinia';
import { ManagementApi } from '../infrastructure/management-api.js';

export const useManagementStore = defineStore('management', {
  actions: {
    async registerEmployee(employeeData) {
      try {
        const employees = await ManagementApi.getAllEmployees();

        let nextNumber = 1;
        if (employees.length > 0) {
          const numbers = employees.map(emp => {
            const parts = emp.code.split('-');
            return parts.length === 2 ? parseInt(parts[1]) : 0;
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
        console.error("Error al registrar colaborador:", error);
        throw error;
      }
    }
  }
});