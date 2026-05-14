import { Attendance } from '../domain/model/attendance.entity.js';

export class AttendanceAssembler {

    static toEntityFromResource(resource) {

        if (!resource) return null;

        return new Attendance({
            id: resource.id,
            employeeId: resource.employeeId,
            employeeName: resource.employeeName,
            area: resource.area,
            date: resource.date,
            checkIn: resource.checkIn,
            checkOut: resource.checkOut,
            workedHours: resource.workedHours,
            status: resource.status
        });
    }

    static toEntitiesFromResponse(response) {

        if (response.status !== 200) {
            console.error(
                `${response.status}, ${response.statusText}`
            );
            return [];
        }

        const resources =
            Array.isArray(response.data) ? response.data : response.data['attendance'];

        if (!resources) return [];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}