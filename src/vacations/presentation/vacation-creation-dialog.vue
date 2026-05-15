<template>
  <pv-dialog :visible="visible" modal header="Asignar Vacaciones" :style="{ width: '50vw' }" @update:visible="$emit('update:visible', $event)">
    <div class="flex flex-column gap-3 p-fluid mt-2">
      <div class="field">
        <label for="employee">Colaborador</label>
        <pv-select id="employee" :options="store.employeesList" optionLabel="name" placeholder="Seleccionar colaborador" />
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="start">Fecha Inicio</label>
          <pv-date-picker id="start" showIcon />
        </div>
        <div class="field col">
          <label for="end">Fecha Fin</label>
          <pv-date-picker id="end" showIcon />
        </div>
      </div>
    </div>
    <template #footer>
      <pv-button label="Cancelar" icon="pi pi-times" text @click="$emit('update:visible', false)" />
      <pv-button label="Guardar Asignación" icon="pi pi-check" @click="save" autofocus />
    </template>
  </pv-dialog>
</template>

<script setup>
import { useVacationsStore } from '../application/vacations.store.js';

defineProps(['visible']);
const emit = defineEmits(['update:visible']);
const store = useVacationsStore();

const save = () => {
  emit('update:visible', false);
};
</script>