<script setup>
import { onMounted, toRefs, ref } from 'vue';
import { useRouter } from 'vue-router';
import usePayrollStore from '../../application/payroll.store.js';

const router = useRouter();
const store = usePayrollStore();

const { paySlips, paySlipsLoaded, errors } = toRefs(store);
const { fetchPaySlips } = store;

const selectedPeriod = ref(null);
const selectedStatus = ref(null);
const searchQuery = ref('');

const periods = ref([
  { name: 'Enero 2026', code: 'Enero 2026' }, 
  { name: 'Febrero 2026', code: 'Febrero 2026' }
]);
const statuses = ref(['Pagado', 'Pendiente', 'Con observación']);

onMounted(() => {
  if (!paySlipsLoaded.value) {
    fetchPaySlips(); 
  }
});


const applyFilters = () => {
  const filters = {};

  if (selectedPeriod.value) {
    filters.period = selectedPeriod.value.code;
  }

  if (selectedStatus.value) {
    filters.status = selectedStatus.value;
  }

  if (searchQuery.value) {
    filters.q = searchQuery.value; 
  }

  fetchPaySlips(filters);
};

const clearFilters = () => {
  selectedPeriod.value = null;
  selectedStatus.value = null;
  searchQuery.value = '';
  
  fetchPaySlips();
};

const navigateToDetail = (id) => {
  router.push({ name: 'payroll-slip-detail', params: { id } });
};

const getStatusSeverity = (status) => {
  if (status === 'Pagado') return 'success';
  if (status === 'Con observación') return 'danger';
  return 'secondary'; 
};
</script>

<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold text-primary mb-4"><i class="pi pi-credit-card mr-2"></i>Pagos</h1>

    <pv-card class="mb-4">
      <template #content>
        <div class="grid formgrid p-fluid align-items-end">
          <div class="field col-12 md:col-3">
            <label for="period">Periodo de planilla</label>
            <pv-select id="period" v-model="selectedPeriod" :options="periods" optionLabel="name" placeholder="Seleccionar opción" />
          </div>
          <div class="field col-12 md:col-3">
            <label for="status">Estado de pago</label>
            <pv-select id="status" v-model="selectedStatus" :options="statuses" placeholder="Seleccionar opción" />
          </div>
          <div class="field col-12 md:col-4">
            <label for="search">Buscar colaborador</label>
            <pv-input-text id="search" v-model="searchQuery" placeholder="Nombre o Código" />
          </div>
          <div class="field col-12 md:col-2 flex align-items-end gap-2">
            <pv-button label="Consultar" icon="pi pi-search" @click="applyFilters" />
            <pv-button label="Limpiar" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" />
          </div>
        </div>
      </template>
    </pv-card>

    <div v-if="errors.length" class="text-red-500 mb-3">
      <strong>Ocurrieron errores:</strong> {{ errors.map(e => e.message).join(', ') }}
    </div>

    <pv-card>
      <template #title>Resultados de la planilla</template>
      <template #content>
        <pv-data-table 
          :value="paySlips" 
          :loading="!paySlipsLoaded" 
          striped-rows 
          paginator 
          :rows="5" 
          :rows-per-page-options="[5, 10, 20]"
          responsiveLayout="scroll"
        >
          <pv-column field="collaboratorName" header="Colaborador" sortable></pv-column>
          <pv-column field="collaboratorCode" header="Código"></pv-column>
          <pv-column field="area" header="Área"></pv-column>
          
          <pv-column header="Monto neto">
            <template #body="slotProps">
              {{ slotProps.data.formatCurrency(slotProps.data.netIncome) }}
            </template>
          </pv-column>
          
          <pv-column header="Estado">
            <template #body="slotProps">
              <pv-tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </pv-column>
          
          <pv-column field="issueDate" header="Fecha">
            <template #body="slotProps">
              {{ new Date(slotProps.data.issueDate).toLocaleDateString('es-PE') }}
            </template>
          </pv-column>
          
          <pv-column header="Acción">
            <template #body="slotProps">
              <pv-button label="Ver Detalle" outlined size="small" @click="navigateToDetail(slotProps.data.id)" />
            </template>
          </pv-column>

          <template #empty>
            <div class="text-center p-4">No hay boletas de pago disponibles.</div>
          </template>
        </pv-data-table>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>

</style>