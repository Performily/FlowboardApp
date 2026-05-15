import { VacationEntity, EmployeeVacationEntity } from '../domain/vacation.entity.js';

export class VacationAssembler {
  static toVacationEntity(dto) {
    return new VacationEntity(
      dto.id,
      dto.employeeId,
      dto.type,
      dto.title,
      new Date(dto.startDate),
      new Date(dto.endDate),
      dto.status
    );
  }

  static toEmployeeVacationEntity(employeeDto, vacationRequests) {
    const request = vacationRequests.find(req => req.employeeId === employeeDto.id);
    
    return new EmployeeVacationEntity(
      employeeDto.id,
      employeeDto.name,
      employeeDto.code,
      employeeDto.area,
      employeeDto.jobPosition,
      employeeDto.availableDays,
      request ? request.status : 'Disponible',
      request ? request.startDate : null, // Extraemos la fecha de inicio
      request ? request.endDate : null    // Extraemos la fecha de fin
    );
  }
}