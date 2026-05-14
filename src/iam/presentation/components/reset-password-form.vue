<script setup>
import { reactive, defineEmits } from "vue";
import { useRoute } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { ResetPasswordCommand } from "../../domain/reset-password.command.js";

const route = useRoute();
const store = useIamStore();
const emit = defineEmits(["success"]);

const form = reactive({
  newPassword: '',
  confirmPassword: ''
});

async function performResetPassword() {
  if (form.newPassword !== form.confirmPassword) {
    // Aquí podrías usar un pv-toast para mostrar el error de coincidencia
    return;
  }

  const command = new ResetPasswordCommand({
    token: route.query.token, // Obtenemos el token de la URL
    newPassword: form.newPassword
  });

  try {
    await store.resetPassword(command);
    emit("success");
  } catch (error) {
    console.error("Error al restablecer:", error);
  }
}
</script>

<template>
  <form @submit.prevent="performResetPassword" class="w-full text-left">

    <div class="flex flex-column gap-2 mb-4">
      <label for="newPassword" class="text-lg font-bold">Nueva contraseña</label>
      <pv-password
          id="newPassword"
          v-model="form.newPassword"
          toggle-mask
          :feedback="false"
          placeholder="Escribe tu nueva contraseña"
          class="w-full"
          input-class="w-full py-3 px-3 border-round-md text-lg"
          style="background-color: #FFFFFF;"
          required
      />
    </div>

    <div class="flex flex-column gap-2 mb-5">
      <label for="confirmPassword" class="text-lg font-bold">Confirmar contraseña</label>
      <pv-password
          id="confirmPassword"
          v-model="form.confirmPassword"
          toggle-mask
          :feedback="false"
          placeholder="Repite tu nueva contraseña"
          class="w-full"
          input-class="w-full py-3 px-3 border-round-md text-lg"
          style="background-color: #FFFFFF;"
          required
      />
    </div>

    <pv-button
        type="submit"
        label="Restablecer contraseña"
        class="w-full py-3 text-xl font-normal border-none shadow-2"
        style="background-color: #4355B9; color: white;"
        :loading="store.loading"
    />
  </form>
</template>