<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToList = () => {
  router.push({ name: 'attendance-list' }); 
};

const goToSummary = () => {
  router.push({ name: 'attendance-summary' }); 
};

</script>

<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-5">
      <i class="pi pi-calendar-times text-primary text-3xl font-bold"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">Asistencia</h1>
    </div>

    <div class="grid gap-4 md:gap-5 m-0">
      
      <div 
        class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
        @click="goToList"
      >
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-list text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">Registro de asistencias</span>
      </div>

      <div 
        class="col-12 md:col flex flex-column align-items-center bg-white border-round-2xl p-5 cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
        @click="goToSummary"
      >
        <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
          <i class="pi pi-id-card text-white text-5xl"></i>
        </div>
        <span class="text-900 font-bold text-lg text-center">Resumen por colaborador</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.md\:col {
    flex: 1 1 0;
}
</style>