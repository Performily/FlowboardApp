<template>
  <div class="flex justify-content-between align-items-center px-4 py-3 bg-white border-bottom-1 surface-border">
    
    <div class="relative w-20rem">
      <i class="pi pi-search absolute text-500" style="top: 50%; left: 1rem; transform: translateY(-50%); z-index: 1;"></i>
      <pv-input-text placeholder="Buscar aquí" class="w-full border-round-2xl surface-100 border-none" style="padding-left: 2.8rem; padding-top: 0.75rem; padding-bottom: 0.75rem;" />
    </div>

    <div class="flex align-items-center gap-4">
      <i class="pi pi-envelope text-2xl text-600 cursor-pointer hover:text-primary"></i>
      <i class="pi pi-bell text-2xl text-600 cursor-pointer hover:text-primary"></i>
      
      <div class="flex align-items-center gap-2 cursor-pointer border-left-1 surface-border pl-4">
        <i class="pi pi-user text-3xl text-700"></i>
        <div class="flex flex-column text-sm">
          <span class="font-semibold text-700">Usuario</span>
          <span class="text-500">Puesto</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
</style>