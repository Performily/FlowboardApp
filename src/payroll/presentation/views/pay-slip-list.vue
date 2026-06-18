<script setup>
import { onMounted, toRefs, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import usePayrollStore from '../../application/payroll.store.js';
import useIamStore from '../../../iam/application/iam.store.js'; // 1. Importamos sesión
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const store = usePayrollStore();
const iamStore = useIamStore();

const currentUser = computed(() => iamStore.currentUser);
const isHR = computed(() => currentUser.value?.role === 'RRHH'); // 2. Verificamos el rol

const { paySlips, paySlipsLoaded, errors } = toRefs(store);
const { fetchPaySlips } = store;

const selectedPeriod = ref(null);
const selectedStatus = ref(null);
const searchQuery = ref('');

const periods = computed(() => [
  { name: t('payroll.list.periods.january2026'), code: t('payroll.list.periods.january2026') },
  { name: t('payroll.list.periods.february2026'), code: t('payroll.list.periods.february2026') }
]);

const statuses = computed(() => [
  t('payroll.list.status.paid'),
  t('payroll.list.status.pending'),
  t('payroll.list.status.observation')
]);

// 3. FILTRO MÁGICO: RRHH ve todo, Colaborador ve solo sus boletas
const displayedPaySlips = computed(() => {
  if (isHR.value) return paySlips.value;
  const currentUserId = currentUser.value?.id || 1;
  return paySlips.value.filter(p => String(p.collaboratorId) === String(currentUserId));
});

onMounted(() => {
  if (!paySlipsLoaded.value) {
    fetchPaySlips(); 
  }
});

const applyFilters = () => {
  const filters = {};
  if (selectedPeriod.value) filters.period = selectedPeriod.value.code;
  if (selectedStatus.value) filters.status = selectedStatus.value;
  if (searchQuery.value) filters.q = searchQuery.value; 
  fetchPaySlips(filters);
};

const clearFilters = () => {
  selectedPeriod.value = null;
  selectedStatus.value = null;
  searchQuery.value = '';
  fetchPaySlips();
};

const getStatusSeverity = (status) => {
  if (status === t('payroll.list.status.paid')) return 'success';
  if (status === t('payroll.list.status.observation')) return 'danger';
  return 'secondary';
};
const displayPdfDialog = ref(false);
const selectedPaySlip = ref(null);
const zoomLevel = ref(100); 

const openPdfViewer = (paySlip) => {
  selectedPaySlip.value = paySlip;
  zoomLevel.value = 100; 
  displayPdfDialog.value = true;
};

const closePdfViewer = () => {
  displayPdfDialog.value = false;
  selectedPaySlip.value = null; 
};

const increaseZoom = () => { if (zoomLevel.value < 200) zoomLevel.value += 25; };
const decreaseZoom = () => { if (zoomLevel.value > 50) zoomLevel.value -= 25; };

const downloadPdf = () => {
  if (!selectedPaySlip.value) return;
  alert(`Descargando boleta de ${selectedPaySlip.value.collaboratorName} (${selectedPaySlip.value.period})`);
};
</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-3 mb-4">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="router.back()" />
      <i class="pi pi-credit-card text-3xl text-primary"></i>
      <h1 class="m-0 text-3xl font-bold text-primary">{{ isHR ? t('payroll.list.title') : 'Mis Boletas' }}</h1>
    </div>

    <pv-card class="mb-4">
      <template #content>
      <div class="formgrid grid align-items-end gap-0">
        
        <div class="field col-12 md:col-3">
          <label class="block mb-2 font-medium text-700">{{ t('payroll.list.filters.period') }}</label>
          <pv-select v-model="selectedPeriod" :options="periods" optionLabel="name" :placeholder="t('payroll.list.filters.selectOption')" class="w-full" />
        </div>

        <div class="field col-12 md:col-3">
          <label class="block mb-2 font-medium text-700">{{ t('payroll.list.filters.paymentStatus') }}</label>
          <pv-select v-model="selectedStatus" :options="statuses" :placeholder="t('payroll.list.filters.selectOption')" class="w-full" />
        </div>

        <div v-if="isHR" class="field col-12 md:col-4">
          <label class="block mb-2 font-medium text-700">{{ t('payroll.list.filters.searchCollaborator') }}</label>
          <pv-input-text v-model="searchQuery" :placeholder="t('payroll.list.filters.searchPlaceholder')" class="w-full" />
        </div>
        
        <div class="field col-12 md:col-2 flex gap-2">
          <pv-button :label="t('payroll.list.filters.search')" icon="pi pi-search" @click="applyFilters" class="w-full" />
          <pv-button :label="t('payroll.list.filters.clear')" icon="pi pi-filter-slash" severity="secondary" outlined @click="clearFilters" class="w-full" />
        </div>
    </div>
      </template>
    </pv-card>

    <div v-if="errors.length" class="text-red-500 mb-3">
      <strong>{{ t('payroll.list.errors.title') }}</strong> {{ errors.map(e => e.message).join(', ') }}
    </div>

  <pv-card>
    <template #title>{{ isHR ? t('payroll.list.table.title') : 'Historial de mis pagos' }}</template>
    <template #content>
      <pv-data-table 
        :value="displayedPaySlips" 
        :loading="!paySlipsLoaded" 
        striped-rows paginator :rows="5" 
        responsiveLayout="scroll"
      >
        <pv-column v-if="isHR" field="collaboratorName" :header="t('payroll.list.table.collaborator')" sortable></pv-column>
        <pv-column v-if="isHR" field="collaboratorCode" :header="t('payroll.list.table.code')"></pv-column>
        <pv-column v-if="isHR" field="area" :header="t('payroll.list.table.area')"></pv-column>
        
        <pv-column field="period" header="Periodo"></pv-column>

        <pv-column :header="t('payroll.list.table.netAmount')">
          <template #body="slotProps">
            {{ slotProps.data.formatCurrency(slotProps.data.netIncome) }}
          </template>
        </pv-column>
        
        <pv-column :header="t('payroll.list.table.status')">
          <template #body="slotProps">
            <pv-tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
          </template>
        </pv-column>
        
        <pv-column :header="t('payroll.list.table.action')">
          <template #body="slotProps">
            <pv-button :label="t('payroll.list.table.viewDetail')" outlined @click="openPdfViewer(slotProps.data)" />
          </template>
        </pv-column>
      </pv-data-table>
    </template>
  </pv-card>
  </div>

  <pv-dialog v-model:visible="displayPdfDialog" modal :showHeader="false" :maximized="true" contentClass="p-0 border-round-none overflow-hidden" append-to="body">
    <div v-if="selectedPaySlip" class="flex flex-column h-screen border-none">
      <div class="bg-primary flex justify-content-between align-items-center p-3 text-white border-none">
        <span class="font-bold">Boleta {{ selectedPaySlip.collaboratorCode }} - {{ selectedPaySlip.period }}</span>
        <i class="pi pi-times cursor-pointer text-xl hover:text-gray-300 transition-colors" @click="closePdfViewer"></i>
      </div>
      <div class="surface-900 text-white flex justify-content-center align-items-center px-4 py-2 text-sm relative border-none">
        <div class="flex align-items-center gap-3">
          <span>1 / 1</span><div class="border-left-1 border-gray-600 h-1rem"></div>
          <i class="pi pi-minus cursor-pointer hover:text-gray-400" @click="decreaseZoom"></i>
          <span class="surface-700 px-2 py-1 border-round w-4rem text-center">{{ zoomLevel }}%</span>
          <i class="pi pi-plus cursor-pointer hover:text-gray-400" @click="increaseZoom"></i>
        </div>
        <div class="absolute right-0 pr-4 flex align-items-center gap-3">
          <div class="border-left-1 border-gray-600 h-1rem"></div>
          <i class="pi pi-download cursor-pointer hover:text-primary transition-colors text-lg" title="Descargar PDF" @click="downloadPdf"></i>
        </div>
      </div>
      <div class="surface-ground flex-1 overflow-auto p-4 md:p-6 flex justify-content-center">
        <div class="bg-white shadow-6 p-5 w-full origin-top" :style="{ maxWidth: '794px', minHeight: '1123px', transform: `scale(${zoomLevel / 100})`, marginBottom: `${(zoomLevel - 100) * 8}px` }">
          <div class="text-center mb-5 border-bottom-1 surface-border pb-3">
            <h2 class="m-0 text-primary">Boleta de Pago</h2><p class="text-600 m-0 mt-2">{{ selectedPaySlip.period }}</p>
          </div>
          <div class="grid">
            <div class="col-6"><span class="font-bold">Colaborador:</span> {{ selectedPaySlip.collaboratorName }}</div>
            <div class="col-6"><span class="font-bold">Código:</span> {{ selectedPaySlip.collaboratorCode }}</div>
            <div class="col-6"><span class="font-bold">Área:</span> {{ selectedPaySlip.area }}</div>
            <div class="col-6"><span class="font-bold">Estado:</span> {{ selectedPaySlip.status }}</div>
          </div>
          <div class="mt-5 p-3 surface-100 border-round">
            <div class="flex justify-content-between mb-2"><span>Ingreso Bruto (Sueldo Completo):</span> <span>S/ {{ selectedPaySlip.grossIncome }}</span></div>
            <div class="flex justify-content-between mb-2"><span>Deducciones (Descuentos):</span> <span class="text-red-500">- S/ {{ selectedPaySlip.deductions }}</span></div>
            <div class="flex justify-content-between font-bold border-top-1 surface-border pt-2 mt-2 text-lg">
              <span>Monto Neto (A depositar):</span> <span class="text-primary">S/ {{ selectedPaySlip.grossIncome - selectedPaySlip.deductions }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </pv-dialog>
</template>