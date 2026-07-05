import useIamStore from "../application/iam.store.js";

export const authenticationGuard = (to) => {

    const store = useIamStore();

    const publicRoutes = [
        '/iam/sign-in',
        '/iam/forgot-password',
        '/iam/reset-password'
    ];

    const isPublicRoute = publicRoutes.includes(to.path);

    // 1. Si NO está autenticado y quiere entrar a una ruta privada -> redirigir login
    if (!store.isSignedIn && !isPublicRoute) {
        return {
            name: 'iam-sign-in'
        };
    }

    // 2. Si YA inició sesión pero tiene contraseña temporal activa...
    if (store.isSignedIn && store.currentUser?.temporaryPassword) {
        // ...y NO está intentando ir a la pantalla de reset, obligarlo a ir ahí
        if (to.name !== 'iam-reset-password') {
            console.log("🔒 Forzando redirección al cambio de contraseña definitiva.");
            return {
                name: 'iam-reset-password'
            };
        }
        // Si ya va en camino a reset-password, lo dejamos pasar libremente
        return true;
    }

    // 3. Si YA inició sesión normalmente (sin contraseña temporal) y quiere ir a una ruta pública (como el login)
    if (store.isSignedIn && isPublicRoute) {
        return {
            name: 'home'
        };
    }

    return true;
};