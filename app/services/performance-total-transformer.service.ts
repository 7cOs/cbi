import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { PerformanceTotal, PerformanceTotalDTO } from '../models/performance-total.model';
import { ResponsibilityEntityPerformance, ResponsibilityEntityPerformanceDTO } from '../models/entity-responsibilities.model';
import { UtilService } from './util.service';

@Injectable()
export class PerformanceTotalTransformerService {

  constructor(private utilService: UtilService) { }

  public transformPerformanceTotalDTO(performanceTotalDTO: PerformanceTotalDTO): PerformanceTotal {
    return Object.assign({}, performanceTotalDTO, {
      totalYearAgoPercent: this.utilService.getYearAgoPercent(performanceTotalDTO.total, performanceTotalDTO.totalYearAgo),
      contributionToVolume: 0
    });
  }

  public transformEntityPerformanceTotalDTO(entities: ResponsibilityEntityPerformanceDTO[]): ResponsibilityEntityPerformance[] {
    return entities.map((entity: ResponsibilityEntityPerformanceDTO) => {
      return Object.assign({}, entity, {
        performanceTotal: this.transformPerformanceTotalDTO(entity.performanceTotal)
      });
    });
  }
}
