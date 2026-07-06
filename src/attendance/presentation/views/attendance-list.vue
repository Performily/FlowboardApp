<script setup>
import { ref, onMounted, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import useAttendanceStore from '../../application/attendance.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const store = useAttendanceStore();
const iamStore = useIamStore();

const currentUser = computed(() => iamStore.currentUser);
const isHR = computed(() => currentUser.value?.role === 'RRHH');

const { attendances, attendancesLoaded, loading, errors } = toRefs(store);
const { fetchAttendances } = store;

const selectedArea = ref(null);
const selectedStatus = ref(null);
const startDate = ref(null);
const endDate = ref(null);

const areas = ref(['IT', 'Recursos Humanos', 'Ventas', 'Marketing', 'Operaciones']);

const statuses = ref([
  { label: 'Asistencia normal', value: 'Asistencia' },
  { label: 'Tardanza', value: 'Tardanza' },
  { label: 'Falta', value: 'Falta' }
]);

// Lógica de tabla
const displayedAttendances = computed(() => {
  let list = isHR.value 
    ? [...attendances.value] 
    : attendances.value.filter(a => String(a.employeeId) === String(currentUser.value?.id || 1));

  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  return list;
});

// Cálculos de tarjetas
const displayCount = computed(() => displayedAttendances.value.length);
const displayLates = computed(() => displayedAttendances.value.filter(a => a.status === 'Tardanza').length);
const displayAbsences = computed(() => displayedAttendances.value.filter(a => a.status === 'Falta').length);

// Promedio Semanal
const displayAverageHours = computed(() => {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);

  const weekAttendances = attendances.value.filter(a => {
    const recordDate = new Date(a.date);
    return recordDate >= monday && recordDate <= now;
  });

  if (weekAttendances.length === 0) return 0;
  const total = weekAttendances.reduce((acc, a) => acc + (Number(a.workedHours) || 0), 0);
  return (total / weekAttendances.length).toFixed(1);
});

// Rangos de fecha para mostrar en tarjetas
const currentWeekRange = computed(() => {
  const now = new Date();
  const day = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `${monday.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'})} - ${sunday.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'})}`;
});

const tableRange = computed(() => {
  if (!startDate.value || !endDate.value) return "Histórico total";
  const start = new Date(startDate.value).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'});
  const end = new Date(endDate.value).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'});
  return `${start} a ${end}`;
});

onMounted(() => {
  if (!attendancesLoaded.value) fetchAttendances();
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
  if (normalized === 'asistencia') return 'success';
  if (normalized === 'tardanza') return 'warning';
  if (normalized === 'falta') return 'danger';
  return 'secondary'; 
};

const getStatusLabel = (status) => status || 'Pendiente';
const goBack = () => router.push({ name: 'attendance' });
</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-3 mb-4">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="goBack" />
      <h1 class="m-0 text-3xl font-bold text-primary">{{ isHR ? t('attendance.list.title') : 'Mis Asistencias' }}</h1>
    </div>

    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-primary shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-1">{{ t('attendance.list.totalRecords') }}</span>
                <div class="text-900 font-bold text-2xl mb-1">{{ displayCount }}</div>
                <small class="text-500">{{ tableRange }}</small>
              </div>
              <div class="bg-primary-100 border-round p-2"><i class="pi pi-users text-primary text-xl"></i></div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-green-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-1">Promedio Semanal</span>
                <div class="text-900 font-bold text-2xl mb-1">{{ displayAverageHours }} h</div>
                <small class="text-500">{{ currentWeekRange }}</small>
              </div>
              <div class="bg-green-100 border-round p-2"><i class="pi pi-chart-line text-green-500 text-xl"></i></div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-orange-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-1">{{ t('attendance.list.lates') }}</span>
                <div class="text-900 font-bold text-2xl mb-1">{{ displayLates }}</div>
                <small class="text-500">{{ tableRange }}</small>
              </div>
              <div class="bg-orange-100 border-round p-2"><i class="pi pi-exclamation-circle text-orange-500 text-xl"></i></div>
            </div>
          </template>
        </pv-card>
      </div>
      <div class="col-12 md:col-3">
        <pv-card class="border-left-3 border-red-500 shadow-2 h-full">
          <template #content>
            <div class="flex justify-content-between align-items-center">
              <div>
                <span class="block text-500 font-medium mb-1">{{ t('attendance.list.absences') }}</span>
                <div class="text-900 font-bold text-2xl mb-1">{{ displayAbsences }}</div>
                <small class="text-500">{{ tableRange }}</small>
              </div>
              <div class="bg-red-100 border-round p-2"><i class="pi pi-times-circle text-red-500 text-xl"></i></div>
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <pv-card class="mb-4">
      <template #content>
        <div class="formgrid grid align-items-end gap-2">
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.list.from') }}</label>
            <pv-date-picker v-model="startDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.list.to') }}</label>
            <pv-date-picker v-model="endDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>
          <div v-if="isHR" class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.list.area') }}</label>
            <pv-select v-model="selectedArea" :options="areas" :placeholder="t('attendance.list.allAreas')" class="w-full" />
          </div>
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.list.status') }}</label>
            <pv-select v-model="selectedStatus" :options="statuses" optionLabel="label" :placeholder="t('attendance.list.anyStatus')" class="w-full" />
          </div>
          <div class="field col-12 md:col-2 flex gap-2">
            <pv-button :label="t('attendance.list.filter')" icon="pi pi-search" @click="applyFilters" class="w-full" />
            <pv-button :label="t('attendance.list.clear')" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" class="w-full" />
          </div>
        </div>
      </template>
    </pv-card>

    <pv-card>
      <template #title>{{ isHR ? t('attendance.list.dailyRecord') : 'Mi Registro' }}</template>
      <template #content>
        <pv-data-table :value="displayedAttendances" :loading="loading" striped-rows paginator :rows="10" responsiveLayout="scroll">
          <pv-column field="date" :header="t('attendance.list.date')" sortable></pv-column>
          <pv-column v-if="isHR" field="employeeName" :header="t('attendance.list.employee')"></pv-column>
          <pv-column :header="t('attendance.list.checkIn')"><template #body="slotProps">{{ slotProps.data.checkIn || '-' }}</template></pv-column>
          <pv-column :header="t('attendance.list.checkOut')"><template #body="slotProps">{{ slotProps.data.checkOut || '-' }}</template></pv-column>
          <pv-column :header="t('attendance.list.hours')"><template #body="slotProps">{{ slotProps.data.workedHours > 0 ? slotProps.data.workedHours + 'h' : '-' }}</template></pv-column>
          <pv-column field="status" :header="t('attendance.list.status')">
            <template #body="slotProps">
              <pv-tag 
                :value="getStatusLabel(slotProps.data.status)" 
                :severity="getStatusSeverity(slotProps.data.status)"
                :style="slotProps.data.status?.toLowerCase() === 'tardanza' ? 'background: #fff7ed !important; color: #9a3412 !important; border: 1px solid #fed7aa !important;' : ''"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>