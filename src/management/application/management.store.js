// file: src/management/application/management.store.js
import { defineStore } from 'pinia';
import { ManagementApi } from '../infrastructure/management-api.js';
import { employeeAssembler } from '../infrastructure/employee.assembler.js';

export const useManagementStore = defineStore('management', {
  state: () => ({
    employees: [] 
  }),

  actions: {
    async fetchEmployees() {
      try {
        const rawEmployees = await ManagementApi.getAllEmployees();
        this.employees = employeeAssembler.toDomainList(rawEmployees);
      } catch (error) {
        console.error('Error al obtener colaboradores:', error);
        throw error;
      }
    },

    async registerEmployee(employeeData) {
      try {
        const rawEmployees = await ManagementApi.getAllEmployees();

        let nextNumber = 1;

        if (rawEmployees.length > 0) {
          const numbers = rawEmployees.map(emp => {
            const parts = emp.code?.split('-');
            return parts?.length === 2 ? parseInt(parts[1]) : 0;
          });
          nextNumber = Math.max(...numbers) + 1;
        }

        const newCode = `COL-${String(nextNumber).padStart(3, '0')}`;

        const rawToSave = employeeAssembler.toApi({
          ...employeeData,
          code: newCode
        });

        const savedRaw = await ManagementApi.createEmployee(rawToSave);


        this.employees.push(employeeAssembler.toDomain(savedRaw));

        return true;
      } catch (error) {
        console.error('Error al registrar colaborador:', error);
        throw error;
      }
    },

    async updateEmployee(id, employeeData) {
      try {
  
        const rawToUpdate = employeeAssembler.toApi(employeeData);
        
        const updatedRaw = await ManagementApi.updateEmployee(id, rawToUpdate);


        const updatedEntity = employeeAssembler.toDomain(updatedRaw);

    
        const index = this.employees.findIndex(employee => employee.id === id);
        if (index !== -1) {
          this.employees[index] = updatedEntity;
        }

        return updatedEntity;
      } catch (error) {
        console.error('Error al actualizar colaborador:', error);
        throw error;
      }
    }
  }
});