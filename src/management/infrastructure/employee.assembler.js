
import { Employee } from '../domain/employee.entity';

export const employeeAssembler = {

  toDomain(raw) {
    if (!raw) return null;
    return new Employee(raw);
  },

 
  toDomainList(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(raw => this.toDomain(raw));
  },

  toApi(entity) {
    return {
      code: entity.code,
      name: entity.name,
      civilStatus: entity.civilStatus,
      documentNumber: entity.documentNumber,
      age: entity.age,
      personalEmail: entity.personalEmail,
      phoneNumber: entity.phoneNumber,
      address: entity.address,
      gender: entity.gender,
      workEmail: entity.workEmail,
      hireDate: entity.hireDate,
      contractType: entity.contractType,
      area: entity.area,
      jobPosition: entity.jobPosition,
      status: entity.status || 'ACTIVE',
      educationLevel: entity.educationLevel,
      availableDays: entity.availableDays || 0
    };
  }
};