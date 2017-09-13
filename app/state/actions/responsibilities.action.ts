import { Action } from '@ngrx/store';

import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityResponsibilities } from '../../models/entity-responsibilities.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
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

export interface FetchSubAccountsActionPayload {
  accountId: string;
  positionId: string;
  premiseType: PremiseTypeValue;
}

export const FETCH_RESPONSIBILITIES_ACTION =                   '[Responsibilities] FETCH_RESPONSIBILITIES_ACTION';
export const FETCH_RESPONSIBILITIES_SUCCESS_ACTION =           '[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION';
export const FETCH_RESPONSIBILITIES_FAILURE_ACTION =           '[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION';
export const FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE =         '[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE';
export const FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS = '[Responsibilities] FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS';
export const GET_PEOPLE_BY_ROLE_GROUP_ACTION =                 '[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION';
export const FETCH_SUBACCOUNTS_ACTION =                        '[Responsibilities] FETCH_SUBACCOUNTS_ACTION';
export const FETCH_SUBACCOUNTS_SUCCESS_ACTION =                '[Responsibilities] FETCH_SUBACCOUNTS_SUCCESS_ACTION';
export const FETCH_PERFORMANCE_TOTAL_ACTION =                  '[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION';
export const FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION =          '[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION';
export const FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION =          '[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION';
export const SET_TABLE_ROW_PERFORMANCE_TOTAL =                 '[Performance Total] SET_TABLE_ROW_PERFORMANCE_TOTAL';

export class FetchResponsibilitiesAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_ACTION;
  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export class FetchResponsibilitiesSuccessAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_SUCCESS_ACTION;
  constructor(public payload: FetchResponsibilitiesSuccessPayload) { }
}

export class FetchResponsibilitiesFailureAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_FAILURE_ACTION;
  constructor(public payload: Error) { }
}

export class FetchResponsibilityEntityPerformance implements Action {
  readonly type = FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE;
  constructor(public payload: FetchResponsibilityEntitiesPerformancePayload) { }
}

export class FetchResponsibilityEntityPerformanceSuccess implements Action {
  readonly type = FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS;
  constructor(public payload: EntitiesPerformances[]) { }
}

export class GetPeopleByRoleGroupAction implements Action {
  readonly type = GET_PEOPLE_BY_ROLE_GROUP_ACTION;
  constructor(public payload: EntityPeopleType) { }
}

export class FetchSubAccountsAction implements Action {
  readonly type = FETCH_SUBACCOUNTS_ACTION;
  constructor(public payload: FetchSubAccountsActionPayload) { }
}

export class FetchSubAccountsSuccessAction implements Action {
  readonly type = FETCH_SUBACCOUNTS_SUCCESS_ACTION;
  constructor(public payload: any[]) { }
}

export class FetchPerformanceTotalAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_ACTION;
  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export class FetchPerformanceTotalSuccessAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION;
  constructor(public payload: EntitiesTotalPerformances) { }
}

export class FetchPerformanceTotalFailureAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION;
  constructor(public payload: Error) { }
}

export class SetTableRowPerformanceTotal implements Action {
  readonly type = SET_TABLE_ROW_PERFORMANCE_TOTAL;
  constructor(public payload: MyPerformanceTableRow) { }
}

export type Action
  = FetchResponsibilitiesAction
  | FetchResponsibilitiesSuccessAction
  | FetchResponsibilitiesFailureAction
  | FetchResponsibilityEntityPerformance
  | FetchResponsibilityEntityPerformanceSuccess
  | GetPeopleByRoleGroupAction
  | FetchSubAccountsAction
  | FetchPerformanceTotalAction
  | FetchPerformanceTotalSuccessAction
  | FetchPerformanceTotalFailureAction
  | SetTableRowPerformanceTotal;
