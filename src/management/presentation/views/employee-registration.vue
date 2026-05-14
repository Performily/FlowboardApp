<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';

const router = useRouter();
const store = useManagementStore();

const employee = ref({
  name: '',
  area: ''
});

const isSaving = ref(false);

const saveEmployee = async () => {
  if (!employee.value.name || !employee.value.area) {
    alert("Por favor, completa el nombre y el área.");
    return;
  }

  isSaving.value = true;
  
  try {
    await store.registerEmployee(employee.value);
    alert("¡Colaborador registrado con éxito!");
    router.push({ name: 'management' }); 
  } catch (error) {
    alert("Ocurrió un error. Revisa que json-server esté encendido.");
  } finally {
    isSaving.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'management' }); 
};
</script>

<template>
  <div class="p-4 md:p-5">
    
    <div class="flex align-items-center gap-3 mb-5">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="goBack" />
      <h1 class="m-0 text-900 font-bold text-3xl">Registrar nuevo colaborador</h1>
    </div>

    <div class="surface-card shadow-1 border-round-2xl p-5 max-w-30rem">
      <div class="flex flex-column gap-4">
        
        <div class="flex flex-column gap-2">
          <label class="font-medium text-700">Nombre completo</label>
          <pv-input-text v-model="employee.name" placeholder="Ej. Juan Pérez" />
        </div>

        <div class="flex flex-column gap-2">
          <label class="font-medium text-700">Área asignada</label>
          <pv-input-text v-model="employee.area" placeholder="Ej. Recursos Humanos" />
        </div>

        <small class="text-500 flex align-items-center gap-2 mt-2">
          <i class="pi pi-info-circle"></i> 
          El código (Ej. COL-005) se generará automáticamente al guardar.
        </small>

      </div>

      <div class="flex justify-content-end gap-3 mt-5 pt-3 border-top-1 surface-border">
        <pv-button label="Cancelar" outlined severity="secondary" @click="goBack" />
        <pv-button label="Guardar Colaborador" icon="pi pi-save" :loading="isSaving" @click="saveEmployee" />
      </div>
    </div>

  </div>
</template>