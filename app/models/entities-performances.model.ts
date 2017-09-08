import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

export interface EntitiesPerformancesDTO {
  id: string;
  name: string;
  performanceTotal: EntitiesTotalPerformancesDTO;
}

export interface EntitiesPerformances {
  positionId: string;
  name: string;
  performanceTotal: EntitiesTotalPerformances;
}
