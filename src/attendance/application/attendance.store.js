import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AttendanceApi } from '../infrastructure/attendance-api.js';
import { AttendanceAssembler } from '../infrastructure/attendance-assembler.js';

const attendanceApi = new AttendanceApi();

const useAttendanceStore = defineStore('attendance', () => {

    const attendances = ref([]);
    const errors = ref([]);
    const attendancesLoaded = ref(false);
    const loading = ref(false);


    const attendancesCount = computed(() => {
        return attendancesLoaded.value ? attendances.value.length : 0;
    });
    const totalWorkedHours = computed(() => {
        return attendances.value.reduce((sum, attendance) => sum + attendance.workedHours, 0
        );
    });
    const totalLate = computed(() => {
        return attendances.value.filter(
            attendance => attendance.status === 'late'
        ).length;
    });
    const totalAbsence = computed(() => {
        return attendances.value.filter(
            attendance => attendance.status === 'absence'
        ).length;
    });

    function fetchAttendances(filters = {}) {
        attendanceApi.getAttendances(filters).then(response => {
            attendances.value = AttendanceAssembler.toEntitiesFromResponse(response);
            attendancesLoaded.value = true;
            errors.value = [];
        }).catch(error => {
            console.error('Error fetching attendances:', error);
            errors.value.push(error);
        });
    }


    function getAttendanceByEmployee(employeeId) {

        return attendances.value.filter(
            attendance =>
                attendance.employeeId === employeeId
        );
    }

    function getAttendanceByArea(area) {

        return attendances.value.filter(
            attendance =>
                attendance.area === area
        );
    }

    function getAttendanceByStatus(status) {

        return attendances.value.filter(
            attendance =>
                attendance.status === status
        );
    }


    function getEmployeeSummary(employeeId) {

        const employeeAttendance =
            getAttendanceByEmployee(employeeId);

        return {

            totalRecords:
            employeeAttendance.length,

            attendance:
            employeeAttendance.filter(
                a => a.status === 'attendance'
            ).length,

            late:
            employeeAttendance.filter(
                a => a.status === 'late'
            ).length,

            absence:
            employeeAttendance.filter(
                a => a.status === 'absence'
            ).length,

            totalHours:
                employeeAttendance.reduce(
                    (sum, a) =>
                        sum + a.workedHours,
                    0
                )
        };
    }


    return {

        attendances,
        errors,
        loading,
        attendancesLoaded,

        attendancesCount,
        totalWorkedHours,
        totalLate,
        totalAbsence,

        fetchAttendances,

        getAttendanceByEmployee,
        getAttendanceByArea,
        getAttendanceByStatus,

        getEmployeeSummary
    };
});

export default useAttendanceStore;