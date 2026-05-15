<template>
  <div class="flex flex-column gap-3">
    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-3">{{ t('vacations.approval.selectedRequestEvaluation') }}</h3>
      <div v-if="employee" class="flex justify-content-between text-sm">
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">{{ t('vacations.approval.collaborator') }}</span>
          <span>{{ employee.name }}</span>
        </div>
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">{{ t('vacations.approval.requestedPeriod') }}</span>
          <span class="text-center" style="max-width: 120px;">{{ formattedPeriod }}</span>
        </div>
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">{{ t('vacations.approval.status') }}</span>
          <pv-tag :value="employee.status" :severity="getSeverity(employee.status)" />
        </div>
      </div>
      <div v-else class="text-sm text-500 text-center">{{ t('vacations.approval.selectCollaborator') }}</div>
    </div>

    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-3">{{ t('vacations.approval.availabilityResult') }}</h3>
      
      <div v-if="employee && employee.requestStartDate">
        <div class="flex flex-column gap-2">
          <div class="flex justify-content-between text-sm">
            <span class="text-600">{{ t('vacations.approval.requestedDays') }}</span>
            <span class="font-bold">{{ requestedDays }} {{ t('vacations.approval.days') }}</span>
          </div>
          <div class="flex justify-content-between text-sm">
            <span class="text-600">{{ t('vacations.approval.availableDays') }}</span>
            <span class="font-bold">{{ employee.availableDays }} {{ t('vacations.approval.days') }}</span>
          </div>
          
          <div class="mt-2 p-2 border-round text-sm" :class="evaluationResult.bgClass">
            <i :class="['pi mr-2', evaluationResult.icon, evaluationResult.textClass]"></i>
            <span class="font-medium" :class="evaluationResult.textClass">{{ evaluationResult.message }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="employee" class="text-sm text-500 text-center py-2">
        {{ t('vacations.approval.noVacationRequest') }}
      </div>
      <div v-else class="text-sm text-500 text-center py-2">
        {{ t('vacations.approval.waitingSelection') }}
      </div>
    </div>

    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-2">{{ t('vacations.approval.periodAvailabilitySummary') }}</h3>
      <div class="border-bottom-1 border-300 my-2"></div>
      <ul class="pl-3 m-0 text-sm text-700 line-height-3">
        <li>{{ t('vacations.approval.availableCollaborators') }}: {{ store.availableEmployees }}</li>
        <li>{{ t('vacations.approval.scheduledVacations') }}: {{ store.scheduledVacations }}</li>
        <li>{{ t('vacations.approval.pendingRequests') }}: {{ store.pendingRequests }}</li>
        <li>{{ t('vacations.approval.totalEmployees') }}: {{ store.totalEmployees }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useVacationsStore } from '../application/vacations.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useVacationsStore();
const employee = computed(() => store.selectedEmployee);

// Formatear las fechas para que no se vea el feo --/--/--
const formattedPeriod = computed(() => {
  if (!employee.value || !employee.value.requestStartDate) return '--/--/--';
  return `${employee.value.requestStartDate} al ${employee.value.requestEndDate}`;
});

// Calcular cuántos días está pidiendo
const requestedDays = computed(() => {
  if (!employee.value || !employee.value.requestStartDate) return 0;
  
  const start = new Date(employee.value.requestStartDate);
  const end = new Date(employee.value.requestEndDate);
  
  // Diferencia en milisegundos a días (+1 para que sea inclusivo)
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
});

// Lógica de RRHH: ¿Tiene días suficientes?
const evaluationResult = computed(() => {
  if (!employee.value) return {};
  
  const available = employee.value.availableDays;
  const requested = requestedDays.value;

  if (available >= requested) {
    return {
      message: t('vacations.approval.enoughBalance'),
      bgClass: 'bg-green-50',
      textClass: 'text-green-700',
      icon: 'pi-check-circle'
    };
  } else {
    return {
      message: `${t('vacations.approval.insufficientDays')} ${requested - available} ${t('vacations.approval.days')}.`,
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      icon: 'pi-exclamation-triangle'
    };
  }
});

const getSeverity = (status) => {
  if (status === t('vacations.status.approved')) return 'success';
  if (status === t('vacations.status.pending')) return 'warn';
  if (status === t('vacations.status.rejected')) return 'danger';
  return 'info';
};
</script>