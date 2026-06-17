<script setup>
import { onMounted, toRefs, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useHomeStore from '../../application/home.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
import useAttendanceStore from '../../../attendance/application/attendance.store.js';
import { useVacationsStore } from '../../../vacations/application/vacations.store.js';

const { t } = useI18n();
const router = useRouter();

const store = useHomeStore();
const iamStore = useIamStore();
const attendanceStore = useAttendanceStore();
const vacationsStore = useVacationsStore();

const { totalEmployees, pendingRequests, pendingRequestsCount, isLoading } = toRefs(store);
const { totalLate } = toRefs(attendanceStore);
const { scheduledVacations } = toRefs(vacationsStore);

const currentUser = computed(() => iamStore.currentUser);

const dateRangeText = computed(() => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); 
  startOfWeek.setDate(diff);

  const optionsDayMonth = { day: '2-digit', month: 'long' };
  const optionsFull = { day: '2-digit', month: 'long', year: 'numeric' };

  const formattedStart = startOfWeek.toLocaleDateString('es-ES', optionsDayMonth);
  const formattedToday = currentDate.toLocaleDateString('es-ES', optionsFull);

  return `del ${formattedStart} hasta el ${formattedToday}`;
});

onMounted(() => {
  store.fetchDashboardData();
  attendanceStore.fetchAttendances();
  vacationsStore.fetchDashboardData();
});

const goTo = (routeName) => {
  router.push({ name: routeName }).catch(err => console.error("Error al navegar:", err));
};
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="flex flex-column md:flex-row md:align-items-center justify-content-between mb-5">
      <div>
        <h1 class="m-0 text-900 font-bold text-3xl mb-2">
          {{ t('home.welcome', { name: currentUser?.fullName || t('home.administrator') }) }} 👋
        </h1>
        <p class="m-0 text-600">Este es el resumen de tu empresa al día de hoy, {{ dateRangeText }}</p>
      </div>
      <div class="mt-3 md:mt-0 flex gap-2">
        <pv-button icon="pi pi-user-plus" label="Nuevo Empleado" @click="goTo('employee-registration')" />
        <pv-button icon="pi pi-calendar-times" label="Ver Asistencias" severity="secondary" @click="goTo('attendance-list')" />
      </div>
    </div>

    <div v-if="isLoading || attendanceStore.loading || vacationsStore.loading" class="flex justify-content-center p-5">
      <i class="pi pi-spin pi-spinner text-primary text-4xl"></i>
    </div>

    <div v-else>
      
      <div class="grid mb-5">
        <div class="col-12 md:col-6 lg:col-3">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center h-full">
            <div>
              <span class="block text-500 font-medium mb-2">{{ t('home.totalEmployees') }}</span>
              <div class="text-900 font-bold text-4xl">{{ totalEmployees }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-blue-100 text-blue-500">
              <i class="pi pi-users text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center h-full cursor-pointer hover:shadow-4 transition-all transition-duration-200" @click="goTo('requests')">
            <div>
              <span class="block text-500 font-medium mb-1">Solicitudes pendientes</span>
              <span class="block text-400 text-xs mb-2">({{ dateRangeText }})</span>
              <div class="text-900 font-bold text-4xl text-orange-500">{{ pendingRequestsCount }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-orange-100 text-orange-500">
              <i class="pi pi-envelope text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center h-full cursor-pointer hover:shadow-4 transition-all transition-duration-200" @click="router.push({ name: 'attendance-list', query: { status: 'Tardanza', period: 'currentWeek' } })">
            <div>
              <span class="block text-500 font-medium mb-1">Tardanzas Registradas</span>
              <span class="block text-400 text-xs mb-2">({{ dateRangeText }})</span>
              <div class="text-900 font-bold text-4xl text-red-500">{{ totalLate }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-red-100 text-red-500">
              <i class="pi pi-clock text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6 lg:col-3">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center h-full cursor-pointer hover:shadow-4 transition-all transition-duration-200" @click="goTo('vacations')">
            <div>
              <span class="block text-500 font-medium mb-2">Vacaciones Programadas</span>
              <div class="text-900 font-bold text-4xl text-green-500">{{ scheduledVacations }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-green-100 text-green-500">
              <i class="pi pi-sun text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid">
        
        <div class="col-12 lg:col-7">
          <div v-if="pendingRequests.length > 0" class="surface-card shadow-1 border-round-2xl p-4 h-full">
            <div class="flex justify-content-between align-items-center mb-4">
              <h2 class="m-0 text-xl font-bold">{{ t('home.latestRequests') }}</h2>
              <pv-button icon="pi pi-arrow-right" label="Ver todas" text size="small" @click="goTo('requests')" />
            </div>
            <pv-data-table :value="pendingRequests" class="p-datatable-sm">
                <pv-column field="type" :header="t('home.table.procedure')"></pv-column>
                <pv-column field="startDate" :header="t('home.table.startDate')"></pv-column>
                <pv-column :header="t('home.table.status')">
                    <template #body="slotProps">
                    <span class="bg-orange-100 text-orange-600 px-2 py-1 border-round text-sm font-medium">{{ slotProps.data.status }}</span>
                    </template>
                </pv-column>
            </pv-data-table>
          </div>
        </div>

        <div class="col-12 lg:col-5">
          <div class="surface-card shadow-1 border-round-2xl p-4 h-full">
            <h2 class="m-0 text-xl font-bold mb-4">Accesos Rápidos</h2>
            
            <div class="flex flex-column gap-3">
              <div class="flex align-items-center p-3 border-round border-1 surface-border cursor-pointer hover:surface-100 transition-all" @click="goTo('pay-slip-list')">
                <div class="w-3rem h-3rem flex justify-content-center align-items-center bg-green-100 border-circle mr-3">
                  <i class="pi pi-money-bill text-green-500 text-xl"></i>
                </div>
                <div class="flex flex-column">
                  <span class="text-900 font-medium">Estado de Pagos</span>
                  <span class="text-500 text-sm">Gestionar boletas del personal</span>
                </div>
                <i class="pi pi-chevron-right text-500 ml-auto"></i>
              </div>

              <div class="flex align-items-center p-3 border-round border-1 surface-border cursor-pointer hover:surface-100 transition-all" @click="goTo('vacation-creation')">
                <div class="w-3rem h-3rem flex justify-content-center align-items-center bg-purple-100 border-circle mr-3">
                  <i class="pi pi-calendar-plus text-purple-500 text-xl"></i>
                </div>
                <div class="flex flex-column">
                  <span class="text-900 font-medium">Asignar Vacaciones</span>
                  <span class="text-500 text-sm">Programar descansos de empleados</span>
                </div>
                <i class="pi pi-chevron-right text-500 ml-auto"></i>
              </div>

              <div class="flex align-items-center p-3 border-round border-1 surface-border cursor-pointer hover:surface-100 transition-all" @click="goTo('employee-update')">
                <div class="w-3rem h-3rem flex justify-content-center align-items-center bg-blue-100 border-circle mr-3">
                  <i class="pi pi-sync text-blue-500 text-xl"></i>
                </div>
                <div class="flex flex-column">
                  <span class="text-900 font-medium">Actualizar Empleados</span>
                  <span class="text-500 text-sm">Modificar legajos e información</span>
                </div>
                <i class="pi pi-chevron-right text-500 ml-auto"></i>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>