const AttendanceDashboard = () => import('./views/attendance-dashboard.vue');
const AttendanceList = () => import('./views/attendance-list.vue');
const AttendanceEmployeeSummary = () => import('./views/attendance-employee-summary.vue');

const attendanceRoutes = [
    { 
        path: '/attendance', 
        name: 'attendance', 
        component: AttendanceDashboard, 
        meta: { title: 'Asistencia' } 
    },
    { 
        path: '/attendance/list', 
        name: 'attendance-list', 
        component: AttendanceList, 
        meta: { title: 'Registro de Asistencia' } 
    },
    { 
        path: '/attendance/summary', 
        name: 'attendance-summary', 
        component: AttendanceEmployeeSummary, 
        meta: { title: 'Resumen por Colaborador' } 
    }
];

export default attendanceRoutes;