<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResetPasswordForm from "../components/reset-password-form.vue";

const router = useRouter();
const isResetSuccessful = ref(false);

const handleSuccess = () => {
  isResetSuccessful.value = true;
};

const goToLogin = () => {
  router.push("/iam/sign-in");
};
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-white relative font-inter">

    <pv-card class="w-full md:w-30rem shadow-2 border-none" style="padding: 2rem;">
      <template #content>
        <div class="flex flex-column align-items-center text-center">

          <h2 class="text-5xl font-bold mb-4" style="color: #4355B9;">
            {{ isResetSuccessful ? 'Contraseña restablecida' : 'Restablecer contraseña' }}
          </h2>

          <div v-if="!isResetSuccessful" class="w-full">
            <p class="text-lg mb-5 line-height-3" style="color: #4A4A4B;">
              Crea una nueva contraseña para tu cuenta de Flowboard.
            </p>

            <reset-password-form @success="handleSuccess" />
          </div>

          <div v-else class="w-full">
            <p class="text-lg mb-6 line-height-3" style="color: #4A4A4B;">
              Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
            </p>

            <pv-button
                label="Ir al inicio de sesión"
                class="w-full py-3 text-xl font-normal border-none shadow-1"
                style="background-color: #4355B9; color: white;"
                @click="goToLogin"
            />
          </div>

        </div>
      </template>
    </pv-card>

    <div class="absolute bottom-0 right-0 m-4 flex align-items-center gap-2">
      <!--<img src="@/assets/images/logo-performily.png" alt="Flowboard" style="width: 24px; filter: grayscale(100%); opacity: 0.7;"/> -->
      <span class="font-medium text-xl" style="color: #4A4A4B;">Flowboard</span>
    </div>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
:deep(.p-card .p-card-body) {
  padding: 0;
}
</style>