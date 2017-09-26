import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTransformerService {

  constructor(private utilService: UtilService) { }

  public transformPerformanceDTO(performanceDTO: PerformanceDTO): Performance {
    return {
      total: Math.round(performanceDTO.total),
      totalYearAgo: this.utilService.getYearAgoDelta(performanceDTO.total, performanceDTO.totalYearAgo),
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceDTO.total, performanceDTO.totalYearAgo),
      contributionToVolume: 0
    };
  }

  public transformEntityWithPerformanceDTOs(entities: EntityWithPerformanceDTO[]): EntityWithPerformance[] {
    return entities.map((entity: EntityWithPerformanceDTO) => {
      return {
        positionId: entity.id,
        name: entity.name,
        positionDescription: entity.positionDescription,
        performance: this.transformPerformanceDTO(entity.performance)
      };
    });
  }

  public transformEntityWithPerformanceDTO(entity: EntityWithPerformanceDTO): EntityWithPerformance {
    return {
      positionId: entity.id,
      name: entity.name,
      performance: this.transformPerformanceDTO(entity.performance)
    };
  }

  public transformEntityWithPerformance(
    performanceDTO: PerformanceDTO,
    entity: HierarchyEntity): EntityWithPerformance {

    return {
      positionId: entity.positionId,
      name: entity.name,
      performance: this.transformPerformanceDTO(performanceDTO)
    };
  }
}
