<script setup>
import { reactive, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import useIamStore from "../../application/iam.store.js";

const { t } = useI18n();
const router = useRouter();
const store = useIamStore();
const emit = defineEmits(["success"]);

const form = reactive({
  temporaryPassword: '', // 🔥 Capturamos la clave temporal directo del usuario
  newPassword: '',
  confirmPassword: ''
});

async function performResetPassword() {
  if (form.newPassword !== form.confirmPassword) {
    console.error("Las contraseñas no coinciden");
    return;
  }

  const command = {
    email: store.currentUser?.email,              // El correo de la sesión actual
    temporaryPassword: form.temporaryPassword,    // 🔥 Ahora sí viaja el string tipeado
    newPassword: form.newPassword
  };

  console.log("Enviando comando de reseteo corregido:", command);

  try {
    await store.resetPassword(command, router);
    emit("success");
  } catch (error) {
    console.error("Error al restablecer:", error);
  }
}
</script>

<template>
  <form @submit.prevent="performResetPassword" class="w-full text-left">

    <div class="flex flex-column gap-2 mb-4">
      <label for="temporaryPassword" class="text-lg font-bold">{{ t('iam.resetPassword.temporaryPassword') }}</label>
      <pv-password
          id="temporaryPassword"
          v-model="form.temporaryPassword"
          toggle-mask
          :feedback="false"
          :placeholder="t('iam.resetPassword.temporaryPasswordPlaceholder')"
          class="w-full"
          input-class="w-full py-3 px-3 border-round-md text-lg"
          required
      />
    </div>

    <div class="flex flex-column gap-2 mb-4">
      <label for="newPassword" class="text-lg font-bold">{{ t('iam.resetPassword.newPassword') }}</label>
      <pv-password
          id="newPassword"
          v-model="form.newPassword"
          toggle-mask
          :feedback="false"
          :placeholder="t('iam.resetPassword.newPasswordPlaceholder')"
          class="w-full"
          input-class="w-full py-3 px-3 border-round-md text-lg"
          required
      />
    </div>

    <div class="flex flex-column gap-2 mb-5">
      <label for="confirmPassword" class="text-lg font-bold"> {{ t('iam.resetPassword.confirmPassword') }}</label>
      <pv-password
          id="confirmPassword"
          v-model="form.confirmPassword"
          toggle-mask
          :feedback="false"
          :placeholder="t('iam.resetPassword.confirmPasswordPlaceholder')"
          class="w-full"
          input-class="w-full py-3 px-3 border-round-md text-lg"
          required
      />
    </div>

    <pv-button
        type="submit"
        :label="t('iam.resetPassword.button')"
        class="w-full py-3 text-xl font-normal border-none shadow-2"
        style="background-color: #4355B9; color: white;"
        :loading="store.loading"
    />
  </form>
</template>