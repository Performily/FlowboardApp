export class Attendance {

    constructor({id = '', employeeId = '', employeeName = '', area = '', date = '',
                    checkIn = '', checkOut = '', workedHours = 0, status = 'attendance'
                }) {

        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.area = area;
        this.date = date;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.workedHours = workedHours;
        this.status = status ||'Pendiente';
    }
    
}