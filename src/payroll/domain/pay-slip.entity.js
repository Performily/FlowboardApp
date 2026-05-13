export class PaySlip {
  constructor({ id, collaboratorId, collaboratorName, collaboratorCode, area, period, paymentType, grossIncome, deductions, status, issueDate, paymentDate }) {
    this.id = id;
    this.collaboratorId = collaboratorId;
    this.collaboratorName = collaboratorName; 
    this.collaboratorCode = collaboratorCode; 
    this.area = area; // 
    this.period = period; 
    this.paymentType = paymentType || 'Remuneración'; 
    this.grossIncome = Number(grossIncome) || 0; 
    this.deductions = Number(deductions) || 0;   
    this.status = status || 'Pendiente';      
    this.issueDate = issueDate || new Date().toISOString();
    this.paymentDate = paymentDate || null;
  }

  get netIncome() {
    const net = this.grossIncome - this.deductions;
    return net > 0 ? net : 0; 
  }

  get isPaid() {
    return this.status === 'Pagado';
  }

  get hasObservation() {
    return this.status === 'Con observación';
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', { 
      style: 'currency', 
      currency: 'PEN' 
    }).format(amount);
  }

}