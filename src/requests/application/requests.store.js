import { defineStore } from 'pinia';
import { ref } from 'vue';
import { requestsApi } from '../infrastructure/requests-api.js';
import { requestAssembler } from '../infrastructure/request-assembler.js';

export const useRequestsStore = defineStore('requests', () => {
  const requests = ref([]);
  const loading  = ref(false);
  const error    = ref(null);

  async function fetchAll() {
    loading.value = true;
    error.value   = null;
    try {
      const { requests: raw, employees } = await requestsApi.getAll();
      requests.value = requestAssembler.toDomainList(raw, employees);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function createRequest(payload) {
    loading.value = true;
    error.value   = null;
    try {
      const raw    = await requestsApi.create({ ...payload, status: 'Pendiente', collaboratorComments: null, otherDetails: null, rejectionReason: null });
      const entity = requestAssembler.toDomain(raw);
      requests.value.push(entity);
      return entity;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function approveRequest(id, { collaboratorComments, otherDetails }) {
    await _updateRequest(id, {
      status: 'Aprobado',
      collaboratorComments: collaboratorComments ?? null,
      otherDetails:         otherDetails ?? null,
      rejectionReason:      null,
    });
  }

  async function rejectRequest(id, { collaboratorComments, otherDetails, rejectionReason }) {
    await _updateRequest(id, {
      status: 'Rechazado',
      collaboratorComments: collaboratorComments ?? null,
      otherDetails:         otherDetails ?? null,
      rejectionReason:      rejectionReason ?? null,
    });
  }

  async function _updateRequest(id, patch) {
    loading.value = true;
    error.value   = null;
    try {
      const raw     = await requestsApi.updateRequest(id, patch);
      const index   = requests.value.findIndex((r) => r.id === id);
      if (index !== -1) {
        requests.value[index] = requestAssembler.toDomain({
          ...raw,
          employeeId: requests.value[index].employeeId,
        }, [{ id: requests.value[index].employeeId, name: requests.value[index].employeeName }]);
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRequest(id) {
    loading.value = true;
    error.value   = null;
    try {
      await requestsApi.delete(id);
      requests.value = requests.value.filter((r) => r.id !== id);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    requests, loading, error,
    fetchAll, createRequest, approveRequest, rejectRequest, deleteRequest,
  };
});