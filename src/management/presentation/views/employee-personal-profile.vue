<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ManagementApi } from '../../infrastructure/management-api.js';
import { employeeAssembler } from '../../infrastructure/employee.assembler.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const employee = ref(null);
const isLoading = ref(true);

const civilStatusMap = {
  MARRIED: t('management.profile.married'),
  SINGLE: t('management.profile.single'),
  DIVORCED: t('management.profile.divorced'),
  WIDOWED: t('management.profile.widowed')
};

const contractMap = {
  FULL_TIME: t('management.profile.fullTime'),
  PART_TIME: t('management.profile.partTime'),
  HOURLY: t('management.profile.hourly')
};

onMounted(async () => {
  try {
    const raw = await ManagementApi.getEmployeeById(route.params.id);
    employee.value = employeeAssembler.toDomain(raw);
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center gap-3 mb-5">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="router.back()" />
      <i class="pi pi-user text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">  {{ t('management.profile.personalProfile') }}</h1>
    </div>

    <div v-if="isLoading" class="flex justify-content-center p-8">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>

    <div v-else-if="employee" class="grid">
      
      <div class="col-12 md:col-4 lg:col-3">
        <div class="surface-card shadow-1 border-round-2xl p-5 flex flex-column align-items-center h-full">
          <div class="w-12rem h-12rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-user text-white" style="font-size: 6rem"></i>
          </div>
          
          <h2 class="m-0 text-3xl font-bold text-900 text-center mb-1">{{ employee.name }}</h2>
          <p class="m-0 text-600 font-medium text-center mb-6">{{ employee.jobPosition }}</p>

          <div class="w-full flex flex-column gap-4">
            <div>
              <label class="block text-500 text-sm mb-1">{{ t('management.profile.status') }}</label>
              <span class="text-900 font-medium">{{ t('management.profile.active') }}</span>
            </div>
            <div>
              <label class="block text-500 text-sm mb-1">{{ t('management.profile.personalEmail') }}</label>
              <span class="text-900 font-medium block shadow-none" style="word-break: break-all;">{{ employee.personalEmail }}</span>
            </div>
            <div>
              <label class="block text-500 text-sm mb-1">{{ t('management.profile.phoneNumber') }}</label>
              <span class="text-900 font-medium">{{ employee.phoneNumber }}</span>
            </div>
            <div>
              <label class="block text-500 text-sm mb-1">{{ t('management.profile.address') }}</label>
              <span class="text-900 font-medium">{{ employee.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-8 lg:col-9 flex flex-column gap-4">
        
        <div class="surface-card shadow-1 border-round-2xl p-5">
          <h3 class="m-0 text-400 font-normal text-2xl mb-5">{{ t('management.profile.personalData') }}</h3>
          <div class="grid">
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.fullName') }}</label>
              <span class="text-900">{{ employee.name }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.civilStatus') }}</label>
              <span class="text-900">{{ civilStatusMap[employee.civilStatus] || employee.civilStatus }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.dni') }}</label>
              <span class="text-900">{{ employee.documentNumber }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.age') }}</label>
              <span class="text-900">{{ employee.age }} {{ t('management.profile.years') }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.personalEmail') }}</label>
              <span class="text-900">{{ employee.personalEmail }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.phoneNumber') }}</label>
              <span class="text-900">{{ employee.phoneNumber }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.address') }}</label>
              <span class="text-900">{{ employee.address }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.gender') }}</label>
              <span class="text-900">
                {{ employee.gender === 'MALE'? t('management.profile.male'): t('management.profile.female')}}
              </span>
            </div>
          </div>
        </div>

        <div class="surface-card shadow-1 border-round-2xl p-5">
          <h3 class="m-0 text-400 font-normal text-2xl mb-5">{{ t('management.profile.workData') }}</h3>
          <div class="grid">
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.workEmail') }}</label>
              <span class="text-900">{{ employee.workEmail }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.hireDate') }}</label>
              <span class="text-900">{{ employee.hireDate }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.contractType') }}</label>
              <span class="text-900">{{ contractMap[employee.contractType] || employee.contractType }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.assignedArea') }}</label>
              <span class="text-900">{{ employee.area }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.jobPosition') }}</label>
              <span class="text-900">{{ employee.jobPosition }}</span>
            </div>
            <div class="col-12 md:col-6 mb-4">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.status') }}</label>
              <span class="text-success font-bold">{{ t('management.profile.active') }}</span>
            </div>
            <div class="col-12 md:col-6">
              <label class="block text-600 font-medium mb-1">{{ t('management.profile.educationLevel') }}</label>
              <span class="text-900">{{ employee.educationLevel }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>