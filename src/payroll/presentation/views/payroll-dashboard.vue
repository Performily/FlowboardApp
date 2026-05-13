<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPaySlips = () => {
  router.push({ name: 'pay-slip-list' }); 
};

const goToFeature = (feature) => {
  console.log(`Navegando a: ${feature}`);
};
</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-5">
      <i class="pi pi-credit-card text-primary text-3xl font-bold"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">Pagos</h1>
    </div>

    <div class="grid gap-4 md:gap-5 m-0">
      
      <div 
        class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
        @click="goToFeature('Boletas')"
      >
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-file text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">Boletas de pago</span>
      </div>

      <div 
        class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
        @click="goToFeature('Periodo')"
      >
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-calendar text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">Boletas de pago por periodo</span>
      </div>

      <div 
        class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
        @click="goToPaySlips"
      >
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-money-bill text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">Estado de pagos</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.md\:col {
    flex: 1 1 0;
}
</style>