
import { createRouter, createWebHistory } from 'vue-router';
import payrollRoutes from './payroll/presentation/payroll-routes.js';
import PayrollDashboard from './payroll/presentation/views/payroll-dashboard.vue';
import PaySlipList from './payroll/presentation/views/pay-slip-list.vue';
const routes = [
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
];


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from) => {
    document.title = `Performily - ${to.meta.title || 'App'}`;
});

export default router;