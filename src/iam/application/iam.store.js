import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {IamApi} from "../infrastructure/iam-api.js";

import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {ForgotPasswordAssembler} from "../infrastructure/forgot-password.assembler.js";
import {ResetPasswordAssembler} from "../infrastructure/reset-password.assembler.js";

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {

    const currentUser = ref(
        JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')) || null
    );

    const isSignedIn = ref(
        !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    );

    const isAuthenticated = computed(() => {
    return !!localStorage.getItem('token');
    });

    const loading = ref(false);

    const errors = ref([]);

    const currentToken = computed(() => {
        return ( localStorage.getItem('token') || sessionStorage.getItem('token'));
    });

    async function signIn(signInCommand, router, staySignedIn = false) {

        loading.value = true;

        try {

            const response =
                await iamApi.signIn(signInCommand);

            console.log(response.data);

            const signInResource =
                SignInAssembler.toResourceFromResponse(response);

            if (!signInResource) {

                errors.value.push(
                    new Error('Authentication failed')
                );

                return;
            }

            const user =
                SignInAssembler.toEntityFromResource({
                     ...signInResource,
                     fullName: signInResource.fullName || response.data.fullName
                 });

            currentUser.value = user;

            if (staySignedIn) {
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('token', user.token);
                sessionStorage.setItem('user', JSON.stringify(user));
            }

            isSignedIn.value = true;

            errors.value = [];

            if (user.temporaryPassword) {

                router.push({
                    name: 'iam-reset-password'
                });

                return;
            }

            router.push({
                name: 'home'
            });

        } catch (error) {

            console.error(error);

            isSignedIn.value = false;

            errors.value.push(error);

            router.push({
                name: 'iam-sign-in'
            });

        } finally {

            loading.value = false;
        }
    }

    async function forgotPassword(forgotPasswordCommand) {

        loading.value = true;

        try {

            const response =
                await iamApi.forgotPassword(forgotPasswordCommand);

            const resource =
                ForgotPasswordAssembler.toResourceFromResponse(response);

            errors.value = [];

            return resource;

        } catch (error) {

            console.error(error);

            errors.value.push(error);

        } finally {

            loading.value = false;
        }
    }

    async function resetPassword(resetPasswordCommand, router) {

        loading.value = true;

        try {

            const response =
                await iamApi.resetPassword(resetPasswordCommand);

            const resource =
                ResetPasswordAssembler.toResourceFromResponse(response);

            errors.value = [];

            router.push({
                name: 'iam-sign-in'
            });

            return resource;

        } catch (error) {

            console.error(error);

            errors.value.push(error);

        } finally {

            loading.value = false;
        }
    }

    function signOut(router) {

        currentUser.value = null;

        isSignedIn.value = false;

        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        errors.value = [];

        router.push({
            name: 'iam-sign-in'
        });
    }

    return {
        currentUser,
        isSignedIn,
        isAuthenticated,
        currentToken,
        loading,
        errors,
        signIn,
        forgotPassword,
        resetPassword,
        signOut
    };
});

export default useIamStore;