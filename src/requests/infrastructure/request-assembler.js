import { RequestEntity } from '../domain/request.entity.js';

export const requestAssembler = {
  toDomain(raw, employees = []) {
    const employee = employees.find((e) => e.id === raw.employeeId);
    return new RequestEntity({
      id:                   raw.id,
      employeeId:           raw.employeeId,
      employeeName:         employee?.name ?? '—',
      type:                 raw.type,
      title:                raw.title,
      startDate:            raw.startDate,
      endDate:              raw.endDate,
      status:               raw.status,
      collaboratorComments: raw.collaboratorComments ?? null,
      otherDetails:         raw.otherDetails ?? null,
      rejectionReason:      raw.rejectionReason ?? null,
    });
  },

  toDomainList(rawList, employees = []) {
    return rawList.map((raw) => this.toDomain(raw, employees));
  },

  toApi(entity) {
    return {
      employeeId:           entity.employeeId,
      type:                 entity.type,
      title:                entity.title,
      startDate:            entity.startDate,
      endDate:              entity.endDate,
      status:               entity.status ?? 'Pendiente',
      collaboratorComments: entity.collaboratorComments ?? null,
      otherDetails:         entity.otherDetails ?? null,
      rejectionReason:      entity.rejectionReason ?? null,
    };
  },
};