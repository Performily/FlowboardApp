export class VacationEntity {
  constructor(id, employeeId, type, title, startDate, endDate, status) {
    this.id = id;
    this.employeeId = employeeId;
    this.type = type;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }
}

export class EmployeeVacationEntity {
  // Agregamos requestStartDate y requestEndDate al constructor
  constructor(id, name, code, area, jobPosition, availableDays, status, requestStartDate, requestEndDate) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.area = area;
    this.jobPosition = jobPosition;
    this.availableDays = availableDays;
    this.status = status; 
    this.requestStartDate = requestStartDate; // Nuevo
    this.requestEndDate = requestEndDate;     // Nuevo
  }
}