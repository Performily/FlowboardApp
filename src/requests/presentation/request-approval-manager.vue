<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';
import useIamStore from '../../iam/application/iam.store.js'; // Importamos la sesión
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRequestsStore();
const iamStore = useIamStore();

const currentUser = computed(() => iamStore.currentUser);
const isHR = computed(() => currentUser.value?.role === 'RRHH'); // Verificamos el rol

const selected       = ref(null);
const approveVisible = ref(false);
const rejectVisible  = ref(false);

const approveForm = ref({ collaboratorComments: null, otherDetails: null });
const rejectForm  = ref({ collaboratorComments: null, otherDetails: null, rejectionReason: null });

const displayedRequests = computed(() => {
  if (isHR.value) return store.requests;
  
  const currentUserId = currentUser.value?.id || 1;
  return store.requests.filter(req => String(req.employeeId) === String(currentUserId));
});

function openApprove(request) {
  selected.value = request;
  approveForm.value = { collaboratorComments: null, otherDetails: null };
  approveVisible.value = true;
}

function openReject(request) {
  selected.value = request;
  rejectForm.value = { collaboratorComments: null, otherDetails: null, rejectionReason: null };
  rejectVisible.value = true;
}

async function confirmApprove() {
  await store.approveRequest(selected.value.id, approveForm.value);
  approveVisible.value = false;
}

async function confirmReject() {
  await store.rejectRequest(selected.value.id, rejectForm.value);
  rejectVisible.value = false;
}

onMounted(() => store.fetchAll());
</script>

<template>
  <div class="p-4">
    <!-- Encabezado con flecha de retroceso (Ya configurada antes) -->
    <div class="flex align-items-center gap-3 mb-4">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="$router.back()" />
      <i class="pi pi-sort-alt text-2xl" style="color: #3b4cb8"></i>
      <!-- Título Dinámico -->
      <h1 class="text-3xl font-bold m-0" style="color: #3b4cb8">
        {{ isHR ? t('requests.approval.title') : 'Mis Solicitudes' }}
      </h1>
    </div>

    <!-- Subtítulo -->
    <div class="mb-3">
      <span class="text-lg text-600 font-medium">{{ isHR ? t('requests.approval.mainList') : 'Historial de mis solicitudes' }}</span>
    </div>

    <!-- Tabla -->
    <pv-data-table
      :value="displayedRequests"
      :loading="store.loading"
      striped-rows
      class="w-full"
      style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;"
    >
      <pv-column field="id" header="ID" style="width: 70px;" />
      <pv-column field="status" :header="t('requests.approval.table.status')" style="width: 130px;">
        <template #body="{ data }">
          <pv-tag
            :value="data.status"
            :severity="
              data.isApproved() ? 'success' :
              data.isRejected() ? 'danger'  : 'warn'
            "
          />
        </template>
      </pv-column>
      <pv-column field="type" :header="t('requests.approval.table.requestType')" />
      <pv-column field="title" :header="t('requests.approval.table.title')" />
      <pv-column v-if="isHR" field="employeeName" :header="t('requests.approval.table.employee')" />
      <pv-column field="startDate" :header="t('requests.approval.table.requestDate')" />

      <pv-column v-if="isHR" header="" style="width: 90px;">
        <template #body="{ data }">
          <div class="flex gap-1 justify-content-end">
            <pv-button
              icon="pi pi-check-circle"
              rounded text
              :disabled="!data.isPending()"
              style="color: #3b4cb8;"
              @click="openApprove(data)"
            />
            <pv-button
              icon="pi pi-times-circle"
              rounded text
              :disabled="!data.isPending()"
              style="color: #e53935;"
              @click="openReject(data)"
            />
          </div>
        </template>
      </pv-column>
    </pv-data-table>

    <pv-dialog v-if="isHR" v-model:visible="approveVisible" :header="t('requests.approval.approveDialog.title')" :modal="true" :style="{ width: '520px' }">
      <div class="flex flex-column gap-3">
        <p class="font-medium text-sm m-0">{{ t('requests.approval.approveDialog.confirmMessage') }}</p>
      </div>
      <template #footer>
        <pv-button :label="t('requests.approval.approveDialog.confirm')" style="background-color:#3b4cb8; border-color:#3b4cb8;" @click="confirmApprove" :loading="store.loading" />
        <pv-button :label="t('requests.approval.cancel')" severity="secondary" text @click="approveVisible = false" />
      </template>
    </pv-dialog>

    <pv-dialog v-if="isHR" v-model:visible="rejectVisible" :header="t('requests.approval.rejectDialog.title')" :modal="true" :style="{ width: '520px' }">
      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.rejectDialog.reason') }}</label>
          <pv-textarea v-model="rejectForm.rejectionReason" rows="3" class="w-full" :placeholder="t('requests.approval.rejectDialog.placeholder')" />
        </div>
      </div>
      <template #footer>
        <pv-button :label="t('requests.approval.rejectDialog.confirm')" severity="danger" @click="confirmReject" :loading="store.loading" />
        <pv-button :label="t('requests.approval.cancel')" severity="secondary" text @click="rejectVisible = false" />
      </template>
    </pv-dialog>
  </div>
</template>