<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import usePayrollStore from '../../application/payroll.store.js';

const route = useRoute();
const router = useRouter();
const store = usePayrollStore();

const slipId = route.params.id;
const paySlip = ref(null);

onMounted(() => {
  if (!store.paySlipsLoaded) {
    store.fetchPaySlips();
  }
  
  paySlip.value = store.getPaySlipById(slipId);
});

const navigateBack = () => {
  router.push({ name: 'payroll-slips' });
};

const downloadPdf = () => {
  store.downloadPaySlip(slipId);
};

const getStatusSeverity = (status) => {
  if (status === 'Pagado') return 'success';
  if (status === 'Con observación') return 'danger';
  return 'secondary';
};
</script>

<template>
  <div class="p-4" v-if="paySlip">
    <pv-button icon="pi pi-arrow-left" label="Volver a la lista" text @click="navigateBack" class="mb-4" />

    <pv-card>
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <span>Detalle de Remuneración: {{ paySlip.period }}</span>
          <pv-tag :value="paySlip.status" :severity="getStatusSeverity(paySlip.status)" />
        </div>
      </template>
      <template #content>
        <div class="grid mb-4">
          <div class="col-12 md:col-6">
            <p><strong>Colaborador:</strong> {{ paySlip.collaboratorName }}</p>
            <p><strong>Código:</strong> {{ paySlip.collaboratorCode }}</p>
            <p><strong>Área:</strong> {{ paySlip.area }}</p>
          </div>
          <div class="col-12 md:col-6 text-right">
            <p><strong>Ingresos Brutos:</strong> {{ paySlip.formatCurrency(paySlip.grossIncome) }}</p>
            <p><strong>Descuentos:</strong> {{ paySlip.formatCurrency(paySlip.deductions) }}</p>
            <p class="text-xl font-bold text-primary"><strong>Monto Neto:</strong> {{ paySlip.formatCurrency(paySlip.netIncome) }}</p>
          </div>
        </div>

        <div class="pdf-viewer bg-gray-800 text-white p-3 border-round flex justify-content-between align-items-center">
          <span class="font-bold">Boleta {{ paySlip.id }} - {{ paySlip.paymentType }}</span>
          <div class="flex align-items-center">
            <span class="mr-4">1 / 1 | <i class="pi pi-minus mx-2 cursor-pointer"></i> 100% <i class="pi pi-plus mx-2 cursor-pointer"></i></span>
            <pv-button icon="pi pi-download" label="Descargar Documento" @click="downloadPdf" severity="info" />
          </div>
        </div>
        
        <div class="border-1 surface-border border-round mt-2" style="height: 400px; background-color: #f8f9fa;">
           <div class="flex h-full align-items-center justify-content-center text-500">
             Vista previa del documento PDF
           </div>
        </div>
      </template>
    </pv-card>
  </div>
  
  <div v-else class="p-4 flex flex-column align-items-center justify-content-center" style="min-height: 50vh;">
    <i class="pi pi-spin pi-spinner text-4xl text-primary mb-3"></i>
    <p>Cargando información de la boleta...</p>
  </div>
</template>

<style scoped>
.pdf-viewer {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>