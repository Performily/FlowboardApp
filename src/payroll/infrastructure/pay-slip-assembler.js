import { PaySlip } from '../domain/pay-slip.entity.js';

export const PaySlipAssembler = {
  assemble(apiData) {
    if (!apiData) return null;

    return new PaySlip({
      id: apiData.id,
      collaboratorId: apiData.collaborator_id || apiData.collaboratorId,
      collaboratorName: apiData.collaborator_name || apiData.collaboratorName,
      collaboratorCode: apiData.collaborator_code || apiData.collaboratorCode,
      area: apiData.area,
      period: apiData.period,
      paymentType: apiData.payment_type || apiData.paymentType,
      grossIncome: apiData.gross_income || apiData.grossIncome,
      deductions: apiData.deductions,
      status: apiData.status,
      issueDate: apiData.issue_date || apiData.issueDate,
      paymentDate: apiData.payment_date || apiData.paymentDate
    });
  },

  assembleCollection(apiDataList) {
    if (!Array.isArray(apiDataList)) return [];
    
    return apiDataList.map(item => this.assemble(item));
  }
};