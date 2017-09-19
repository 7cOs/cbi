import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

export interface EntitiesPerformancesDTO {
  id: string;
  name: string;
  subName: string;
  performanceTotal: EntitiesTotalPerformancesDTO;
}

export interface EntitiesPerformances {
  positionId: string;
  name: string;
  subName: string;
  performanceTotal: EntitiesTotalPerformances;
}
