// file: src/payroll/infrastructure/pay-slip-assembler.js
import { PaySlip } from '../domain/pay-slip.entity.js';

export class PaySlipAssembler {

  static toEntityFromResource(resource) {
    if (!resource) return null;

    return new PaySlip({
      id: resource.id,
      collaboratorId: resource.collaboratorId || resource.collaborator_id,
      collaboratorName: resource.collaboratorName || resource.collaborator_name,
      collaboratorCode: resource.collaboratorCode || resource.collaborator_code,
      area: resource.area,
      period: resource.period,
      paymentType: resource.paymentType || resource.payment_type,
      grossIncome: resource.grossIncome || resource.gross_income,
      deductions: resource.deductions,
      status: resource.status,
      issueDate: resource.issueDate || resource.issue_date,
      paymentDate: resource.paymentDate || resource.payment_date
    });
  }

  static toEntitiesFromResponse(response) {

    if (response.status !== 200) {
      console.error(`${response.status}, ${response.statusText}`);
      return [];
    }


    let resources = response.data instanceof Array ? response.data : response.data['paySlips'];

    if (!resources) return [];

    return resources.map(resource => this.toEntityFromResource(resource));
  }
}