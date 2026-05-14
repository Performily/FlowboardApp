import useIamStore from "../application/iam.store.js";

export const authenticationGuard = (to) => {

    const store = useIamStore();

    const publicRoutes = [
        '/iam/sign-in',
        '/iam/forgot-password',
        '/iam/reset-password'
    ];

    const isPublicRoute =
        publicRoutes.includes(to.path);

    // Si NO está autenticado y quiere entrar
    // a una ruta privada -> redirigir login
    if (!store.isSignedIn && !isPublicRoute) {

        return {
            name: 'iam-sign-in'
        };
    }

    // Si YA inició sesión y quiere ir al login
    if (store.isSignedIn && isPublicRoute) {

        return {
            name: 'home'
        };
    }

    return true;
};