const paySlipList = () => import('./views/pay-slip-list.vue');
const paySlipDetail = () => import('./views/pay-slip-detail.vue');

const payrollRoutes = [
    { 
        path: 'slips', 
        name: 'payroll-slips', 
        component: paySlipList, 
        meta: { title: 'Boletas de Pago' } 
    },
    { 
        path: 'slips/:id', 
        name: 'payroll-slip-detail', 
        component: paySlipDetail, 
        meta: { title: 'Detalle de Boleta' } 
    }
];

export default payrollRoutes;