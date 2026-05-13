
import { createRouter, createWebHistory } from 'vue-router';
import payrollRoutes from './payroll/presentation/payroll-routes.js';

const routes = [
    { 
        path: '/payroll', 
        name: 'payroll', 
        children: payrollRoutes 
    },
    
    { 
        path: '/', 
        redirect: '/payroll/slips' 
    }
];

// 3. Crear la instancia del router
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from) => {
    document.title = `Performily - ${to.meta.title || 'App'}`;
});

export default router;