<script setup>
import { ref, computed, onMounted } from 'vue';
import useAttendanceStore from '../../application/attendance.store.js';

const store = useAttendanceStore();

// Variables para los filtros
const searchQuery = ref(''); // Input de texto manual
const startDate = ref(null);
const endDate = ref(null);
const selectedStatus = ref(null);

const statuses = ref([
  { label: 'Asistencia normal', value: 'attendance' },
  { label: 'Tardanza', value: 'late' },
  { label: 'Falta', value: 'absence' }
]);

onMounted(() => {
  if (!store.attendancesLoaded) {
    store.fetchAttendances();
  }
});

// Filtramos la data en el backend/store
const applyFilters = () => {
  const filters = {};
  
  // Enviamos lo que el usuario escribió (nombre o ID)
  if (searchQuery.value) filters.q = searchQuery.value; 
  if (startDate.value) filters.startDate = startDate.value;
  if (endDate.value) filters.endDate = endDate.value;
  if (selectedStatus.value) filters.status = selectedStatus.value.value;

  store.fetchAttendances(filters);
};

const clearFilters = () => {
  searchQuery.value = '';
  startDate.value = null;
  endDate.value = null;
  selectedStatus.value = null;
  
  store.fetchAttendances();
};

// Como ya no es un "ID" estricto, calculamos el resumen sobre la data filtrada que hay en el store.
// Si el usuario buscó "Juan", attendances ya tendrá solo las de Juan.
const summary = computed(() => {
  if (!store.attendancesLoaded || store.attendances.length === 0) return null;
  
  return {
    attendance: store.attendances.filter(a => a.status === 'attendance').length,
    late: store.attendances.filter(a => a.status === 'late').length,
    absence: store.attendances.filter(a => a.status === 'absence').length,
    totalHours: store.attendances.reduce((sum, a) => sum + (a.workedHours || 0), 0)
  };
});

// Utilidades para la tabla
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
</script>

<template>
  <div class="p-4">
    <!-- Título -->
    <div class="flex align-items-center gap-3 mb-4">
      <i class="pi pi-id-card text-3xl text-primary"></i>
      <h1 class="m-0 text-3xl font-bold text-primary">Resumen por Colaborador</h1>
    </div>

    <!-- Panel de Filtros -->
    <pv-card class="mb-4 border-top-3 border-primary shadow-2">
      <template #content>
        <div class="formgrid grid align-items-end gap-2">
          
          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">Colaborador</label>
            <!-- Input de texto manual -->
            <pv-input-text 
              v-model="searchQuery" 
              placeholder="Escribe el nombre o ID..." 
              class="w-full" 
              @keyup.enter="applyFilters"
            />
          </div>

          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">Desde</label>
            <pv-date-picker v-model="startDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>
          
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">Hasta</label>
            <pv-date-picker v-model="endDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>

          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">Estado</label>
            <pv-select v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Todos" class="w-full" />
          </div>

          <div class="field col-12 md:col-2 flex gap-2">
            <pv-button icon="pi pi-search" label="Filtrar" @click="applyFilters" class="w-full" />
            <pv-button icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" class="w-full" />
          </div>

        </div>
      </template>
    </pv-card>

    <!-- Errores -->
    <div v-if="store.errors.length" class="text-red-500 mb-3">
      <strong>Error al cargar datos:</strong> {{ store.errors.map(e => e.message).join(', ') }}
    </div>

    <!-- Si hay resultados en la búsqueda, mostramos la data -->
    <div v-if="store.attendances.length > 0 && searchQuery">
      
      <!-- Panel de KPIs -->
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <pv-card class="shadow-2 h-full bg-primary text-white">
            <template #content>
              <span class="block font-medium mb-2">Asistencias Regulares</span>
              <div class="font-bold text-4xl">{{ summary?.attendance || 0 }}</div>
            </template>
          </pv-card>
        </div>
        <div class="col-12 md:col-3">
          <pv-card class="shadow-2 h-full bg-orange-500 text-white">
            <template #content>
              <span class="block font-medium mb-2">Total Tardanzas</span>
              <div class="font-bold text-4xl">{{ summary?.late || 0 }}</div>
            </template>
          </pv-card>
        </div>
        <div class="col-12 md:col-3">
          <pv-card class="shadow-2 h-full bg-red-500 text-white">
            <template #content>
              <span class="block font-medium mb-2">Total Faltas</span>
              <div class="font-bold text-4xl">{{ summary?.absence || 0 }}</div>
            </template>
          </pv-card>
        </div>
        <div class="col-12 md:col-3">
          <pv-card class="shadow-2 h-full bg-green-500 text-white">
            <template #content>
              <span class="block font-medium mb-2">Horas Acumuladas</span>
              <div class="font-bold text-4xl">{{ summary?.totalHours || 0 }}h</div>
            </template>
          </pv-card>
        </div>
      </div>

      <!-- Tabla Histórica (Usamos la data directa del store) -->
      <pv-card>
        <template #title>Historial de Registros</template>
        <template #content>
          <pv-data-table 
            :value="store.attendances" 
            :loading="store.loading"
            striped-rows 
            paginator 
            :rows="5"
            :rows-per-page-options="[5, 10, 20]"
          >
            <pv-column field="date" header="Fecha" sortable></pv-column>
            
            <pv-column field="employeeName" header="Colaborador">
              <template #body="slotProps">
                <span class="font-semibold">{{ slotProps.data.employeeName }}</span>
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

          </pv-data-table>
        </template>
      </pv-card>
    </div>

    <!-- Estado vacío (Cuando no ha buscado a nadie) -->
    <div v-else-if="!searchQuery" class="flex flex-column align-items-center justify-content-center p-6 surface-100 border-round mt-4 border-dashed border-2 surface-border">
      <div class="bg-white p-4 border-circle shadow-1 mb-4">
        <i class="pi pi-search text-500 text-5xl"></i>
      </div>
      <h2 class="text-700 m-0 mb-2">Busca un colaborador</h2>
      <p class="text-500 m-0 text-lg">Escribe un nombre y presiona Filtrar para ver sus métricas.</p>
    </div>

    <!-- Estado cuando buscó, pero no hay resultados -->
    <div v-else class="flex flex-column align-items-center justify-content-center p-6 surface-100 border-round mt-4">
      <i class="pi pi-inbox text-500 text-5xl mb-3"></i>
      <h3 class="text-600 m-0">No se encontraron registros para esta búsqueda.</h3>
    </div>

  </div>
</template>