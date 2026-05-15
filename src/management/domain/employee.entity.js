export class Employee {
  constructor({
    id, code, name, civilStatus, documentNumber, age, personalEmail,
    phoneNumber, address, gender, workEmail, hireDate, contractType,
    area, jobPosition, status, educationLevel, availableDays
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.civilStatus = civilStatus;
    this.documentNumber = documentNumber;
    this.age = age ? Number(age) : null;
    this.personalEmail = personalEmail;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.gender = gender;
    this.workEmail = workEmail;
    this.hireDate = hireDate;
    this.contractType = contractType;
    this.area = area;
    this.jobPosition = jobPosition;
    this.status = status || 'ACTIVE';
    this.educationLevel = educationLevel;
    this.availableDays = availableDays ? Number(availableDays) : 0; 
  }

  get isActive() {
    return this.status === 'ACTIVE';
  }
}