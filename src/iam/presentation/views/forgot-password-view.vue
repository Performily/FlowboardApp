<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ForgotPasswordForm from "../components/forgot-password-form.vue";
import { useI18n } from 'vue-i18n';

const router = useRouter();

// Estado para controlar si se muestra el formulario o el mensaje de éxito
const isSent = ref(false);

const handleSuccess = () => {
  isSent.value = true;
};

const goBack = () => {
  router.push("/iam/sign-in");
};

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen bg-white relative font-inter">

    <pv-card class="w-full md:w-30rem shadow-2 border-none" style="padding: 2rem;">
      <template #content>
        <div class="flex flex-column align-items-center text-center">

          <h2 class="text-5xl font-bold mb-4" style="color: #4355B9;">
            {{ $t('iam.forgotPassword.title') }}
          </h2>

          <div v-if="!isSent" class="w-full">
            <p class="text-lg mb-5 line-height-3" style="color: #4A4A4B;">
              {{ $t('iam.forgotPassword.description') }}
            </p>

            <forgot-password-form @success="handleSuccess" />

            <pv-button
                :label="$t('iam.forgotPassword.back')"
                class="w-full py-3 mt-3 text-xl font-normal border-none"
                style="background-color: #C5CAE9; color: #1D1D1B;"
                @click="goBack"
            />
          </div>

          <div v-else class="w-full">
            <p class="text-lg mb-6 line-height-3" style="color: #4A4A4B;">
              {{ $t('iam.forgotPassword.successMessage') }}
            </p>

            <pv-button
                :label="$t('iam.forgotPassword.back')"
                class="w-full py-3 text-xl font-normal border-none"
                style="background-color: #C5CAE9; color: #1D1D1B;"
                @click="goBack"
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

/* Ajustes de PrimeVue para coincidir con el mockup */
:deep(.p-card .p-card-body) {
  padding: 0;
}
</style>