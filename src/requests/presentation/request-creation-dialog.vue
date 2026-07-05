<script setup>
import { ref } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';
import useIamStore from '../../iam/application/iam.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRequestsStore();
const iamStore = useIamStore();
const visible = ref(false);

const form = ref({ type: null, justification: '', startDate: null, endDate: null, evidenceUrl: '', employeeId: null });

const requestTypes = [
  {
    label: 'Tiempo y Asistencia',
    items: [
      { label: 'Solicitud de vacaciones', value: 'Vacation' },
      { label: 'Permiso personal', value: 'PersonalPermit' },
      { label: 'Permiso por horas', value: 'HourlyPermit' },
      { label: 'Justificación de falta', value: 'AbsenceJustification' }
    ]
  },
  {
    label: 'Licencias',
    items: [
      { label: 'Licencia médica', value: 'MedicalLeave' },
      { label: 'Licencia de maternidad', value: 'MaternityLeave' },
      { label: 'Licencia de paternidad', value: 'PaternityLeave' }
    ]
  },
  {
    label: 'Otros',
    items: [
      { label: 'Otro', value: 'Other' }
    ]
  }
];

function open(employeeId = null) {
  const currentId = employeeId || iamStore.currentUser?.id || 1;
  form.value = { type: null, justification: '', startDate: null, endDate: null, evidenceUrl: '', employeeId: currentId };
  visible.value = true;
}

function close() {
  visible.value = false;
}

const formatDateISO = (dateObj) => {
  if (!dateObj) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T00:00:00`;
};

function calcTotalDays(start, end) {
  if (!start || !end) return 0;
  const diff = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

async function submit() {
  if (!form.value.type || !form.value.justification || !form.value.startDate || !form.value.endDate) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const payload = {
    employeeId: form.value.employeeId,
    type: form.value.type.value,
    justification: form.value.justification,
    startDate: formatDateISO(form.value.startDate),
    endDate: formatDateISO(form.value.endDate),
    totalDays: calcTotalDays(form.value.startDate, form.value.endDate),
    timeFrameDate: null,
    startTime: null,
    endTime: null,
    totalHours: 0,
    evidenceUrl: form.value.evidenceUrl || ''
  };

  await store.createRequest(payload);
  await store.fetchAll();

  close();
}

defineExpose({ open });
</script>

<template>
  <pv-dialog
    v-model:visible="visible"
    :header="t('requests.creation.title')"
    :modal="true"
    :style="{ width: '550px' }"
  >
    <div class="flex flex-column gap-3 pt-2">

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">{{ t('requests.creation.requestType') }}</label>
        <pv-select
          v-model="form.type"
          :options="requestTypes"
          optionLabel="label"
          optionGroupLabel="label"
          optionGroupChildren="items"
          :placeholder="t('requests.creation.selectType')"
          class="w-full"
          filter
        />
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Justificación</label>
        <pv-input-text v-model="form.justification" placeholder="Ej. Consulta médica urgente" class="w-full" />
      </div>

      <div class="flex gap-3">
        <div class="flex flex-column gap-1 flex-1">
          <label class="font-medium text-sm">{{ t('requests.creation.startDate') }}</label>
          <pv-date-picker v-model="form.startDate" class="w-full" date-format="dd/mm/yy" showIcon />
        </div>

        <div class="flex flex-column gap-1 flex-1">
          <label class="font-medium text-sm">{{ t('requests.creation.endDate') }}</label>
          <pv-date-picker v-model="form.endDate" class="w-full" date-format="dd/mm/yy" showIcon />
        </div>
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">URL de evidencia</label>
        <pv-input-text v-model="form.evidenceUrl" placeholder="https://..." class="w-full" />
      </div>

    </div>

    <template #footer>
      <pv-button :label="t('requests.creation.cancel')" severity="secondary" text @click="close" />
      <pv-button
        :label="t('requests.creation.submit')"
        icon="pi pi-send"
        :loading="store.loading"
        @click="submit"
      />
    </template>
  </pv-dialog>
</template>