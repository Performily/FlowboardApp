<script setup>
import SidebarMenu from './components/sidebar-menu.vue';
import ToolbarContent from './components/toolbar-content.vue';
</script>

<template>
  <div class="flex h-screen w-screen overflow-hidden surface-ground">
    
    <SidebarMenu />

    <div class="flex flex-column flex-1 overflow-hidden">
      
      <ToolbarContent />

      <main class="flex-1 overflow-auto p-4 md:p-5">
        <router-view />
      </main>

    </div>

  </div>
</template>

<style>
/* 1. Atacamos directamente la variable raíz de PrimeVue v4 */
:root {
  --p-font-family: 'Inter', sans-serif !important;
}

/* 2. Limpiamos el fondo y aplicamos al resto de la página */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif !important;
  background-color: #f8f9fa; 
}

/* Opcional: Para asegurar que los títulos (h1, h2, etc.) también obedezcan */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif !important;
}
</style>