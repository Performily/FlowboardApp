<template>
  <pv-dialog :visible="visible" modal :header="t('vacations.creationDialog.title')" :style="{ width: '50vw' }" @update:visible="$emit('update:visible', $event)">
    <div class="flex flex-column gap-3 p-fluid mt-2">
      <div class="field">
        <label for="employee">{{ t('vacations.creationDialog.collaborator') }}</label>
        <pv-select id="employee" :options="store.employeesList" optionLabel="name" :placeholder="t('vacations.creationDialog.selectCollaborator')" />
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="start">{{ t('vacations.creationDialog.startDate') }}</label>
          <pv-date-picker id="start" showIcon />
        </div>
        <div class="field col">
          <label for="end">{{ t('vacations.creationDialog.endDate') }}</label>
          <pv-date-picker id="end" showIcon />
        </div>
      </div>
    </div>
    <template #footer>
      <pv-button :label="t('common.cancel')" icon="pi pi-times" text @click="$emit('update:visible', false)" />
      <pv-button :label="t('vacations.creationDialog.saveAssignment')" icon="pi pi-check" @click="save" autofocus />
    </template>
  </pv-dialog>
</template>

<script setup>
import { useVacationsStore } from '../application/vacations.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
defineProps(['visible']);
const emit = defineEmits(['update:visible']);
const store = useVacationsStore();

const save = () => {
  emit('update:visible', false);
};
</script>