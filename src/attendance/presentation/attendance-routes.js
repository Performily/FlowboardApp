const attendanceList = () => import('./views/attendance-list.vue');

const attendanceRoutes = [
    { 
        path: '/attendance', 
        name: 'attendance', 
        component: attendanceList, 
        meta: { title: 'Control de Asistencia' } 
    }
];

export default attendanceRoutes;