import { Action } from '@ngrx/store';

import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityResponsibilities } from '../../models/entity-responsibilities.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { ViewType } from '../../enums/view-type.enum';

export interface FetchResponsibilitiesSuccessPayload {
  positionId: string;
  groupedEntities: GroupedEntities;
  entitiesPerformances: EntitiesPerformances[];
}

export interface FetchResponsibilityEntitiesPerformancePayload {
  entityType: EntityPeopleType;
  entities: EntityResponsibilities[];
  filter: MyPerformanceFilterState;
  entitiesTotalPerformances: MyPerformanceTableRow;
  viewType: ViewType;
}

export const FETCH_RESPONSIBILITIES_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_ACTION';
export class FetchResponsibilitiesAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_ACTION;

  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export const FETCH_RESPONSIBILITIES_SUCCESS_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION';
export class FetchResponsibilitiesSuccessAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_SUCCESS_ACTION;

  constructor(public payload: FetchResponsibilitiesSuccessPayload) { }
}

export const FETCH_RESPONSIBILITIES_FAILURE_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION';
export class FetchResponsibilitiesFailureAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export const FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE = '[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE';
export class FetchResponsibilityEntityPerformance implements Action {
  readonly type = FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE;

  constructor(public payload: FetchResponsibilityEntitiesPerformancePayload) { }
}

export const FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS = '[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS';
export class FetchResponsibilityEntityPerformanceSuccess implements Action {
  readonly type = FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS;

  constructor(public payload: EntitiesPerformances[]) { }
}

export const GET_PEOPLE_BY_ROLE_GROUP_ACTION = '[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION';
export class GetPeopleByRoleGroupAction implements Action {
  readonly type = GET_PEOPLE_BY_ROLE_GROUP_ACTION;

  constructor(public payload: EntityPeopleType) { }
}

export const FETCH_PERFORMANCE_TOTAL_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION';
export class FetchPerformanceTotalAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_ACTION;

  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export const FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION';
export class FetchPerformanceTotalSuccessAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION;

  constructor(public payload: EntitiesTotalPerformances) { }
}

export const FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION';
export class FetchPerformanceTotalFailureAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export const SET_TABLE_ROW_PERFORMANCE_TOTAL = '[Performance Total] SET_TABLE_ROW_PERFORMANCE_TOTAL';
export class SetTableRowPerformanceTotal implements Action {
  readonly type = SET_TABLE_ROW_PERFORMANCE_TOTAL;

  constructor(public payload: MyPerformanceTableRow) { }
}

export type Action
  = FetchResponsibilitiesAction
  | FetchResponsibilitiesSuccessAction
  | FetchResponsibilitiesFailureAction
  | GetPeopleByRoleGroupAction
  | FetchResponsibilityEntityPerformance
  | FetchResponsibilityEntityPerformanceSuccess
  | FetchPerformanceTotalAction
  | FetchPerformanceTotalSuccessAction
  | FetchPerformanceTotalFailureAction
  | SetTableRowPerformanceTotal;
