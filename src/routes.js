
import { createRouter, createWebHistory } from 'vue-router';
import payrollRoutes from './payroll/presentation/payroll-routes.js';
import PayrollDashboard from './payroll/presentation/views/payroll-dashboard.vue';
import PaySlipList from './payroll/presentation/views/pay-slip-list.vue';
import HomeView from './home/presentation/views/home-view.vue';
import AttendanceList from './attendance/presentation/views/attendance-list.vue';
import ManagementDashboard from './management/presentation/views/management-dashboard.vue';
import EmployeeRegistration from './management/presentation/views/employee-registration.vue';
import RequestList from './requests/presentation/request-list.vue';
import iamRoutes from './iam/presentation/iam-routes.js';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';
import EmployeeUpdate from './management/presentation/views/employee-update.vue';
import EmployeeProfileMenu from './management/presentation/views/employee-profile-menu.vue'; 
import EmployeeSelection from './management/presentation/views/employee-selection.vue';
import EmployeePersonalProfile from './management/presentation/views/employee-personal-profile.vue';
const routes = [

    {
        path: '/',
        redirect: '/iam/sign-in'
    },

        ...iamRoutes,

    {
        path: '/home', 
        name: 'home',
        component: HomeView,
        meta: { title: 'Inicio' }
    },
    {
        path: '/payroll',
        name: 'payroll', 
        component: PayrollDashboard,
        meta: { title: 'Pagos' }
    },
    
    {
        path: '/payroll/slips',
        name: 'pay-slip-list', 
        component: PaySlipList,
        meta: { title: 'Estado de Pagos' }
    },

     {
        path: '/attendance',
        name: 'attendance', 
        component: AttendanceList,
        meta: { title: 'Control de Asistencia' }
    },
    {
        path: '/requests',
        name: 'requests', 
        component: RequestList,
        meta: { title: 'Solicitudes' }
    },
    {
    path: '/requests/registration',
    name: 'request-registration',
    component: () =>
    import('./requests/presentation/request-approval-manager.vue'),
    },
{
        path: '/management',
        name: 'management',
        component: ManagementDashboard,
        meta: { title: 'Gestión' }
    },
    {
        path: '/management/register',
        name: 'employee-registration',
        component: EmployeeRegistration,
        meta: { title: 'Registrar Colaborador' }
    },
    {
        path: '/management/update/:id',
        name: 'employee-update',
        component: EmployeeUpdate,
        meta: { title: 'Actualizar Colaborador' }
    },
    {
        path: '/requests/registration',
        name: 'request-registration',
        component: () => import('./requests/presentation/request-approval-manager.vue'),
    },
    {
        path: '/management/info',
        name: 'info', 
        component: EmployeeProfileMenu,
        meta: { title: 'Información Laboral' }
    },
    {
        path: '/management/info/selection',
        name: 'employee-selection',
        component: EmployeeSelection,
        meta: { title: 'Seleccionar Colaborador' }
    },
    {
        path: '/management/info/profile/:id',
        name: 'employee-personal-profile',
        component: EmployeePersonalProfile,
        meta: { title: 'Perfil Personal' }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach(authenticationGuard);

router.beforeEach((to, from) => {
    document.title = `Performily - ${to.meta.title || 'App'}`;
});


export default router;