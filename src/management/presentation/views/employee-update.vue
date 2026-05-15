<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';

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
  { label: 'Soltero', value: 'SINGLE' },
  { label: 'Casado', value: 'MARRIED' },
  { label: 'Divorciado', value: 'DIVORCED' },
  { label: 'Viudo', value: 'WIDOWED' }
];

const genderOptions = [
  { label: 'Masculino', value: 'MALE' },
  { label: 'Femenino', value: 'FEMALE' },
  { label: 'Otro', value: 'OTHER' }
];

const contractTypeOptions = [
  { label: 'Tiempo completo', value: 'FULL_TIME' },
  { label: 'Medio tiempo', value: 'PART_TIME' },
  { label: 'Por horas', value: 'HOURLY' },
  { label: 'Prácticas', value: 'INTERNSHIP' }
];

const statusOptions = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Inactivo', value: 'INACTIVE' },
  { label: 'Cesado', value: 'TERMINATED' }
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
    alert('Por favor, completa al menos el Nombre, Número de documento y Área asignada.');
    return;
  }

  isSaving.value = true;

  try {
    // El Store llamará al Assembler.toApi para transformar estos datos antes de enviarlos
    await store.updateEmployee(employee.value.id, employee.value);
    alert('¡Información del colaborador actualizada con éxito!');
    selectedEmployee.value = null;
    await store.fetchEmployees(); // Refrescamos la lista de entidades
  } catch (error) {
    alert('Ocurrió un error al actualizar. Revisa que json-server esté encendido.');
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
      <h1 class="m-0 text-primary font-bold text-3xl">Actualizar información</h1>
    </div>

    <div v-if="!selectedEmployee" class="surface-card shadow-1 border-round-2xl p-5 w-full">
      <div class="grid formgrid p-fluid mb-4">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">Área</label>
            <pv-select
              v-model="filters.area"
              :options="areaOptions"
              placeholder="Selecciona área"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">Posición</label>
            <pv-select
              v-model="filters.jobPosition"
              :options="jobPositionOptions"
              placeholder="Selecciona posición"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="text-900 font-bold text-base m-0">Listado de colaboradores</h2>
        <pv-button label="Limpiar filtros" outlined severity="secondary" size="small" @click="clearFilters" />
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
          No se encontraron colaboradores.
        </p>
      </div>
    </div>

    <div v-else class="grid">
      <div class="col-12 lg:col-10">
        <div class="surface-card shadow-1 border-round-2xl p-5 w-full">
          <h2 class="text-500 font-medium text-xl mb-4">Datos Personales</h2>

          <div class="grid formgrid p-fluid">
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Nombre Completo*</label>
                <pv-input-text v-model="employee.name" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">D.N.I*</label>
                <pv-input-text v-model="employee.documentNumber" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Correo Personal*</label>
                <pv-input-text v-model="employee.personalEmail" type="email" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Domicilio*</label>
                <pv-input-text v-model="employee.address" class="w-full" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Estado Civil*</label>
                <pv-select
                  v-model="employee.civilStatus"
                  :options="civilStatusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione el estado civil"
                  class="w-full"
                />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Edad*</label>
                <pv-input-text v-model="employee.age" type="number" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Número de Teléfono*</label>
                <pv-input-text v-model="employee.phoneNumber" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Género*</label>
                <pv-select
                  v-model="employee.gender"
                  :options="genderOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione el género"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <h2 class="text-500 font-medium text-xl mt-5 mb-4">Datos Laborales</h2>

          <div class="grid formgrid p-fluid">
            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Email de Trabajo*</label>
                <pv-input-text v-model="employee.workEmail" type="email" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Tipo de Contrato*</label>
                <pv-select
                  v-model="employee.contractType"
                  :options="contractTypeOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione el tipo"
                  class="w-full"
                />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Puesto Laboral*</label>
                <pv-input-text v-model="employee.jobPosition" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Grado de Instrucción*</label>
                <pv-input-text v-model="employee.educationLevel" class="w-full" />
              </div>
            </div>

            <div class="col-12 md:col-6">
              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Fecha de Ingreso*</label>
                <input type="date" class="p-inputtext p-component w-full" v-model="employee.hireDate" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Área Asignada*</label>
                <pv-input-text v-model="employee.area" class="w-full" />
              </div>

              <div class="field mb-4">
                <label class="font-medium text-700 block mb-2">Estado*</label>
                <pv-select
                  v-model="employee.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione estado"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-content-end gap-3 mt-5 pt-4 border-top-1 surface-border">
            <pv-button label="Volver al listado" outlined severity="secondary" @click="backToList" />
            <pv-button
              label="Guardar cambios"
              icon="pi pi-save"
              :loading="isSaving"
              @click="saveChanges"
              class="bg-primary border-none"
            />
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-2 flex flex-column align-items-center gap-3 pt-4">
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center">
          <i class="pi pi-user text-white" style="font-size: 5rem;"></i>
        </div>
        <pv-button label="Adjuntar foto" icon="pi pi-paperclip" size="small" class="bg-primary border-none" />
      </div>
    </div>
  </div>
</template>