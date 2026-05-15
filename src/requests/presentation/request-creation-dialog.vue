<script setup>
import { ref } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store   = useRequestsStore();
const visible = ref(false);

const form = ref({ type: null, startDate: null, endDate: null, employeeId: null });

const requestTypes = [
  t('requests.creation.types.vacation'),
  t('requests.creation.types.medicalLeave'),
  t('requests.creation.types.paternityLeave')
];

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

<template>
  <pv-dialog
    v-model:visible="visible"
    :header="t('requests.creation.title')"
    :modal="true"
    :style="{ width: '480px' }"
  >
    <div class="flex flex-column gap-3 pt-2">
      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">{{ t('requests.creation.requestType') }}</label>
        <pv-select
          v-model="form.type"
          :options="requestTypes"
          :placeholder="t('requests.creation.selectType')"
          class="w-full"
        />
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">{{ t('requests.creation.startDate') }}</label>
        <pv-date-picker v-model="form.startDate" class="w-full" date-format="dd M yy" />
      </div>

      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">{{ t('requests.creation.endDate') }}</label>
        <pv-date-picker v-model="form.endDate" class="w-full" date-format="dd M yy" />
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

