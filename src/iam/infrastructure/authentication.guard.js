import useIamStore from "../application/iam.store.js";

export const authenticationGuard = (to, from, next) => {

    const store = useIamStore();

    const publicRoutes = [
        '/iam/sign-in',
        '/iam/forgot-password',
        '/iam/reset-password'
    ];

    const isPublicRoute = publicRoutes.includes(to.path);

    // NO autenticado
    if (!store.isSignedIn && !isPublicRoute) {

        return next({
            name: 'iam-sign-in'
        });
    }

    // YA autenticado
    if (store.isSignedIn && isPublicRoute) {

        return next({
            name: 'home'
        });
    

    next();
}}