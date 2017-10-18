import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
import { HierarchyGroup } from './responsibilities.service';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTransformerService {

  constructor(private utilService: UtilService) { }

  public transformPerformanceDTO(performanceDTO: PerformanceDTO): Performance {
    return performanceDTO ? {
      total: Math.round(performanceDTO.total),
      totalYearAgo: this.utilService.getYearAgoDelta(performanceDTO.total, performanceDTO.totalYearAgo),
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceDTO.total, performanceDTO.totalYearAgo),
      contributionToVolume: 0,
      error: false
    } : {
      total: 0,
      totalYearAgo: 0,
      totalYearAgoPercent: 0,
      contributionToVolume: 0,
      error: true
    };
  }

  public transformEntityWithPerformanceDTO(entity: EntityWithPerformanceDTO): EntityWithPerformance {
    return {
      positionId: entity.id,
      name: entity.name,
      entityType: EntityType[entity.positionDescription],
      performance: this.transformPerformanceDTO(entity.performance)
    };
  }

  public transformEntityWithPerformance(performanceDTO: PerformanceDTO, entity: HierarchyEntity): EntityWithPerformance {
    return {
      positionId: entity.positionId,
      name: entity.name,
      entityType: EntityType[entity.entityType],
      performance: this.transformPerformanceDTO(performanceDTO)
    };
  }

  public transformHierarchyGroupPerformance(performanceDTO: PerformanceDTO, group: HierarchyGroup, positionId: string)
  : EntityWithPerformance {
    const entityWithPerformance: EntityWithPerformance = {
      positionId: positionId,
      name: group.name,
      entityType: group.entityType,
      positionDescription: group.positionDescription,
      entityTypeCode: group.type,
      performance: this.transformPerformanceDTO(performanceDTO)
    };

    if (group.alternateHierarchyId) entityWithPerformance.alternateHierarchyId = group.alternateHierarchyId;

    return entityWithPerformance;
  }
}
