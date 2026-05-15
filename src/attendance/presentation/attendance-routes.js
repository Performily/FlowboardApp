const AttendanceDashboard = () => import('./views/attendance-dashboard.vue');
const AttendanceList = () => import('./views/attendance-list.vue');

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
    }
];

export default attendanceRoutes;