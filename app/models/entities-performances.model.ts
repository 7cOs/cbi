import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

export interface EntitiesPerformancesDTO {
  id: string;
  name: string;
  positionDescription: string;
  performanceTotal: EntitiesTotalPerformancesDTO;
}

export interface EntitiesPerformances {
  positionId: string;
  contextPositionId?: string;
  name: string;
  positionDescription: string;
  performanceTotal: EntitiesTotalPerformances;
}
