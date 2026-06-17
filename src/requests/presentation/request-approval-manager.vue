<script setup>
import { ref, onMounted } from 'vue';
import { useRequestsStore } from '../application/requests.store.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useRequestsStore();

const selected       = ref(null);
const approveVisible = ref(false);
const rejectVisible  = ref(false);

const approveForm = ref({ collaboratorComments: null, otherDetails: null });
const rejectForm  = ref({ collaboratorComments: null, otherDetails: null, rejectionReason: null });

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
    <div class="flex align-items-center gap-3 mb-4">
      <pv-button icon="pi pi-arrow-left" rounded text severity="secondary" @click="$router.back()" />
      <i class="pi pi-sort-alt text-2xl" style="color: #3b4cb8"></i>
      <h1 class="text-3xl font-bold m-0" style="color: #3b4cb8">{{ t('requests.approval.title') }}</h1>
    </div>

    <div class="mb-3">
      <span class="text-lg text-600 font-medium">{{ t('requests.approval.mainList') }}</span>
    </div>

    <!-- Tabla -->
    <pv-data-table
      :value="store.requests"
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

      <pv-column field="type"         :header="t('requests.approval.table.requestType')" />
      <pv-column field="title"        :header="t('requests.approval.table.title')" />
      <pv-column field="employeeName" :header="t('requests.approval.table.employee')" />
      <pv-column field="startDate"    :header="t('requests.approval.table.requestDate')" />

      <!-- Acciones -->
      <pv-column header="" style="width: 90px;">
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

    <!-- Dialog Confirmar Aprobación -->
    <pv-dialog
      v-model:visible="approveVisible"
      :header="t('requests.approval.approveDialog.title')"
      :modal="true"
      :style="{ width: '520px' }"
    >
      <div class="flex gap-4 mb-3">
        <div class="flex flex-column gap-2 flex-1">
          <div><span class="font-medium">{{ t('requests.approval.fields.title') }}</span><p class="m-0 text-600">{{ selected?.title }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.fields.requestType') }}</span><p class="m-0 text-600">{{ selected?.type }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.fields.requestDate') }}</span><p class="m-0 text-600">{{ selected?.startDate }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.fields.reason') }}</span><p class="m-0 text-600">—</p></div>
        </div>
        <div class="flex flex-column align-items-center justify-content-start gap-2">
          <div
            class="border-circle"
            style="width: 72px; height: 72px; background-color: #3b4cb8;"
          ></div>
          <span class="text-sm text-600">{{ selected?.employeeName }}</span>
        </div>
      </div>

      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.fields.collaboratorComments') }}</label>
          <pv-textarea v-model="approveForm.collaboratorComments" rows="3" class="w-full" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.fields.otherDetails') }}</label>
          <pv-textarea v-model="approveForm.otherDetails" rows="3" class="w-full" />
        </div>
        <p class="font-medium text-sm m-0">{{ t('requests.approval.approveDialog.confirmMessage') }}</p>
      </div>

      <template #footer>
        <pv-button :label="t('requests.approval.approveDialog.confirm')" style="background-color:#3b4cb8; border-color:#3b4cb8;" @click="confirmApprove" :loading="store.loading" />
        <pv-button :label="t('requests.approval.cancel')" severity="secondary" text @click="approveVisible = false" />
      </template>
    </pv-dialog>

    <!-- Dialog Confirmar Rechazo -->
    <pv-dialog
      v-model:visible="rejectVisible"
      :header="t('requests.approval.rejectDialog.title')"
      :modal="true"
      :style="{ width: '520px' }"
    >
      <div class="flex gap-4 mb-3">
        <div class="flex flex-column gap-2 flex-1">
          <div><span class="font-medium">{{ t('requests.approval.rejectDialog.reason') }}</span><p class="m-0 text-600">{{ selected?.title }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.rejectDialog.placeholder') }}</span><p class="m-0 text-600">{{ selected?.type }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.rejectDialog.confirm') }}</span><p class="m-0 text-600">{{ selected?.startDate }}</p></div>
          <div><span class="font-medium">{{ t('requests.approval.cancel') }}</span><p class="m-0 text-600">—</p></div>
        </div>
        <div class="flex flex-column align-items-center justify-content-start gap-2">
          <div
            class="border-circle"
            style="width: 72px; height: 72px; background-color: #3b4cb8;"
          ></div>
          <span class="text-sm text-600">{{ selected?.employeeName }}</span>
        </div>
      </div>

      <div class="flex flex-column gap-3">
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.fields.collaboratorComments') }}</label>
          <pv-textarea v-model="rejectForm.collaboratorComments" rows="3" class="w-full" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.fields.otherDetails') }}</label>
          <pv-textarea v-model="rejectForm.otherDetails" rows="3" class="w-full" />
        </div>
        <div class="flex flex-column gap-1">
          <label class="font-medium text-sm">{{ t('requests.approval.rejectDialog.reason') }}</label>
          <pv-textarea
            v-model="rejectForm.rejectionReason"
            rows="3"
            class="w-full"
            :placeholder="t('requests.approval.rejectDialog.placeholder')"
          />
        </div>
      </div>

      <template #footer>
        <pv-button :label="t('requests.approval.rejectDialog.confirm')" severity="danger" @click="confirmReject" :loading="store.loading" />
        <pv-button :label="t('requests.approval.cancel')" severity="secondary" text @click="rejectVisible = false" />
      </template>
    </pv-dialog>
  </div>
</template>

