<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useIamStore from '../../../iam/application/iam.store.js';

const { t } = useI18n();
const router = useRouter();
const iamStore = useIamStore();

const currentUser = computed(() => iamStore.currentUser);

const goToDirectory = () => {
  router.push({ name: 'employee-selection' });
};

const goToPersonalProfile = () => {
  const userId = currentUser.value?.id || 1;
  router.push({ name: 'employee-personal-profile', params: { id: userId } });
};
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="flex align-items-center gap-3 mb-5">
      <i class="pi pi-briefcase text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">{{ t('management.profile.workInformation') }}</h1>
    </div>

    <div class="grid">
 
      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div 
          class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
          @click="goToDirectory"
        >
          <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-users text-white text-6xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">{{ t('management.profile.directoryColabs') }}</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div 
          class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
          @click="goToPersonalProfile"
        >
          <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-id-card text-white text-6xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">{{ t('management.profile.viewPersonalProfile') }}</span>
        </div>
      </div>

    </div>
  </div>
</template>