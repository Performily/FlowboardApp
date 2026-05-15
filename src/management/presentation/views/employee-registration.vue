<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const store = useManagementStore();

const employee = ref({
  name: '',
  civilStatus: null,
  documentNumber: '',
  age: null,
  personalEmail: '',
  phoneNumber: '',
  address: '',
  gender: null,
  workEmail: '',
  hireDate: '',
  contractType: null,
  area: '',
  jobPosition: '',
  educationLevel: ''
});

const civilStatusOptions = [
  { label: t('management.registration.single'), value: 'SINGLE' },
  { label: t('management.registration.married'), value: 'MARRIED' },
  { label: t('management.registration.divorced'), value: 'DIVORCED' },
  { label: t('management.registration.widowed'), value: 'WIDOWED' }
];

const genderOptions = [
  { label: t('management.registration.male'), value: 'MALE' },
  { label: t('management.registration.female'), value: 'FEMALE' },
  { label: t('management.registration.other'), value: 'OTHER' }
];

const contractTypeOptions = [
  { label: t('management.registration.fullTime'), value: 'FULL_TIME' },
  { label: t('management.registration.partTime'), value: 'PART_TIME' },
  { label: t('management.registration.hourly'), value: 'HOURLY' },
  { label: t('management.registration.internship'), value: 'INTERNSHIP' }
];

const isSaving = ref(false);

const saveEmployee = async () => {
  if (!employee.value.name || !employee.value.documentNumber || !employee.value.area) {
    alert(t('management.registration.requiredValidation'));
    return;
  }

  isSaving.value = true;
  try {
    await store.registerEmployee(employee.value);
    alert(t('management.registration.successMessage'));
    router.push({ name: 'management' }); 
  } catch (error) {
    alert(t('management.registration.errorMessage'));
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'management' }); 
};
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="flex align-items-center gap-3 mb-5">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="goBack" />
      <i class="pi pi-user-plus text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl"> {{ t('management.registration.title') }}</h1>
    </div>

    <div class="surface-card shadow-1 border-round-2xl p-5 w-full">
      
      <div class="grid formgrid p-fluid">
        
        <div class="col-12 md:col-6">
          
          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.fullName') }}</label>
            <pv-input-text v-model="employee.name" placeholder="Ej. Juan Pérez" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.documentNumber') }}</label>
            <pv-input-text v-model="employee.documentNumber" placeholder="Ej. 12345678" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.personalEmail') }}</label>
            <pv-input-text v-model="employee.personalEmail" placeholder="ejemplo@correo.com" type="email" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.address') }}</label>
            <pv-input-text v-model="employee.address" placeholder="Av. Principal 123" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.workEmail') }}</label>
            <pv-input-text v-model="employee.workEmail" placeholder="usuario@empresa.com" type="email" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.contractType') }}</label>
            <pv-select v-model="employee.contractType" :options="contractTypeOptions" optionLabel="label" optionValue="value" :placeholder="t('management.registration.selectContractType')" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.jobPosition') }}</label>
            <pv-input-text v-model="employee.jobPosition" placeholder="Ej. Analista Senior" class="w-full" />
          </div>

        </div>

        <div class="col-12 md:col-6">
          
          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.civilStatus') }}</label>
            <pv-select v-model="employee.civilStatus" :options="civilStatusOptions" optionLabel="label" optionValue="value" :placeholder="t('management.registration.selectCivilStatus')" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.age') }}</label>
            <pv-input-text v-model="employee.age" placeholder="Ej. 30" type="number" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.phoneNumber') }}</label>
            <pv-input-text v-model="employee.phoneNumber" placeholder="987654321" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.gender') }}</label>
            <pv-select v-model="employee.gender" :options="genderOptions" optionLabel="label" optionValue="value" :placeholder="t('management.registration.selectGender')" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.hireDate') }}</label>
            <input type="date" class="p-inputtext p-component w-full" v-model="employee.hireDate" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.assignedArea') }}</label>
            <pv-input-text v-model="employee.area" placeholder="Ej. Desarrollo" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">{{ t('management.registration.educationLevel') }}</label>
            <pv-input-text v-model="employee.educationLevel" placeholder="Ej. Bachiller" class="w-full" />
          </div>

        </div>

      </div>

      <div class="flex justify-content-between align-items-center mt-5 pt-4 border-top-1 surface-border">
        <small class="text-500 flex align-items-center gap-2">
          <i class="pi pi-info-circle"></i> 
          {{ t('management.registration.employeeCodeInfo') }}
        </small>
        
        <div class="flex gap-3">
          <pv-button :label="t('management.registration.cancel')" outlined severity="secondary" @click="goBack" />
          <pv-button :label="t('management.registration.registerEmployee')" icon="pi pi-save" :loading="isSaving" @click="saveEmployee" class="bg-primary border-none" />
        </div>
      </div>
      
    </div>

  </div>
</template>