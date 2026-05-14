const SignInView = () =>
    import('./views/sign-in-view.vue');

const ForgotPasswordView = () =>
    import('./views/forgot-password-view.vue');

const ResetPasswordView = () =>
    import('./views/reset-password-view.vue');

const iamRoutes = [

    {
        path: '/iam/sign-in',
        name: 'iam-sign-in',
        component: SignInView,
        meta: {
            title: 'Iniciar Sesión',
            layout: 'auth'
        }
    },

    {
        path: '/iam/forgot-password',
        name: 'iam-forgot-password',
        component: ForgotPasswordView,
        meta: {
            title: 'Recuperar Contraseña',
            layout: 'auth'
        }
    },

    {
        path: '/iam/reset-password',
        name: 'iam-reset-password',
        component: ResetPasswordView,
        meta: {
            title: 'Restablecer Contraseña',
            layout: 'auth'
        }
    }
];

export default iamRoutes;