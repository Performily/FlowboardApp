<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { SignInCommand } from "../../domain/sign-in.command.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
const store = useIamStore();

const staySignedIn = ref(false);

const form = reactive({
  email: '',
  password: ''
});

function performSignIn() {

  if (!form.email.trim() || !form.password.trim()) {
    return;
  }

  const signInCommand = new SignInCommand(form);

  store.signIn(signInCommand, router);
}
</script>

<template>
  <form @submit.prevent="performSignIn" class="flex flex-column gap-4">

    <!-- Usuario -->
    <div class="input-container">
      <i class="pi pi-user input-icon"></i>

      <pv-input-text
          v-model="form.email" 
          required
          :placeholder="t('iam.signIn.user')"
          class="custom-input"
      />
    </div>

    <!-- Contraseña -->
    <div class="input-container">
      <i class="pi pi-lock input-icon"></i>

      <pv-input-text
          v-model="form.password"
          required
          type="password"
          :placeholder="t('iam.signIn.password')"
          class="custom-input"
      />
    </div>

    <!-- Checkbox -->
    <div class="flex align-items-center gap-2 ml-2">
      <pv-checkbox
          v-model="staySignedIn"
          :binary="true"
          inputId="staySignedIn"
      />

      <label
          for="staySignedIn"
          class="checkbox-label"
      >
        {{ t('iam.signIn.keepSession') }}
      </label>
    </div>

    <!-- Botón -->
    <pv-button
        type="submit"
        :label="t('iam.signIn.button')"
        class="w-full login-button"
        :loading="store.loading"
    />

    <!-- Forgot password -->
    <div class="text-center mt-2">
      <router-link
          to="/iam/forgot-password"
          class="forgot-password"
      >
        {{ t('iam.signIn.forgotPassword') }}
      </router-link>
    </div>

  </form>
</template>

<style scoped>

.input-container {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4B59B6;
  font-size: 1.2rem;
  z-index: 10;
}

.custom-input {
  width: 100%;
}

:deep(.custom-input .p-inputtext),
:deep(.p-inputtext.custom-input) {
  width: 100%;
  height: 58px;
  padding-left: 3.2rem;
  text-align: center;
  background-color: #F8F9FA;
  border: 1px solid #CED4DA;
  border-radius: 10px;
  color: #000;
  font-size: 1rem;
  font-weight: 500;
}

:deep(.p-inputtext::placeholder) {
  color: #6C757D;
}

.checkbox-label {
  color: #000;
  font-weight: 500;
  cursor: pointer;
}

.login-button {
  height: 58px;
  background-color: #4355B9;
  border: none;
  font-size: 1.2rem;
}

.forgot-password {
  color: #000;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
}

/* Checkbox visible */
:deep(.p-checkbox-box) {
  border: 2px solid #4355B9;
}

</style>