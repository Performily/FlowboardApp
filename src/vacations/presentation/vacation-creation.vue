<template>
  <div class="p-4 bg-gray-50">
    
    <div class="flex align-items-center gap-3 mb-4">
      <i class="pi pi-arrow-left text-xl cursor-pointer text-500 hover:text-700 transition-colors" @click="cancel"></i>
      <div class="flex align-items-center gap-2 text-primary">
        <i class="pi pi-calendar-plus text-4xl"></i>
        <h1 class="m-0 text-3xl font-bold">Asignar vacaciones</h1>
      </div>
    </div>

    <div class="surface-card p-5 border-round border-1 border-300 shadow-1 w-full max-w-4xl">
      <div class="formgrid grid">
        <div class="field col-12 md:col-6 flex flex-column gap-2">
          <label for="colaborador" class="font-medium text-700">Colaborador</label>
          <pv-select id="colaborador" v-model="form.employee" :options="store.employeesList" optionLabel="name" placeholder="Seleccionar colaborador" class="w-full" @change="onEmployeeSelect" />
        </div>
        <div class="field col-12 md:col-6 flex flex-column gap-2">
          <label for="area" class="font-medium text-700">Área</label>
          <pv-select id="area" v-model="form.area" :options="areaOptions" placeholder="Seleccionar área" class="w-full" />
        </div>

        <div class="field col-12 md:col-5 flex flex-column gap-2">
          <label for="fecha-inicio" class="font-medium text-700">Fecha inicio</label>
          <pv-date-picker id="fecha-inicio" v-model="form.startDate" placeholder="dd/mm/aaaa" showIcon class="w-full" />
        </div>
        <div class="field col-12 md:col-5 flex flex-column gap-2">
          <label for="fecha-fin" class="font-medium text-700">Fecha fin</label>
          <pv-date-picker id="fecha-fin" v-model="form.endDate" placeholder="dd/mm/aaaa" showIcon class="w-full" />
        </div>
        <div class="field col-12 md:col-2 flex flex-column gap-2">
          <label for="dias" class="font-medium text-700">Días</label>
          <pv-input-text id="dias" :value="calculatedDays" readonly placeholder="xx" class="w-full bg-gray-100 text-center" />
        </div>

        <div class="field col-12 flex flex-column gap-2 mt-2">
          <label for="observacion" class="font-medium text-700">Observación (Opcional)</label>
          <pv-textarea id="observacion" v-model="form.observation" rows="4" placeholder="Escribe una observación (opcional)" class="w-full" />
        </div>
      </div>

      <div class="flex gap-3 mt-4 w-full md:w-6">
        <pv-button label="Guardar asignación" icon="pi pi-check" class="flex-1 bg-indigo-600 border-indigo-600" :loading="isSaving" @click="save" />
        <pv-button label="Cancelar" outlined severity="secondary" class="flex-1" @click="cancel" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVacationsStore } from '../application/vacations.store.js';

const store = useVacationsStore();
const router = useRouter();

const form = ref({ employee: null, area: null, startDate: null, endDate: null, observation: '' });
const isSaving = ref(false); // Para mostrar spinner en el botón mientras guarda

onMounted(() => {
  if (store.employeesList.length === 0) store.fetchDashboardData();
});

const areaOptions = computed(() => {
  return [...new Set(store.employeesList.map(emp => emp.area).filter(Boolean))];
});

const onEmployeeSelect = () => {
  if (form.value.employee?.area) form.value.area = form.value.employee.area;
};

const calculatedDays = computed(() => {
  if (form.value.startDate && form.value.endDate) {
    const start = new Date(form.value.startDate);
    const end = new Date(form.value.endDate);
    if (end >= start) {
      return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
    }
  }
  return 0;
});

// Lógica real de guardado
const save = async () => {
  if (!form.value.employee || !form.value.startDate || !form.value.endDate) {
    alert("Por favor completa los campos obligatorios.");
    return;
  }

  isSaving.value = true;
  
  // Armamos el objeto como lo espera tu Fake API
  const newRequest = {
    employeeId: form.value.employee.id,
    type: "Vacaciones",
    title: `Vacaciones asignadas a ${form.value.employee.name}`,
    startDate: form.value.startDate.toISOString(),
    endDate: form.value.endDate.toISOString(),
    status: "Aprobado", // Asumimos que si lo asigna el admin, se aprueba de una
    collaboratorComments: form.value.observation,
    otherDetails: `Días: ${calculatedDays.value}`,
    rejectionReason: null
  };

  try {
    await store.createVacationRequest(newRequest);
    // Vuelve a la tabla de vacaciones tras guardar exitosamente
    router.push('/vacations'); 
  } catch (error) {
    alert("Hubo un error al guardar");
  } finally {
    isSaving.value = false;
  }
};

const cancel = () => {
  // Te devuelve al dashboard o de donde hayas venido
  router.back(); 
};
</script>