<template>
  <div class="flex flex-column gap-3">
    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-3">Evaluación de la solicitud seleccionada</h3>
      <div v-if="employee" class="flex justify-content-between text-sm">
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">Colaborador</span>
          <span>{{ employee.name }}</span>
        </div>
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">Periodo solicitado</span>
          <span class="text-center" style="max-width: 120px;">{{ formattedPeriod }}</span>
        </div>
        <div class="flex flex-column align-items-center">
          <span class="text-500 font-bold mb-1">Estado</span>
          <pv-tag :value="employee.status" :severity="getSeverity(employee.status)" />
        </div>
      </div>
      <div v-else class="text-sm text-500 text-center">Seleccione un colaborador</div>
    </div>

    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-3">Resultado de disponibilidad</h3>
      
      <div v-if="employee && employee.requestStartDate">
        <div class="flex flex-column gap-2">
          <div class="flex justify-content-between text-sm">
            <span class="text-600">Días solicitados:</span>
            <span class="font-bold">{{ requestedDays }} días</span>
          </div>
          <div class="flex justify-content-between text-sm">
            <span class="text-600">Días disponibles:</span>
            <span class="font-bold">{{ employee.availableDays }} días</span>
          </div>
          
          <div class="mt-2 p-2 border-round text-sm" :class="evaluationResult.bgClass">
            <i :class="['pi mr-2', evaluationResult.icon, evaluationResult.textClass]"></i>
            <span class="font-medium" :class="evaluationResult.textClass">{{ evaluationResult.message }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="employee" class="text-sm text-500 text-center py-2">
        El colaborador no tiene una solicitud de vacaciones en curso.
      </div>
      <div v-else class="text-sm text-500 text-center py-2">
        Esperando selección...
      </div>
    </div>

    <div class="surface-card p-3 border-round border-1 border-300">
      <h3 class="text-sm text-600 font-medium mt-0 mb-2">Resumen de disponibilidad en el periodo</h3>
      <div class="border-bottom-1 border-300 my-2"></div>
      <ul class="pl-3 m-0 text-sm text-700 line-height-3">
        <li>Colaboradores disponibles: {{ store.availableEmployees }}</li>
        <li>Colaboradores con vacaciones programadas: {{ store.scheduledVacations }}</li>
        <li>Colaboradores con solicitudes pendientes: {{ store.pendingRequests }}</li>
        <li>Total colaboradores en el área: {{ store.totalEmployees }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useVacationsStore } from '../application/vacations.store.js';

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
      message: 'Cuenta con saldo vacacional suficiente.',
      bgClass: 'bg-green-50',
      textClass: 'text-green-700',
      icon: 'pi-check-circle'
    };
  } else {
    return {
      message: `Días insuficientes. Faltan ${requested - available} días.`,
      bgClass: 'bg-red-50',
      textClass: 'text-red-700',
      icon: 'pi-exclamation-triangle'
    };
  }
});

const getSeverity = (status) => {
  if (status === 'Aprobado') return 'success';
  if (status === 'Pendiente') return 'warn';
  if (status === 'Rechazado') return 'danger';
  return 'info';
};
</script>