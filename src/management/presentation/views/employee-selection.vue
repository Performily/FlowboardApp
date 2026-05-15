<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const store = useManagementStore();
const searchQuery = ref('');

onMounted(() => store.fetchEmployees());

const filteredEmployees = computed(() => {
  return store.employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    emp.code.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const viewProfile = (id) => {
  router.push({ name: 'employee-personal-profile', params: { id } });
};
</script>

<template>
  <div class="p-4 md:p-5">
    <div class="flex align-items-center gap-3 mb-5">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="router.push({name:'info'})" />
      <i class="pi pi-users text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">{{ t('management.selection.title') }}</h1>
    </div>

    <pv-card class="mb-4 shadow-1 border-round-xl">
      <template #content>
        <div class="relative w-full">
          <i class="pi pi-search absolute text-500" 
             style="top: 50%; left: 1rem; transform: translateY(-50%); z-index: 1;"></i>
          <pv-input-text 
            v-model="searchQuery" 
            :placeholder="t('management.selection.searchPlaceholder')" 
            class="w-full border-round-xl" 
            style="padding-left: 2.8rem; height: 3.5rem;" 
          />
        </div>
      </template>
    </pv-card>

    <div class="surface-card shadow-1 border-round-2xl overflow-hidden">
      <pv-data-table :value="filteredEmployees" striped-rows paginator :rows="10" responsiveLayout="scroll">
        <pv-column field="code" :header="t('management.selection.code')" sortable></pv-column>
        <pv-column field="name" :header="t('management.selection.fullName')" sortable></pv-column>
        <pv-column field="area" :header="t('management.selection.area')" sortable></pv-column>
        <pv-column :header="t('management.selection.action')">
          <template #body="slotProps">
            <pv-button 
              :label="t('management.selection.viewInformation')" 
              icon="pi pi-eye" 
              outlined 
              size="small" 
              @click="viewProfile(slotProps.data.id)" 
            />
          </template>
        </pv-column>
        <template #empty>
          <div class="text-center p-4 text-500">{{ t('management.selection.empty') }}</div>
        </template>
      </pv-data-table>
    </div>
  </div>
</template>