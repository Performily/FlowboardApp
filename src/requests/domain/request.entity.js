export class RequestEntity {
  constructor({
    id, employeeId, employeeName, type, justification,
    startDate, endDate, totalDays,
    timeFrameDate, startTime, endTime, totalHours,
    evidenceUrl, status, reviewerId, rejectionReason, createdAt,
  }) {
    this.id              = id;
    this.employeeId      = employeeId;
    this.employeeName    = employeeName ?? '—';
    this.type            = type;
    this.justification   = justification ?? null;
    this.startDate       = startDate ?? null;
    this.endDate         = endDate ?? null;
    this.totalDays       = totalDays ?? 0;
    this.timeFrameDate   = timeFrameDate ?? null;
    this.startTime       = startTime ?? null;
    this.endTime         = endTime ?? null;
    this.totalHours      = totalHours ?? 0;
    this.evidenceUrl     = evidenceUrl ?? null;
    this.status          = status;
    this.reviewerId      = reviewerId ?? null;
    this.rejectionReason = rejectionReason ?? null;
    this.createdAt       = createdAt ?? null;
  }

  isPending()  { return this.status === 'Pending';  }
  isApproved() { return this.status === 'Approved'; }
  isRejected() { return this.status === 'Rejected'; }
  isCanceled() { return this.status === 'Canceled'; }
}