import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { PayrollApi } from "../infrastructure/payroll-api.js";
import { PaySlipAssembler } from "../infrastructure/pay-slip-assembler.js";

const payrollApi = new PayrollApi();

const usePayrollStore = defineStore('payroll', () => {

    const paySlips = ref([]);
    
    const errors = ref([]);
    
    const paySlipsLoaded = ref(false);

    const paySlipsCount = computed(() => {
        return paySlipsLoaded.value ? paySlips.value.length : 0;
    });


    function fetchPaySlips(filters = {}) {
        payrollApi.getPaySlips(filters).then(response => {
            paySlips.value = PaySlipAssembler.toEntitiesFromResponse(response);
            paySlipsLoaded.value = true;
            errors.value = []; 
        }).catch(error => {
            console.error('Error fetching pay slips:', error);
            errors.value.push(error);
        });
    }

    function downloadPaySlip(id) {
        payrollApi.downloadPaySlipPdf(id).then(response => {
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            link.href = url;
            link.setAttribute('download', `boleta_pago_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            // Limpieza de memoria
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            errors.value = [];
        }).catch(error => {
            console.error(`Error downloading pay slip ${id}:`, error);
            errors.value.push(new Error('No se pudo descargar la boleta. Intente nuevamente.'));
        });
    }

    function getPaySlipById(id) {
        let idNum = parseInt(id);
        return paySlips.value.find(slip => slip.id === idNum);
    }

    return {
        paySlips,
        errors,
        paySlipsLoaded,
        paySlipsCount,
        fetchPaySlips,
        downloadPaySlip,
        getPaySlipById
    };
});

export default usePayrollStore;