export class RequestEntity {
  constructor({ id, employeeId, employeeName, type, title, startDate, endDate, status, collaboratorComments, otherDetails, rejectionReason }) {
    this.id                   = id;
    this.employeeId           = employeeId;
    this.employeeName         = employeeName ?? '—';
    this.type                 = type;
    this.title                = title;
    this.startDate            = startDate;
    this.endDate              = endDate;
    this.status               = status;
    this.collaboratorComments = collaboratorComments ?? null;
    this.otherDetails         = otherDetails ?? null;
    this.rejectionReason      = rejectionReason ?? null;
  }

  isPending()  { return this.status === 'Pendiente'; }
  isApproved() { return this.status === 'Aprobado';  }
  isRejected() { return this.status === 'Rechazado'; }
}