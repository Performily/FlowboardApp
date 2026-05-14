import {defineStore} from "pinia";
import {computed, ref} from "vue";

import {IamApi} from "../infrastructure/iam-api.js";

import {SignInAssembler} from "../infrastructure/sign-in.assembler.js";
import {ForgotPasswordAssembler} from "../infrastructure/forgot-password.assembler.js";
import {ResetPasswordAssembler} from "../infrastructure/reset-password.assembler.js";

const iamApi = new IamApi();

const useIamStore = defineStore('iam', () => {

    const currentUser = ref(null);

    const isSignedIn = ref(
        !!localStorage.getItem('token')
    );

    const isAuthenticated = computed(() => {
    return !!localStorage.getItem('token');
    });

    const loading = ref(false);

    const errors = ref([]);

    const currentToken = computed(() => {
        return localStorage.getItem('token');
    });

    async function signIn(signInCommand, router) {

        loading.value = true;

        try {

            const response =
                await iamApi.signIn(signInCommand);

            const signInResource =
                SignInAssembler.toResourceFromResponse(response);

            if (!signInResource) {

                errors.value.push(
                    new Error('Authentication failed')
                );

                return;
            }

            const user =
                SignInAssembler.toEntityFromResource(signInResource);

            currentUser.value = user;

            localStorage.setItem('token', user.token);

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