import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTransformerService {

  constructor(private utilService: UtilService) { }

  public transformEntitiesTotalPerformancesDTO(performanceDTO: EntitiesTotalPerformancesDTO): EntitiesTotalPerformances {
    return {
      total: Math.round(performanceDTO.total),
      totalYearAgo: this.utilService.getYearAgoDelta(performanceDTO.total, performanceDTO.totalYearAgo),
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceDTO.total, performanceDTO.totalYearAgo),
      contributionToVolume: 0
    };
  }

  public transformEntitiesPerformancesDTOs(entities: EntitiesPerformancesDTO[]): EntitiesPerformances[] {
    return entities.map((entity: EntitiesPerformancesDTO) => {
      return {
        positionId: entity.id,
        name: entity.name,
        performanceTotal: this.transformEntitiesTotalPerformancesDTO(entity.performanceTotal)
      };
    });
  }

  public transformEntitiesPerformancesDTO(entity: EntitiesPerformancesDTO): EntitiesPerformances {
    return {
      positionId: entity.id,
      name: entity.name,
      performanceTotal: this.transformEntitiesTotalPerformancesDTO(entity.performanceTotal)
    };
  }

  public transformEntityWithPerformance(
    performanceDTO: EntitiesTotalPerformancesDTO,
    entity: EntityResponsibilities): EntitiesPerformances {

    return {
      positionId: entity.positionId,
      name: entity.name,
      performanceTotal: this.transformEntitiesTotalPerformancesDTO(performanceDTO)
    };
  }
}
