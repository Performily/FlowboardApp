<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';

const router = useRouter();
const store = useManagementStore();

const selectedEmployee = ref(null);
const isSaving = ref(false);
const errorMessage = ref('');

const filters = reactive({
  area: '',
  jobPosition: ''
});

const terminationForm = reactive({
  terminationReason: '',
  terminationObservation: '',
  terminationDocuments: ''
});

const formErrors = reactive({
  terminationReason: false,
  terminationObservation: false,
  terminationDocuments: false
});

const getEmployeePosition = (employee) => {
  return employee.jobPosition || employee.position || '';
};

const activeEmployees = computed(() => {
  return store.employees.filter(employee => {
    return employee.status !== 'Cesado' && employee.status !== 'TERMINATED';
  });
});

const areaOptions = computed(() => {
  return [...new Set(activeEmployees.value.map(employee => employee.area).filter(Boolean))];
});

const jobPositionOptions = computed(() => {
  return [
    ...new Set(
      activeEmployees.value
        .map(employee => getEmployeePosition(employee))
        .filter(Boolean)
    )
  ];
});

const filteredEmployees = computed(() => {
  return activeEmployees.value.filter(employee => {
    const matchesArea = !filters.area || employee.area === filters.area;
    const matchesPosition = !filters.jobPosition || getEmployeePosition(employee) === filters.jobPosition;

    return matchesArea && matchesPosition;
  });
});

const selectEmployee = (employee) => {
  selectedEmployee.value = employee;

  terminationForm.terminationReason = '';
  terminationForm.terminationObservation = '';
  terminationForm.terminationDocuments = '';

  clearErrors();
};

const clearFilters = () => {
  filters.area = '';
  filters.jobPosition = '';
};

const clearErrors = () => {
  errorMessage.value = '';
  formErrors.terminationReason = false;
  formErrors.terminationObservation = false;
  formErrors.terminationDocuments = false;
};

const validateForm = () => {
  clearErrors();

  let isValid = true;

  if (!terminationForm.terminationReason.trim()) {
    formErrors.terminationReason = true;
    isValid = false;
  }

  if (!terminationForm.terminationObservation.trim()) {
    formErrors.terminationObservation = true;
    isValid = false;
  }

  if (!terminationForm.terminationDocuments.trim()) {
    formErrors.terminationDocuments = true;
    isValid = false;
  }

  if (!isValid) {
    errorMessage.value = 'Complete los campos obligatorios';
  }

  return isValid;
};

const backToList = () => {
  selectedEmployee.value = null;
  clearErrors();
};

const goBackToManagement = () => {
  router.push({ name: 'management' });
};

const saveTermination = async () => {
  if (!validateForm()) return;

  isSaving.value = true;

  try {
    await store.terminateEmployee(selectedEmployee.value.id, {
      terminationReason: terminationForm.terminationReason,
      terminationObservation: terminationForm.terminationObservation,
      terminationDocuments: terminationForm.terminationDocuments
    });

    alert('Colaborador dado de baja correctamente');

    selectedEmployee.value = null;

    await store.fetchEmployees();

    router.push({ name: 'management' });
  } catch (error) {
    errorMessage.value = error.message || 'Ocurrió un error al dar de baja al colaborador';
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
      <pv-button
        icon="pi pi-arrow-left"
        rounded
        text
        severity="secondary"
        @click="goBackToManagement"
      />

      <i class="pi pi-user-minus text-primary text-2xl"></i>

      <h1 class="m-0 text-primary font-bold text-2xl">
        Dar de baja
      </h1>
    </div>

    <pv-message
      v-if="errorMessage"
      severity="error"
      class="mb-4"
      :closable="false"
    >
      {{ errorMessage }}
    </pv-message>

    
    <div
      v-if="!selectedEmployee"
      class="surface-card shadow-1 border-round-2xl p-5"
    >
      <div class="grid formgrid p-fluid mb-4">
        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">
              Área
            </label>

            <pv-select
              v-model="filters.area"
              :options="areaOptions"
              placeholder="Selecciona opción"
              class="w-full"
            />
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="field">
            <label class="font-medium text-700 block mb-2">
              Posición
            </label>

            <pv-select
              v-model="filters.jobPosition"
              :options="jobPositionOptions"
              placeholder="Selecciona opción"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-content-between align-items-center mb-3">
        <h2 class="text-900 font-bold text-base m-0">
          Listado de colaboradores
        </h2>

        <pv-button
          label="Limpiar filtros"
          outlined
          severity="secondary"
          size="small"
          @click="clearFilters"
        />
      </div>

      <div class="border-1 surface-border border-round p-3">
        <div
          v-for="employee in filteredEmployees"
          :key="employee.id"
          class="employee-item"
          @click="selectEmployee(employee)"
        >
          <div class="w-4rem h-4rem border-circle bg-primary flex justify-content-center align-items-center">
            <i class="pi pi-user text-white text-3xl"></i>
          </div>

          <div class="flex-1">
            <h3 class="m-0 text-900 text-lg">
              {{ employee.name }}
            </h3>

            <p class="m-0 mt-1 text-600">
              {{ employee.area }} · {{ getEmployeePosition(employee) }}
            </p>

            <small class="text-500">
              {{ employee.code }}
            </small>
          </div>

          <i class="pi pi-chevron-right text-500"></i>
        </div>

        <p
          v-if="filteredEmployees.length === 0"
          class="text-center text-500"
        >
          No se encontraron colaboradores activos.
        </p>
      </div>
    </div>

    
    <div
      v-else
      class="grid"
    >
      <div class="col-12 md:col-4 lg:col-3">
        <div class="surface-card shadow-1 border-round-2xl p-5 text-center">
          <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mx-auto mb-4">
            <i
              class="pi pi-user text-white"
              style="font-size: 5rem;"
            ></i>
          </div>

          <h2 class="text-900 font-bold text-xl m-0">
            {{ selectedEmployee.name }}
          </h2>

          <p class="text-600 mt-1 mb-4">
            {{ getEmployeePosition(selectedEmployee) }}
          </p>

          <div class="text-left employee-data">
            <p>
              <strong>Estado:</strong>
              <span>{{ selectedEmployee.status || 'Activo' }}</span>
            </p>

            <p>
              <strong>Email Personal:</strong>
              <span>{{ selectedEmployee.personalEmail || 'No registrado' }}</span>
            </p>

            <p>
              <strong>Número de teléfono:</strong>
              <span>{{ selectedEmployee.phoneNumber || 'No registrado' }}</span>
            </p>

            <p>
              <strong>DNI:</strong>
              <span>{{ selectedEmployee.documentNumber || selectedEmployee.dni || 'No registrado' }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-8 lg:col-7">
        <div class="surface-card shadow-1 border-round-2xl p-5">
          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">
              Motivo de baja*
            </label>

            <pv-input-text
              v-model="terminationForm.terminationReason"
              placeholder="Completa los campos obligatorios"
              class="w-full"
              :class="{ 'p-invalid': formErrors.terminationReason }"
            />

            <small
              v-if="formErrors.terminationReason"
              class="p-error"
            >
              Complete los campos obligatorios
            </small>
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">
              Observaciones*
            </label>

            <textarea
              v-model="terminationForm.terminationObservation"
              rows="3"
              placeholder="Completa los campos obligatorios"
              class="p-inputtext p-component w-full"
              :class="{ 'p-invalid': formErrors.terminationObservation }"
            ></textarea>

            <small
              v-if="formErrors.terminationObservation"
              class="p-error"
            >
              Complete los campos obligatorios
            </small>
          </div>

          <div class="field mb-5">
            <label class="font-medium text-700 block mb-2">
              Documentación presentada*
            </label>

            <textarea
              v-model="terminationForm.terminationDocuments"
              rows="3"
              placeholder="Completa los campos obligatorios"
              class="p-inputtext p-component w-full"
              :class="{ 'p-invalid': formErrors.terminationDocuments }"
            ></textarea>

            <small
              v-if="formErrors.terminationDocuments"
              class="p-error"
            >
              Complete los campos obligatorios
            </small>
          </div>

          <div class="flex justify-content-end gap-3">
            <pv-button
              label="Volver"
              outlined
              severity="secondary"
              @click="backToList"
            />

            <pv-button
              label="Guardar"
              icon="pi pi-save"
              :loading="isSaving"
              @click="saveTermination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-item {
  min-height: 88px;
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  cursor: pointer;
  background: white;
  transition: 0.2s ease;
}

.employee-item:hover {
  background: var(--surface-100);
  border-color: var(--primary-color);
}

.employee-data p {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0 0 1rem;
  font-size: 0.9rem;
}

.employee-data strong {
  color: var(--text-color);
}

.employee-data span {
  color: var(--text-color-secondary);
  overflow-wrap: anywhere;
}

.p-error {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: #ef4444;
}
</style>