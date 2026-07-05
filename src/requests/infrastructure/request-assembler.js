import { RequestEntity } from '../domain/request.entity.js';

export const requestAssembler = {
  toDomain(raw, employees = []) {
    const employee = employees.find((e) => e.id === raw.employeeId);
    return new RequestEntity({
      id:              raw.id,
      employeeId:      raw.employeeId,
      employeeName:    employee?.name ?? '—',
      type:            raw.type,
      justification:   raw.justification ?? null,
      startDate:       raw.startDate ?? null,
      endDate:         raw.endDate ?? null,
      totalDays:       raw.totalDays ?? 0,
      timeFrameDate:   raw.timeFrameDate ?? null,
      startTime:       raw.startTime ?? null,
      endTime:         raw.endTime ?? null,
      totalHours:      raw.totalHours ?? 0,
      evidenceUrl:     raw.evidenceUrl ?? null,
      status:          raw.status,
      reviewerId:      raw.reviewerId ?? null,
      rejectionReason: raw.rejectionReason ?? null,
      createdAt:       raw.createdAt ?? null,
    });
  },

  toDomainList(rawList, employees = []) {
    return rawList.map((raw) => this.toDomain(raw, employees));
  },

  toApi(entity) {
    return {
      employeeId:    entity.employeeId,
      type:          entity.type,
      justification: entity.justification,
      startDate:     entity.startDate,
      endDate:       entity.endDate,
      totalDays:     entity.totalDays ?? 0,
      timeFrameDate: entity.timeFrameDate ?? null,
      startTime:     entity.startTime ?? null,
      endTime:       entity.endTime ?? null,
      totalHours:    entity.totalHours ?? 0,
      evidenceUrl:   entity.evidenceUrl,
    };
  },
};