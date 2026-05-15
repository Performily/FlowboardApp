<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useManagementStore } from '../../application/management.store.js';

const router = useRouter();
const store = useManagementStore();

const employee = ref({
  name: '',
  civilStatus: null,
  documentNumber: '',
  age: null,
  personalEmail: '',
  phoneNumber: '',
  address: '',
  gender: null,
  workEmail: '',
  hireDate: '',
  contractType: null,
  area: '',
  jobPosition: '',
  educationLevel: ''
});

const civilStatusOptions = [
  { label: 'Soltero', value: 'SINGLE' },
  { label: 'Casado', value: 'MARRIED' },
  { label: 'Divorciado', value: 'DIVORCED' },
  { label: 'Viudo', value: 'WIDOWED' }
];

const genderOptions = [
  { label: 'Masculino', value: 'MALE' },
  { label: 'Femenino', value: 'FEMALE' },
  { label: 'Otro', value: 'OTHER' }
];

const contractTypeOptions = [
  { label: 'Tiempo completo', value: 'FULL_TIME' },
  { label: 'Medio tiempo', value: 'PART_TIME' },
  { label: 'Por horas', value: 'HOURLY' },
  { label: 'Prácticas', value: 'INTERNSHIP' }
];

const isSaving = ref(false);

const saveEmployee = async () => {
  if (!employee.value.name || !employee.value.documentNumber || !employee.value.area) {
    alert("Por favor, completa al menos el Nombre, Número de documento y Área asignada.");
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
      <i class="pi pi-user-plus text-primary text-4xl"></i>
      <h1 class="m-0 text-primary font-bold text-3xl">Registrar nuevo colaborador</h1>
    </div>

    <div class="surface-card shadow-1 border-round-2xl p-5 w-full">
      
      <div class="grid formgrid p-fluid">
        
        <div class="col-12 md:col-6">
          
          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Nombre completo</label>
            <pv-input-text v-model="employee.name" placeholder="Ej. Juan Pérez" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Número de documento</label>
            <pv-input-text v-model="employee.documentNumber" placeholder="Ej. 12345678" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Correo electrónico personal</label>
            <pv-input-text v-model="employee.personalEmail" placeholder="ejemplo@correo.com" type="email" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Dirección de domicilio</label>
            <pv-input-text v-model="employee.address" placeholder="Av. Principal 123" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Correo de trabajo</label>
            <pv-input-text v-model="employee.workEmail" placeholder="usuario@empresa.com" type="email" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Tipo de contrato</label>
            <pv-select v-model="employee.contractType" :options="contractTypeOptions" optionLabel="label" optionValue="value" placeholder="Seleccione el tipo" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Puesto de trabajo</label>
            <pv-input-text v-model="employee.jobPosition" placeholder="Ej. Analista Senior" class="w-full" />
          </div>

        </div>

        <div class="col-12 md:col-6">
          
          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Estado civil</label>
            <pv-select v-model="employee.civilStatus" :options="civilStatusOptions" optionLabel="label" optionValue="value" placeholder="Seleccione el estado civil" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Edad</label>
            <pv-input-text v-model="employee.age" placeholder="Ej. 30" type="number" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Número de teléfono</label>
            <pv-input-text v-model="employee.phoneNumber" placeholder="987654321" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Género</label>
            <pv-select v-model="employee.gender" :options="genderOptions" optionLabel="label" optionValue="value" placeholder="Seleccione el género" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Fecha de contratación</label>
            <input type="date" class="p-inputtext p-component w-full" v-model="employee.hireDate" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Área asignada</label>
            <pv-input-text v-model="employee.area" placeholder="Ej. Desarrollo" class="w-full" />
          </div>

          <div class="field mb-4">
            <label class="font-medium text-700 block mb-2">Nivel de educación</label>
            <pv-input-text v-model="employee.educationLevel" placeholder="Ej. Bachiller" class="w-full" />
          </div>

        </div>

      </div>

      <div class="flex justify-content-between align-items-center mt-5 pt-4 border-top-1 surface-border">
        <small class="text-500 flex align-items-center gap-2">
          <i class="pi pi-info-circle"></i> 
          El código de colaborador se generará automáticamente.
        </small>
        
        <div class="flex gap-3">
          <pv-button label="Cancelar" outlined severity="secondary" @click="goBack" />
          <pv-button label="Registrar Colaborador" icon="pi pi-save" :loading="isSaving" @click="saveEmployee" class="bg-primary border-none" />
        </div>
      </div>
      
    </div>

  </div>
</template>