<script setup>
import { onMounted, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

import useHomeStore from '../../application/home.store.js';
import useIamStore from '../../../iam/application/iam.store.js';

const router = useRouter();
const store = useHomeStore();

const { totalEmployees, pendingRequests, pendingRequestsCount, isLoading } = toRefs(store);
const { fetchDashboardData } = store;

onMounted(() => {
  fetchDashboardData();
});

const goTo = (routeName) => {
  if (router.hasRoute(routeName)) router.push({ name: routeName });
};

const iamStore = useIamStore();

const currentUser = computed(() => iamStore.currentUser);
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="mb-5">
      <h1 class="m-0 text-900 font-bold text-3xl mb-2">¡Hola, {{ currentUser?.fullName || 'Administrador' }}! 👋</h1>
      <p class="m-0 text-600">Este es el resumen de tu empresa al día de hoy.</p>
    </div>

    <div v-if="isLoading" class="flex justify-content-center p-5">
      <i class="pi pi-spin pi-spinner text-primary text-4xl"></i>
    </div>

    <div v-else>
      
      <div class="grid mb-5">
        <div class="col-12 md:col-6">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center">
            <div>
              <span class="block text-500 font-medium mb-2">Total Empleados</span>
              <div class="text-900 font-bold text-4xl">{{ totalEmployees }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-blue-100 text-blue-500">
              <i class="pi pi-users text-2xl"></i>
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="surface-card shadow-1 p-4 border-round-2xl flex justify-content-between align-items-center">
            <div>
              <span class="block text-500 font-medium mb-2">Trámites Pendientes</span>
              <div class="text-900 font-bold text-4xl text-orange-500">{{ pendingRequestsCount }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round w-4rem h-4rem bg-orange-100 text-orange-500">
              <i class="pi pi-envelope text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pendingRequests.length > 0" class="surface-card shadow-1 border-round-2xl p-4">
        <h2 class="m-0 text-xl font-bold mb-4">Últimas Solicitudes</h2>
        <pv-data-table :value="pendingRequests" class="p-datatable-sm">
            <pv-column field="type" header="Trámite"></pv-column>
            <pv-column field="startDate" header="Fecha de Inicio"></pv-column>
            <pv-column header="Estado">
                <template #body="slotProps">
                <span class="bg-orange-100 text-orange-600 px-2 py-1 border-round text-sm font-medium">{{ slotProps.data.status }}</span>
                </template>
            </pv-column>
        </pv-data-table>
      </div>
      
    </div>
  </div>
</template>