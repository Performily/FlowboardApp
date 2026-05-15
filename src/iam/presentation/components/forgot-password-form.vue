<script setup>
import { reactive, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

import useIamStore from "../../application/iam.store.js";
import { ForgotPasswordCommand } from "../../domain/forgot-password.command.js";

const { t } = useI18n();

const store = useIamStore();
const emit = defineEmits(["success"]);

const form = reactive({
  email: ''
});

async function performForgotPassword() {
  const command = new ForgotPasswordCommand(form);
  try {
    await store.forgotPassword(command);
    // Emitimos el éxito para que la vista cambie al mensaje de confirmación
    emit("success");
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
  }
}
</script>

<template>
  <form @submit.prevent="performForgotPassword" class="w-full text-left">
    <div class="flex flex-column gap-2 mb-5">
      <label for="email" class="text-lg font-bold">{{ t('iam.forgotPassword.email') }}</label>
      <pv-input-text
          id="email"
          v-model="form.email"
          type="email"
          :placeholder="t('iam.forgotPassword.email')"
          class="w-full py-3 px-3 border-round-md text-lg"
          style="background-color: #FFFFFF; border: 1px solid #CED4DA;"
          required
      />
    </div>

    <pv-button
        type="submit"
        :label="t('iam.forgotPassword.button')"
        class="w-full py-3 text-xl font-normal border-none shadow-1"
        style="background-color: #4355B9; color: white;"
        :loading="store.loading"
    />
  </form>
</template>