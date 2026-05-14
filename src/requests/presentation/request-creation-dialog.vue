<template>
  <pv-dialog
    v-model:visible="visible"
    header="Nueva Solicitud"
    :modal="true"
    :style="{ width: '480px' }"
  >
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Tipo de solicitud</label>
        <pv-select
          v-model="form.type"
          :options="requestTypes"
          placeholder="Selecciona un tipo"
          class="w-full"
        />
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Fecha de inicio</label>
        <pv-date-picker v-model="form.startDate" class="w-full" date-format="dd M yy" />
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Fecha de fin</label>
        <pv-date-picker v-model="form.endDate" class="w-full" date-format="dd M yy" />
      </div>
    </div>

    <template #footer>
      <pv-button label="Cancelar" severity="secondary" text @click="close" />
      <pv-button
        label="Enviar solicitud"
        icon="pi pi-send"
        :loading="store.loading"
        @click="submit"
      />
    </template>
  </pv-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';

const store   = useRequestsStore();
const visible = ref(false);

const form = ref({ type: null, startDate: null, endDate: null, employeeId: null });

const requestTypes = ['Vacaciones', 'Permiso Médico', 'Licencia por Paternidad'];

function open(employeeId = null) {
  form.value = { type: null, startDate: null, endDate: null, employeeId };
  visible.value = true;
}

function close() {
  visible.value = false;
}

async function submit() {
  await store.createRequest(form.value);
  close();
}

defineExpose({ open });
</script>