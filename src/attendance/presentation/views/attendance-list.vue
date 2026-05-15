<script setup>
import { ref, onMounted, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import useAttendanceStore from '../../application/attendance.store.js';
const router = useRouter();

const store = useAttendanceStore();

const { 
  attendances, 
  attendancesLoaded, 
  loading, 
  errors, 
  attendancesCount, 
  totalWorkedHours, 
  totalLate, 
  totalAbsence 
} = toRefs(store);
const { fetchAttendances } = store;

const selectedArea = ref(null);
const selectedStatus = ref(null);
const startDate = ref(null);
const endDate = ref(null);

const areas = ref(['IT', 'Recursos Humanos', 'Ventas', 'Marketing', 'Operaciones']);
const statuses = ref([
  { label: 'Asistencia normal', value: 'attendance' },
  { label: 'Tardanza', value: 'late' },
  { label: 'Falta', value: 'absence' }
]);

onMounted(() => {
  if (!attendancesLoaded.value) {
    fetchAttendances();
  }
});

const applyFilters = () => {
  const filters = {};
  if (selectedArea.value) filters.area = selectedArea.value;
  if (selectedStatus.value) filters.status = selectedStatus.value.value;
  if (startDate.value) filters.startDate = startDate.value;
  if (endDate.value) filters.endDate = endDate.value;

  fetchAttendances(filters);
};

const clearFilters = () => {
  selectedArea.value = null;
  selectedStatus.value = null;
  startDate.value = null;
  endDate.value = null;
  
  fetchAttendances();
};

const getStatusSeverity = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'attendance') return 'success';
  if (normalized === 'late') return 'warning';
  if (normalized === 'absence') return 'danger';
  return 'secondary'; 
};

const getStatusLabel = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'attendance') return 'Asistió';
  if (normalized === 'late') return 'Tardanza';
  if (normalized === 'absence') return 'Falta';
  return status || 'Pendiente';
};

const goBack = () => {
  router.push({ name: 'attendance' }); 
};

</script>

<template>
  <div class="p-4">
    
    <div class="flex align-items-center gap-3 mb-4">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="goBack" />
      <i class="pi pi-calendar-times text-3xl text-primary"></i>
      <h1 class="m-0 text-3xl font-bold text-primary">Registro de asistencias</h1>
    </div>

    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-primary shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-2">Total Registros</span>
                <div class="text-900 font-bold text-2xl">{{ attendancesCount }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-users text-primary text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-green-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-2">Horas Trabajadas</span>
                <div class="text-900 font-bold text-2xl">{{ totalWorkedHours }} h</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-clock text-green-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-orange-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-2">Tardanzas</span>
                <div class="text-900 font-bold text-2xl">{{ totalLate }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-exclamation-circle text-orange-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-red-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-2">Faltas</span>
                <div class="text-900 font-bold text-2xl">{{ totalAbsence }}</div>
              </div>
              <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2.5rem;height:2.5rem">
                <i class="pi pi-times-circle text-red-500 text-xl"></i>
              </div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <pv-card class="mb-4">
      <template #content>
        <div class="formgrid grid align-items-end gap-2">
          
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">Desde</label>
            <pv-date-picker label="Desde" v-model="startDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>
          
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">Hasta</label>
            <pv-date-picker label="Hasta" v-model="endDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>

          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">Área</label>
            <pv-select v-model="selectedArea" :options="areas" placeholder="Todas las áreas" class="w-full" />
          </div>

          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">Estado</label>
            <pv-select v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Cualquier estado" class="w-full" />
          </div>
          
          <div class="field col-12 md:col-2 flex gap-2">
            <pv-button label="Filtrar" icon="pi pi-search" @click="applyFilters" class="w-full" />
            <pv-button label="Limpiar" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" class="w-full" />
          </div>

        </div>
      </template>
    </pv-card>

    <div v-if="errors.length" class="text-red-500 mb-3">
      <strong>Error al cargar datos:</strong> {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-card>
      <template #title>Registro Diario</template>
      <template #content>
        <pv-data-table 
          :value="attendances" 
          :loading="loading || (!attendancesLoaded && !errors.length)" 
          striped-rows 
          paginator 
          :rows="10" 
          :rows-per-page-options="[10, 20, 50]"
          responsiveLayout="scroll"
        >
          <pv-column field="date" header="Fecha" sortable></pv-column>
          
          <pv-column field="employeeName" header="Colaborador" sortable>
            <template #body="slotProps">
              <span class="font-semibold">{{ slotProps.data.employeeName }}</span>
              <div class="text-sm text-500">{{ slotProps.data.area }}</div>
            </template>
          </pv-column>

          <pv-column header="Entrada">
            <template #body="slotProps">
              <span v-if="slotProps.data.checkIn">{{ slotProps.data.checkIn }}</span>
              <span v-else class="text-500">-</span>
            </template>
          </pv-column>

          <pv-column header="Salida">
            <template #body="slotProps">
              <span v-if="slotProps.data.checkOut">{{ slotProps.data.checkOut }}</span>
              <span v-else class="text-500">-</span>
            </template>
          </pv-column>

          <pv-column header="Horas">
            <template #body="slotProps">
              <span v-if="slotProps.data.workedHours > 0">{{ slotProps.data.workedHours }}h</span>
              <span v-else class="text-500">-</span>
            </template>
          </pv-column>

          <pv-column header="Estado" sortable field="status">
            <template #body="slotProps">
              <pv-tag 
                :value="getStatusLabel(slotProps.data.status)" 
                :severity="getStatusSeverity(slotProps.data.status)" 
              />
            </template>
          </pv-column>

          <template #empty>
            <div class="text-center p-4 text-500">No se encontraron registros de asistencia.</div>
          </template>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

</style>