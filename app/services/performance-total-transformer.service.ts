import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTotalTransformerService {

  constructor(private utilService: UtilService) { }

  public transformEntitiesTotalPerformancesDTO(entitiesTotalPerformancesDTO: EntitiesTotalPerformancesDTO): EntitiesTotalPerformances {
    return Object.assign({}, entitiesTotalPerformancesDTO, {
      totalYearAgoPercent: this.utilService
        .getYearAgoPercent(entitiesTotalPerformancesDTO.total, entitiesTotalPerformancesDTO.totalYearAgo),
      contributionToVolume: 0
    });
  }

  public transformEntityEntitiesTotalPerformancesDTO(entities: EntitiesPerformancesDTO[]): EntitiesPerformances[] {
    return entities.map((entity: EntitiesPerformancesDTO) => {
      return {
        positionId: entity.id,
        name: entity.name,
        performanceTotal: this.transformEntitiesTotalPerformancesDTO(entity.performanceTotal)
      };
    });
  }
}
