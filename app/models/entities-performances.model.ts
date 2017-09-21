import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

export interface EntitiesPerformancesDTO {
  id: string;
  name: string;
  performanceTotal: EntitiesTotalPerformancesDTO;
}

export interface EntitiesPerformances {
  positionId: string;
  contextPositionId?: string;
  name: string;
  performanceTotal: EntitiesTotalPerformances;
}
