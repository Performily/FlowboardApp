<script setup>
</script>

<template>
  <div class="layout-wrapper">
    <header class="bg-primary text-white p-3 shadow-2 flex align-items-center">
      <i class="pi pi-bars text-xl mr-3 cursor-pointer"></i>
      <h2 class="m-0 text-xl font-semibold">Performily</h2>
    </header>

    <main class="layout-main p-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  background-color: #f8f9fa; 
}
</style>