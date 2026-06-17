<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const store = useManagementStore();

const selectedEmployee = ref(null);
const isSaving = ref(false);

const filters = ref({
  area: '',
  jobPosition: ''
});

// Este es el "DTO" o comando que recolecta los datos del formulario
const employee = ref({
  id: null,
  code: '',
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
  status: 'ACTIVE',
  educationLevel: ''
});

const civilStatusOptions = [
  { label: t('management.update.single'), value: 'SINGLE' },
  { label: t('management.update.married'), value: 'MARRIED' },
  { label: t('management.update.divorced'), value: 'DIVORCED' },
  { label: t('management.update.widowed'), value: 'WIDOWED' }
];

const genderOptions = [
  { label: t('management.update.male'), value: 'MALE' },
  { label: t('management.update.female'), value: 'FEMALE' },
  { label: t('management.update.other'), value: 'OTHER' }
];

const contractTypeOptions = [
  { label: t('management.update.fullTime'), value: 'FULL_TIME' },
  { label: t('management.update.partTime'), value: 'PART_TIME' },
  { label: t('management.update.hourly'), value: 'HOURLY' },
  { label: t('management.update.internship'), value: 'INTERNSHIP' }
];

const statusOptions = [
  { label: t('management.update.active'), value: 'ACTIVE' },
  { label: t('management.update.inactive'), value: 'INACTIVE' },
  { label: t('management.update.terminated'), value: 'TERMINATED' }
];

// Opciones de filtros basadas en las Entidades del Store
const areaOptions = computed(() => {
  return [...new Set(store.employees.map(item => item.area).filter(Boolean))];
});

const jobPositionOptions = computed(() => {
  return [...new Set(store.employees.map(item => item.jobPosition).filter(Boolean))];
});

// Listado filtrado usando las Entidades
const filteredEmployees = computed(() => {
  return store.employees.filter(item => {
    const matchesArea = !filters.value.area || item.area === filters.value.area;
    const matchesJobPosition = !filters.value.jobPosition || item.jobPosition === filters.value.jobPosition;
    return matchesArea && matchesJobPosition;
  });
});

const selectEmployee = (item) => {
  selectedEmployee.value = item;

  // Mapeamos los datos de la Entidad al objeto reactivo del formulario
  employee.value = {
    id: item.id,
    code: item.code || '',
    name: item.name || '',
    civilStatus: item.civilStatus || null,
    documentNumber: item.documentNumber || '',
    age: item.age || null,
    personalEmail: item.personalEmail || '',
    phoneNumber: item.phoneNumber || '',
    address: item.address || '',
    gender: item.gender || null,
    workEmail: item.workEmail || '',
    hireDate: item.hireDate || '',
    contractType: item.contractType || null,
    area: item.area || '',
    jobPosition: item.jobPosition || '',
    status: item.status || 'ACTIVE',
    educationLevel: item.educationLevel || ''
  };
};

const clearFilters = () => {
  filters.value.area = '';
  filters.value.jobPosition = '';
};

const goBack = () => {
  router.push({ name: 'management' });
};

const backToList = () => {
  selectedEmployee.value = null;
};

const saveChanges = async () => {
  if (!employee.value.name || !employee.value.documentNumber || !employee.value.area) {
    alert(t('management.update.requiredValidation'));
    return;
  }

  isSaving.value = true;

  try {
    // El Store llamará al Assembler.toApi para transformar estos datos antes de enviarlos
    await store.updateEmployee(employee.value.id, employee.value);
    alert(t('management.update.successMessage'));
    selectedEmployee.value = null;
    await store.fetchEmployees(); // Refrescamos la lista de entidades
  } catch (error) {
    alert(t('management.update.errorMessage'));
  } finally {
    isSaving.value = false;
  }
};

onMounted(async () => {
  await store.fetchEmployees();
});
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center gap-3 mb-5">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="selectedEmployee ? backToList() : goBack()" />
      <i class="pi pi-sync text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">  {{ t('management.update.title') }}</h1>
    </div>

    <div v-if="!selectedEmployee" class="surface-card shadow-1 border-round-2xl p-5 w-full">
      <div class="grid formgrid p-fluid mb-4">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">{{ t('management.update.area') }}</label>
            <pv-select
              v-model="filters.area"
              :options="areaOptions"
              :placeholder="t('management.update.selectArea')"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">  {{ t('management.update.position') }}</label>
            <pv-select
              v-model="filters.jobPosition"
              :options="jobPositionOptions"
              :placeholder="t('management.update.selectPosition')"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="text-900 font-bold text-base m-0">  {{ t('management.update.employeeList') }}</h2>
        <pv-button :label="t('management.update.clearFilters')" outlined severity="secondary" size="small" @click="clearFilters" />
      </div>

      <div class="border-1 surface-border border-round p-3">
        <div
          v-for="item in filteredEmployees"
          :key="item.id"
          class="border-1 surface-border border-round p-4 mb-3 flex align-items-center gap-4 cursor-pointer hover:surface-100"
          @click="selectEmployee(item)"
        >
          <div class="w-4rem h-4rem border-circle bg-primary flex justify-content-center align-items-center">
            <i class="pi pi-user text-white text-3xl"></i>
          </div>

          <div>
            <h3 class="m-0 text-900 text-lg">{{ item.name }}</h3>
            <p class="m-0 mt-1 text-600">{{ item.area }} · {{ item.jobPosition }}</p>
            <small class="text-500">{{ item.code }}</small>
          </div>
        </div>

        <p v-if="filteredEmployees.length === 0" class="text-center text-500">
          {{ t('management.update.empty') }}
        </p>
      </div>
    </div>

    <div v-else class="grid">
      <div class="col-12 lg:col-10">
        <div class="surface-card shadow-1 border-round-2xl p-5 w-full">
          <h2 class="text-500 font-medium text-xl mb-4">{{ t('management.update.personalData') }}</h2>

          <div class="grid formgrid p-fluid">
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.fullName') }}</label>
                <pv-input-text v-model="employee.name" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.dni') }}</label>
                <pv-input-text v-model="employee.documentNumber" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.personalEmail') }}</label>
                <pv-input-text v-model="employee.personalEmail" type="email" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.address') }}</label>
                <pv-input-text v-model="employee.address" class="w-full" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.civilStatus') }}</label>
                <pv-select
                  v-model="employee.civilStatus"
                  :options="civilStatusOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('management.update.selectCivilStatus')"
                  class="w-full"
                />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.age') }}</label>
                <pv-input-text v-model="employee.age" type="number" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.phoneNumber') }}</label>
                <pv-input-text v-model="employee.phoneNumber" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.gender') }}</label>
                <pv-select
                  v-model="employee.gender"
                  :options="genderOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('management.update.selectGender')"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <h2 class="text-500 font-medium text-xl mt-5 mb-4">{{ t('management.update.workData') }}</h2>

          <div class="grid formgrid p-fluid">
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.workEmail') }}</label>
                <pv-input-text v-model="employee.workEmail" type="email" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.contractType') }}</label>
                <pv-select
                  v-model="employee.contractType"
                  :options="contractTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('management.update.selectContractType')"
                  class="w-full"
                />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.jobPosition') }}</label>
                <pv-input-text v-model="employee.jobPosition" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.educationLevel') }}</label>
                <pv-input-text v-model="employee.educationLevel" class="w-full" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.hireDate') }}</label>
                <input type="date" class="p-inputtext p-component w-full" v-model="employee.hireDate" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.assignedArea') }}</label>
                <pv-input-text v-model="employee.area" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">{{ t('management.update.status') }}</label>
                <pv-select
                  v-model="employee.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  :placeholder="t('management.update.selectStatus')"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-content-end gap-3 mt-5 pt-4 border-top-1 surface-border">
            <pv-button :label="t('management.update.backToList')" outlined severity="secondary" @click="backToList" />
            <pv-button
              :label="t('management.update.saveChanges')"
              icon="pi pi-save"
              :loading="isSaving"
              @click="saveChanges"
              class="bg-primary border-none"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>