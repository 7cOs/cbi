import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from './my-performance-table-row.model';
import { PerformanceTotal, PerformanceTotalDTO } from './performance-total.model';
import { ViewType } from '../enums/view-type.enum';

export interface EntityResponsibilities {
  id: number;
  name: string;
  type: string;
  hierarchyType: string;
  description: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  employeeId?: string;
  propertyType?: EntityPropertyType;
}

export interface ResponsibilityEntityPerformanceDTO {
  id: number;
  name: string;
  performanceTotal: PerformanceTotalDTO;
}

export interface ResponsibilityEntityPerformance {
  id: number;
  name: string;
  performanceTotal: PerformanceTotal;
}

export interface FetchResponsibilityEntitiesPerformancePayload {
  entityType: EntityPeopleType,
  entities: EntityResponsibilities[],
  filter: MyPerformanceFilterState,
  performanceTotal: MyPerformanceTableRow,
  viewType: ViewType
}
