import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

export interface EntitiesPerformancesDTO {
  id: string;
  name: string;
  positionDescription?: string;
  entityTypeCode?: string;
  performanceTotal: EntitiesTotalPerformancesDTO;
}

export interface EntitiesPerformances {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  name: string;
  positionDescription?: string;
  performanceTotal: EntitiesTotalPerformances;
}
