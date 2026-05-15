<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useAttendanceStore from '../../application/attendance.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const store = useAttendanceStore();

const searchQuery = ref(''); 
const startDate = ref(null);
const endDate = ref(null);
const selectedStatus = ref(null);

const appliedSearchQuery = ref(''); 

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

const applyFilters = () => {

  appliedSearchQuery.value = searchQuery.value.trim();
  
  const filters = {};
  if (searchQuery.value) filters.q = searchQuery.value; 
  if (startDate.value) filters.startDate = startDate.value;
  if (endDate.value) filters.endDate = endDate.value;
  if (selectedStatus.value) filters.status = selectedStatus.value.value;

  store.fetchAttendances(filters);
};

const clearFilters = () => {
  searchQuery.value = '';
  appliedSearchQuery.value = '';
  startDate.value = null;
  endDate.value = null;
  selectedStatus.value = null;
  
  store.fetchAttendances();
};


const displayedAttendances = computed(() => {
  if (!appliedSearchQuery.value) return []; 
  
  const queryLowerCase = appliedSearchQuery.value.toLowerCase();
  
  return store.attendances.filter(a => {
    const matchName = a.employeeName?.toLowerCase().includes(queryLowerCase);
    const matchId = a.employeeId?.toLowerCase().includes(queryLowerCase);
    return matchName || matchId;
  });
});


const summary = computed(() => {
  if (displayedAttendances.value.length === 0) return null;
  
  return {
    attendance: displayedAttendances.value.filter(a => a.status === 'attendance').length,
    late: displayedAttendances.value.filter(a => a.status === 'late').length,
    absence: displayedAttendances.value.filter(a => a.status === 'absence').length,
    totalHours: displayedAttendances.value.reduce((sum, a) => sum + (a.workedHours || 0), 0)
  };
});

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
      <i class="pi pi-id-card text-3xl text-primary"></i>
      <h1 class="m-0 text-3xl font-bold text-primary">{{ t('attendance.summary.title') }}</h1>
    </div>

   
    <pv-card class="mb-4 border-top-3 border-primary shadow-2">
      <template #content>
        <div class="formgrid grid align-items-end gap-2">
          
          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.summary.employee') }}</label>
            <!-- Input de texto manual -->
            <pv-input-text 
              v-model="searchQuery" 
              :placeholder="t('attendance.summary.employeePlaceholder')" 
              class="w-full" 
              @keyup.enter="applyFilters"
            />
          </div>

          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.summary.from') }}</label>
            <pv-date-picker v-model="startDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>
          
          <div class="field col-12 md:col-2">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.summary.to') }}</label>
            <pv-date-picker v-model="endDate" dateFormat="dd/mm/yy" showIcon class="w-full" />
          </div>

          <div class="field col-12 md:col-3">
            <label class="block mb-2 font-medium text-700">{{ t('attendance.summary.status') }}</label>
            <pv-select v-model="selectedStatus" :options="statuses" optionLabel="label" :placeholder="t('attendance.summary.all')" class="w-full" />
          </div>

          <div class="field col-12 md:col-2 flex gap-2">
            <pv-button icon="pi pi-search" :label="t('attendance.summary.filter')" @click="applyFilters" class="w-full" />
            <pv-button icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" class="w-full" />
          </div>

        </div>
      </template>
    </pv-card>

    <div v-if="store.errors.length" class="text-red-500 mb-3">
      <strong>{{ t('attendance.summary.errorLoading') }}</strong> {{ store.errors.map(e => e.message).join(', ') }}
    </div>

    <div v-if="appliedSearchQuery && displayedAttendances.length > 0">
   
      <div class="grid mb-4">
        <div class="col-12 md:col-3">
          <pv-card class="border-left-3 border-primary shadow-2 h-full">
            <template #content>
              <div class="flex justify-content-between align-items-center">
                <div>
                  <span class="block text-500 font-medium mb-2">{{ t('attendance.summary.regularAttendance') }}</span>
                  <div class="text-900 font-bold text-2xl">{{ summary?.attendance || 0 }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-primary-100 border-round" style="width:2.5rem;height:2.5rem">
                  <i class="pi pi-check-circle text-primary text-xl"></i>
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
                  <span class="block text-500 font-medium mb-2">{{ t('attendance.summary.totalLates') }}</span>
                  <div class="text-900 font-bold text-2xl">{{ summary?.late || 0 }}</div>
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
                  <span class="block text-500 font-medium mb-2">{{ t('attendance.summary.totalAbsences') }}</span>
                  <div class="text-900 font-bold text-2xl">{{ summary?.absence || 0 }}</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width:2.5rem;height:2.5rem">
                  <i class="pi pi-times-circle text-red-500 text-xl"></i>
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
                  <span class="block text-500 font-medium mb-2">{{ t('attendance.summary.accumulatedHours') }}</span>
                  <div class="text-900 font-bold text-2xl">{{ summary?.totalHours || 0 }}h</div>
                </div>
                <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width:2.5rem;height:2.5rem">
                  <i class="pi pi-clock text-green-500 text-xl"></i>
                </div>
              </div>
            </template>
          </pv-card>
        </div>
      </div>

    
      <pv-card>
        <template #title>{{ t('attendance.summary.recordHistory') }}</template>
        <template #content>
          <pv-data-table 
            :value="displayedAttendances" 
            :loading="store.loading"
            striped-rows 
            paginator 
            :rows="5"
            :rows-per-page-options="[5, 10, 20]"
          >
            <pv-column field="date" :header="t('attendance.summary.date')" sortable></pv-column>
            
            <pv-column field="employeeName" :header="t('attendance.summary.employee')">
              <template #body="slotProps">
                <span class="font-semibold">{{ slotProps.data.employeeName }}</span>
              </template>
            </pv-column>

            <pv-column :header="t('attendance.summary.checkIn')">
              <template #body="slotProps">
                <span v-if="slotProps.data.checkIn">{{ slotProps.data.checkIn }}</span>
                <span v-else class="text-500">-</span>
              </template>
            </pv-column>
            
            <pv-column :header="t('attendance.summary.checkOut')">
              <template #body="slotProps">
                <span v-if="slotProps.data.checkOut">{{ slotProps.data.checkOut }}</span>
                <span v-else class="text-500">-</span>
              </template>
            </pv-column>
            
            <pv-column :header="t('attendance.summary.hours')">
               <template #body="slotProps">
                 <span v-if="slotProps.data.workedHours > 0">{{ slotProps.data.workedHours }}h</span>
                 <span v-else class="text-500">-</span>
               </template>
            </pv-column>
            
            <pv-column :header="t('attendance.summary.status')" sortable field="status">
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

    <div v-else-if="!appliedSearchQuery" class="flex flex-column align-items-center justify-content-center p-6 surface-100 border-round mt-4 border-dashed border-2 surface-border">
      <div class="bg-white p-4 border-circle shadow-1 mb-4">
        <i class="pi pi-search text-500 text-5xl"></i>
      </div>
      <h2 class="text-700 m-0 mb-2">{{ t('attendance.summary.searchEmployee') }}</h2>
      <p class="text-500 m-0 text-lg">{{ t('attendance.summary.searchEmployeeDescription') }}</p>
    </div>

    <div v-else class="flex flex-column align-items-center justify-content-center p-6 surface-100 border-round mt-4">
      <i class="pi pi-inbox text-500 text-5xl mb-3"></i>
      <h3 class="text-600 m-0">{{ t('attendance.summary.noRecordsFound') }}</h3>
    </div>

  </div>
</template>