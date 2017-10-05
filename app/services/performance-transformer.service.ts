import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
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

  public transformEntityWithPerformanceDTOs(entities: EntityWithPerformanceDTO[]): EntityWithPerformance[] {
    return entities.map((entity: EntityWithPerformanceDTO) => {
      return {
        positionId: entity.id,
        entityTypeCode: entity.entityTypeCode,
        name: entity.name,
        entityType: EntityType[entity.entityType],
        positionDescription: entity.positionDescription,
        performance: this.transformPerformanceDTO(entity.performance)
      };
    });
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
}
