<template>
  <div class="p-4">
    <div class="flex align-items-center gap-2 mb-4">
      <i class="pi pi-file-edit text-2xl" style="color: #3b4cb8"></i>
      <h1 class="text-3xl font-bold m-0" style="color: #3b4cb8">Solicitudes</h1>
    </div>

    <div class="grid">
      <div class="col-12 md:col-4">
        <div
          class="request-card flex flex-column align-items-center justify-content-center p-4 border-round-lg cursor-pointer bg-white"
          style="border: 1px solid #e5e7eb; min-height: 180px;"
          @click="goToRegistration"
        >
          <div
            class="flex align-items-center justify-content-center border-circle mb-3"
            style="width: 72px; height: 72px; background-color: #3b4cb8;"
          >
            <i class="pi pi-plus-circle text-3xl text-white"></i>
          </div>
          <span class="text-sm font-medium text-center text-700">
            Registro de Solicitudes
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRegistration() {
  router.push({ name: 'request-registration' });
}
</script>

<style scoped>
.request-card {
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}
.request-card:hover {
  box-shadow: 0 4px 16px rgba(59, 76, 184, 0.18);
  transform: translateY(-2px);
}
</style>