<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();

function goToRegistration() {
  router.push({ name: 'request-registration' });
}
</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-5">
      <i class="pi pi-file-edit text-primary text-3xl font-bold"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">{{ t('requests.dashboard.title') }}</h1>
    </div>

    <div class="grid gap-4 md:gap-5 m-0">
      <div class="col-12 md:col-6 lg:col-4 p-0">
        <div
          class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
          @click="goToRegistration"
        >
          <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-plus-circle text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">
            {{ t('requests.dashboard.requestRegistration') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>