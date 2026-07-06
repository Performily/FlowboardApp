<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useIamStore from '../../iam/application/iam.store.js'; 
import RequestCreationDialog from './request-creation-dialog.vue'; 

const { t } = useI18n();
const router = useRouter();
const iamStore = useIamStore();
const creationDialog = ref(null); 

const currentUser = computed(() => iamStore.currentUser);
const isHR = computed(() => currentUser.value?.role === 'RRHH'); 
function goToRegistration() {
  router.push({ name: 'request-registration' });
}

function openCreationDialog() {
  creationDialog.value.open();
}
</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-5">
      <i class="pi pi-file-edit text-primary text-3xl font-bold"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">{{ t('requests.dashboard.title') }}</h1>
    </div>

    <div class="grid gap-4 md:gap-5 m-0">
      
      <div class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="openCreationDialog">
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-plus-circle text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">{{ isHR ? 'Crear solicitud' : t('requests.dashboard.newRequest') }}</span>
      </div>

      <div class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goToRegistration">
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-list text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">{{ isHR ? 'Registro de solicitudes' : t('requests.dashboard.listRequest') }}</span>
      </div>

    </div>

    <RequestCreationDialog ref="creationDialog" />
  </div>
</template>

<style scoped>
.md\:col { flex: 1 1 0; }
</style>