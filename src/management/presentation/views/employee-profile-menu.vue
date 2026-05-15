<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goTo = (routeName) => {
  router.push({ name: routeName });
};
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center gap-3 mb-5">
      <i class="pi pi-user text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">Información Laboral</h1>
    </div>

    <div class="grid">
      
      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div 
          class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
          @click="goTo('employee-selection')"
        >
          <div class="w-8rem h-8rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-id-card text-white text-6xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Ver Perfil Personal</span>
        </div>
      </div>

    </div>
  </div>
</template>