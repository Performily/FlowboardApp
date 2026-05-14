import useIamStore from "../application/iam.store.js";

export const iamInterceptor = (config) => {

    const store = useIamStore();

    if (store.isSignedIn && store.currentToken) {

        config.headers.Authorization =
            `Bearer ${store.currentToken}`;
    }

    return config;
}