import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { PerformanceTotal, PerformanceTotalDTO } from '../models/performance-total.model';
import { ResponsibilityEntityPerformance, ResponsibilityEntityPerformanceDTO } from '../models/entity-responsibilities.model';
import { RoleGroupPerformanceTotal, RoleGroupPerformanceTotalDTO } from '../models/role-groups.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTotalTransformerService {

  constructor(private utilService: UtilService) { }

  public transformPerformanceTotalDTO(performanceTotalDTO: PerformanceTotalDTO): PerformanceTotal {
    return {
      total: performanceTotalDTO.total,
      totalYearAgo: performanceTotalDTO.totalYearAgo,
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceTotalDTO.total, performanceTotalDTO.totalYearAgo),
      contributionToVolume: performanceTotalDTO.contributionToVolume
    };
  }

  public transformRoleGroupPerformanceTotalDTO(roleGroupPerformanceArrayDTO: RoleGroupPerformanceTotalDTO[]): RoleGroupPerformanceTotal[] {
    return roleGroupPerformanceArrayDTO.map(roleGroupPerformance => {
      return {
        entityType: roleGroupPerformance.entityType,
        performanceTotal: {
          total: roleGroupPerformance.performanceTotal.total,
          totalYearAgo: roleGroupPerformance.performanceTotal.totalYearAgo,
          totalYearAgoPercent: this.utilService.getYearAgoPercent(
            roleGroupPerformance.performanceTotal.total,
            roleGroupPerformance.performanceTotal.totalYearAgo
          ),
          contributionToVolume: 0
        }
      };
    });
  }

  public transformResponsibilityEntitiesPerformanceDTO(entities: ResponsibilityEntityPerformanceDTO[]): ResponsibilityEntityPerformance[] {
    return entities.map((entity: ResponsibilityEntityPerformanceDTO) => {
      return Object.assign(entity, {
        performanceTotal: {
          total: entity.performanceTotal.total,
          totalYearAgo: entity.performanceTotal.totalYearAgo,
          totalYearAgoPercent: this.utilService.getYearAgoPercent(entity.performanceTotal.total, entity.performanceTotal.totalYearAgo),
          contributionToVolume: 0
        }
      });
    });
  }
}
