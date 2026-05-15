<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    
    <div class="flex align-items-center gap-3 mb-4">
      <i class="pi pi-arrow-left text-xl cursor-pointer text-500 hover:text-700 transition-colors" @click="goBack"></i>
      <div class="flex align-items-center gap-2 text-primary">
        <i class="pi pi-sun text-4xl"></i>
        <h1 class="m-0 text-3xl font-bold">{{ t('vacations.list.title') }}</h1>
      </div>
    </div>

    <div class="surface-card p-3 border-round flex flex-wrap gap-3 align-items-end mb-4 border-1 border-200">
      <div class="flex flex-column gap-1 flex-1 min-w-min">
        <label class="text-sm font-medium text-600">{{ t('vacations.list.area') }}</label>
        <pv-select 
          v-model="filters.area" 
          :options="areaOptions" 
          :placeholder="t('vacations.list.selectArea')" 
          class="w-full" 
          showClear 
        />
      </div>
      <div class="flex flex-column gap-1 flex-1 min-w-min">
        <label class="text-sm font-medium text-600">{{ t('vacations.list.startDate') }}</label>
        <pv-date-picker v-model="filters.startDate" placeholder="dd/mm/aaaa" showIcon class="w-full" />
      </div>
      <div class="flex flex-column gap-1 flex-1 min-w-min">
        <label class="text-sm font-medium text-600">{{ t('vacations.list.endDate') }}</label>
        <pv-date-picker v-model="filters.endDate" placeholder="dd/mm/aaaa" showIcon class="w-full" />
      </div>
      <div class="flex flex-column gap-1 flex-1 min-w-min">
        <label class="text-sm font-medium text-600">{{ t('vacations.list.employeeStatus') }}</label>
        <pv-select 
          v-model="filters.status" 
          :options="statusOptions" 
          :placeholder="t('vacations.list.all')"
          class="w-full" 
        />
      </div>
      <div class="flex gap-2">
        <pv-button :label="t('vacations.list.assignVacations')" icon="pi pi-plus" @click="$router.push({ name: 'vacation-creation' })" />
        <pv-button :label="t('vacations.list.clearFilters')" severity="secondary" outlined @click="clearFilters" />
      </div>
    </div>

    <div class="grid mb-4">
      <div class="col-12 md:col-3">
        <div class="surface-card p-3 border-round flex align-items-center gap-3 border-1 border-200">
          <div class="bg-primary border-circle w-3rem h-3rem flex align-items-center justify-content-center"></div>
          <div>
            <span class="block text-500 font-medium mb-1 text-sm">{{ t('vacations.list.totalEmployees') }}</span>
            <div class="text-900 font-bold text-xl">{{ store.totalEmployees }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="surface-card p-3 border-round flex align-items-center gap-3 border-1 border-200">
          <div class="bg-blue-500 border-circle w-3rem h-3rem flex align-items-center justify-content-center"></div>
          <div>
            <span class="block text-500 font-medium mb-1 text-sm">{{ t('vacations.list.available') }}</span>
            <div class="text-900 font-bold text-xl">{{ store.availableEmployees }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="surface-card p-3 border-round flex align-items-center gap-3 border-1 border-200">
          <div class="bg-indigo-500 border-circle w-3rem h-3rem flex align-items-center justify-content-center"><i class="pi pi-calendar text-white"></i></div>
          <div>
            <span class="block text-500 font-medium mb-1 text-sm">{{ t('vacations.list.scheduledVacations') }}</span>
            <div class="text-900 font-bold text-xl">{{ store.scheduledVacations }}</div>
          </div>
        </div>
      </div>
      <div class="col-12 md:col-3">
        <div class="surface-card p-3 border-round flex align-items-center gap-3 border-1 border-200">
          <div class="bg-purple-500 border-circle w-3rem h-3rem flex align-items-center justify-content-center"><i class="pi pi-clock text-white"></i></div>
          <div>
            <span class="block text-500 font-medium mb-1 text-sm">{{ t('vacations.list.pendingRequests') }}</span>
            <div class="text-900 font-bold text-xl">{{ store.pendingRequests }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="col-12 md:col-8">
        <div class="surface-card p-4 border-round border-1 border-200 h-full">
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="text-xl font-bold m-0">{{ t('vacations.list.selectedAreaEmployees') }}</h2>
            <div class="flex gap-3 text-sm">
              <span class="flex align-items-center gap-1"><div class="border-circle w-1rem h-1rem bg-blue-300"></div> {{ t('vacations.status.available') }}</span>
              <span class="flex align-items-center gap-1"><div class="border-circle w-1rem h-1rem bg-indigo-500"></div> {{ t('vacations.list.scheduledVacations') }}</span>
            </div>
          </div>

          <pv-data-table :value="filteredEmployees" :loading="store.loading" selectionMode="single" 
                        @rowSelect="onRowSelect" class="p-datatable-sm w-full" :emptyMessage="t('vacations.list.noEmployeesFound')">
            <pv-column field="name" :header="t('vacations.list.collaborator')"></pv-column>
            <pv-column field="jobPosition" :header="t('vacations.list.position')"></pv-column>
            <pv-column field="status" :header="t('vacations.list.periodStatus')">
              <template #body="slotProps">
                <pv-tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
              </template>
            </pv-column>
            <pv-column field="availableDays" :header="t('vacations.list.availableDays')"></pv-column>
          </pv-data-table>
        </div>
      </div>

      <div class="col-12 md:col-4">
        <vacation-approval-manager />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVacationsStore } from '../application/vacations.store.js';
import VacationApprovalManager from './vacation-approval-manager.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const store = useVacationsStore();

const goBack = () => {
  router.back();
};

const filters = ref({
  area: null,
  startDate: null,
  endDate: null,
  status: t('vacations.list.all')
});

const areaOptions = computed(() => {
  const areas = store.employeesList.map(emp => emp.area).filter(Boolean);
  return [...new Set(areas)]; 
});

const statusOptions = computed(() => [
  t('vacations.list.all'),
  t('vacations.status.available'),
  t('vacations.status.approved'),
  t('vacations.status.pending'),
  t('vacations.status.rejected')
]);
const filteredEmployees = computed(() => {
  return store.employeesList.filter(emp => {
    const matchArea = !filters.value.area || emp.area === filters.value.area;
    const matchStatus = filters.value.status === 'Todos' || emp.status === filters.value.status;
    return matchArea && matchStatus;
  });
});

const clearFilters = () => {
  filters.value = { area: null, startDate: null, endDate: null, status: t('vacations.list.all') };
};

onMounted(() => {
  store.fetchDashboardData();
});

const onRowSelect = (event) => {
  store.selectEmployee(event.data);
};

const getSeverity = (status) => {
  if (status === t('vacations.status.approved')) return 'success';
  if (status === t('vacations.status.pending')) return 'warn';
  if (status === t('vacations.status.rejected')) return 'danger';
  return 'info';
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #d8dcee;
  color: #333;
}
</style>