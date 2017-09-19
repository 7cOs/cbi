import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTransformerService {

  constructor(private utilService: UtilService) { }

  public transformEntitiesTotalPerformancesDTO(performanceDTO: EntitiesTotalPerformancesDTO): EntitiesTotalPerformances {
    return {
      total: parseInt((performanceDTO.total).toFixed(), 10),
      totalYearAgo: this.utilService.getYearAgoDelta(performanceDTO.total, performanceDTO.totalYearAgo),
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceDTO.total, performanceDTO.totalYearAgo),
      contributionToVolume: 0
    };
  }

  public transformEntitiesPerformancesDTO(entities: EntitiesPerformancesDTO[]): EntitiesPerformances[] {
    return entities.map((entity: EntitiesPerformancesDTO) => {
      return {
        positionId: entity.id,
        name: entity.name,
        performanceTotal: this.transformEntitiesTotalPerformancesDTO(entity.performanceTotal)
      };
    });
  }
}