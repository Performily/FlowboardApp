<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (routeName) => {
  if (routeName) {
    router.push({ name: routeName });
  } else {
    console.warn("Esta funcionalidad estará disponible pronto.");
  }
};
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="flex align-items-center gap-3 mb-5">
      <i class="pi pi-chart-line text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">Gestión</h1>
    </div>

    <div class="grid">
      
      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div 
          class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200"
          @click="goTo('employee-registration')"
        >
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-user-plus text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Registrar nuevo colaborador</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goTo('')">
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-sync text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Actualizar Información de colaborador</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goTo('')">
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-user-minus text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Dar de baja a colaborador</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goTo('')">
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-user text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Reactivar colaborador</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goTo('')">
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-calendar text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Disponibilidad de vacaciones</span>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-4 p-3">
        <div class="bg-white border-round-2xl p-5 h-full flex flex-column align-items-center justify-content-center cursor-pointer shadow-1 hover:shadow-4 transition-all transition-duration-200" @click="goTo('')">
          <div class="w-7rem h-7rem border-circle bg-primary flex justify-content-center align-items-center mb-4">
            <i class="pi pi-calendar-plus text-white text-5xl"></i>
          </div>
          <span class="text-900 font-bold text-lg text-center">Asignar Vacaciones</span>
        </div>
      </div>

    </div>
  </div>
</template>