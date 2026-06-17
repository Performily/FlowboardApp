<script setup>
import { ref } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';
import useIamStore from '../../iam/application/iam.store.js'; // 1. Importamos la memoria del usuario
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRequestsStore();
const iamStore = useIamStore(); // 2. Traemos al usuario que inició sesión
const visible = ref(false);

// 3. Añadimos 'title' al estado inicial
const form = ref({ type: null, title: '', startDate: null, endDate: null, employeeId: null });

const requestTypes = [
  {
    label: 'Tiempo y Asistencia',
    items: [
      { label: 'Solicitud de vacaciones', value: 'vacaciones' },
      { label: 'Solicitud de permisos (personales, médicos, estudios)', value: 'permisos' },
      { label: 'Solicitud de licencias (maternidad, paternidad, enfermedad)', value: 'licencias' },
      { label: 'Regularización de tardanzas o faltas', value: 'regularizacion' }
    ]
  },
  {
    label: 'Pagos y Beneficios',
    items: [
      { label: 'Solicitud de adelanto de sueldo', value: 'adelanto' },
      { label: 'Solicitud de compensación de horas', value: 'compensacion' },
      { label: 'Solicitud de certificados laborales o boletas', value: 'certificados' },
      { label: 'Solicitud de información sobre beneficios', value: 'beneficios' }
    ]
  },
  {
    label: 'Administrativas / Datos Personales',
    items: [
      { label: 'Actualización de datos personales', value: 'datos_personales' },
      { label: 'Cambio de cuenta bancaria', value: 'cuenta_bancaria' },
      { label: 'Actualización de contacto de emergencia', value: 'contacto_emergencia' },
      { label: 'Constancia de trabajo', value: 'constancia' },
      { label: 'Documentos para trámites externos', value: 'tramites_externos' }
    ]
  },
  {
    label: 'Desarrollo y Talento',
    items: [
      { label: 'Capacitación', value: 'capacitacion' },
      { label: 'Evaluación de desempeño', value: 'desempeno' },
      { label: 'Movilidad interna (postular a otra área)', value: 'movilidad' },
      { label: 'Mentoría o coaching', value: 'mentoria' }
    ]
  },
  {
    label: 'Bienestar o Clima Laboral',
    items: [
      { label: 'Apoyo psicológico o bienestar', value: 'psicologico' },
      { label: 'Reporte de incidentes o conflictos', value: 'incidentes' },
      { label: 'Atención por acoso o denuncias internas', value: 'denuncias' }
    ]
  }
];

function open(employeeId = null) {
  // 4. Asignamos el ID del usuario conectado (si no hay, usa 1)
  const currentId = employeeId || iamStore.currentUser?.id || 1;
  form.value = { type: null, title: '', startDate: null, endDate: null, employeeId: currentId };
  visible.value = true;
}

function close() {
  visible.value = false;
}

// 5. Función manual para formatear la fecha a formato "03 Jun 2026"
const formatDate = (dateObj) => {
  if (!dateObj) return '';
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

async function submit() {
  // Validamos que ningún campo esté vacío
  if (!form.value.type || !form.value.title || !form.value.startDate || !form.value.endDate) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // 6. Armamos los datos limpiamente para la Base de Datos
  const payload = {
    employeeId: form.value.employeeId,
    type: form.value.type.label,  // Extraemos SOLO el texto
    title: form.value.title,      // Enviamos el título
    startDate: formatDate(form.value.startDate), // Formateamos la fecha
    endDate: formatDate(form.value.endDate)
  };

  await store.createRequest(payload);
  
  // 7. Refrescamos la tabla para que busque el nombre del Colaborador
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
      
      <!-- Tipo de Solicitud -->
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

      <!-- Título de Solicitud (NUEVO) -->
      <div class="flex flex-column gap-1">
        <label class="font-medium text-sm">Título de la solicitud</label>
        <pv-input-text v-model="form.title" placeholder="Ej. Consulta médica urgente" class="w-full" />
      </div>

      <!-- Fechas -->
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