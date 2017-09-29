import { Action } from '@ngrx/store';

import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { Performance } from '../../models/performance.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { ViewType } from '../../enums/view-type.enum';

export interface FetchResponsibilitiesSuccessPayload {
  positionId: string;
  groupedEntities: GroupedEntities;
  entityWithPerformance: EntityWithPerformance[];
}

export interface FetchEntityWithPerformancePayload {
  entityType: EntityPeopleType;
  entities: HierarchyEntity[];
  filter: MyPerformanceFilterState;
  selectedPositionId: string;
  viewType: ViewType;
}

export interface FetchSubAccountsActionPayload {
  positionId: string;
  contextPositionId: string;
  entityType: string;
  selectedPositionId: string;
  filter: MyPerformanceFilterState;
}

export interface FetchSubAccountsSuccessPayload {
  groupedEntities: GroupedEntities;
  entityWithPerformance: EntityWithPerformance[];
}

export const FETCH_RESPONSIBILITIES = '[Responsibilities] FETCH_RESPONSIBILITIES';
export class FetchResponsibilities implements Action {
  readonly type = FETCH_RESPONSIBILITIES;

  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export const FETCH_RESPONSIBILITIES_SUCCESS = '[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS';
export class FetchResponsibilitiesSuccess implements Action {
  readonly type = FETCH_RESPONSIBILITIES_SUCCESS;

  constructor(public payload: FetchResponsibilitiesSuccessPayload) { }
}

export const FETCH_RESPONSIBILITIES_FAILURE = '[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE';
export class FetchResponsibilitiesFailure implements Action {
  readonly type = FETCH_RESPONSIBILITIES_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_ENTITIES_PERFORMANCES = '[Responsibilities] FETCH_ENTITIES_PERFORMANCES';
export class FetchEntityWithPerformance implements Action {
  readonly type = FETCH_ENTITIES_PERFORMANCES;

  constructor(public payload: FetchEntityWithPerformancePayload) { }
}

export const FETCH_ENTITIES_PERFORMANCES_SUCCESS = '[Responsibilities] FETCH_ENTITIES_PERFORMANCES_SUCCESS';
export class FetchEntityWithPerformanceSuccess implements Action {
  readonly type = FETCH_ENTITIES_PERFORMANCES_SUCCESS;

  constructor(public payload: EntityWithPerformance[]) { }
}

export const GET_PEOPLE_BY_ROLE_GROUP_ACTION = '[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION';
export class GetPeopleByRoleGroupAction implements Action {
  readonly type = GET_PEOPLE_BY_ROLE_GROUP_ACTION;

  constructor(public payload: EntityPeopleType) { }
}

export const FETCH_SUBACCOUNTS_ACTION = '[Responsibilities] FETCH_SUBACCOUNTS_ACTION';
export class FetchSubAccountsAction implements Action {
  readonly type = FETCH_SUBACCOUNTS_ACTION;

  constructor(public payload: FetchSubAccountsActionPayload) { }
}

export const FETCH_SUBACCOUNTS_SUCCESS_ACTION = '[Responsibilities] FETCH_SUBACCOUNTS_SUCCESS_ACTION';
export class FetchSubAccountsSuccessAction implements Action {
  readonly type = FETCH_SUBACCOUNTS_SUCCESS_ACTION;

  constructor(public payload: FetchSubAccountsSuccessPayload) { }
}

export const FETCH_TOTAL_PERFORMANCE = '[Performance Total] FETCH_TOTAL_PERFORMANCE';
export class FetchTotalPerformance implements Action {
  readonly type = FETCH_TOTAL_PERFORMANCE;

  constructor(public payload: { positionId: string, filter: MyPerformanceFilterState }) { }
}

export const FETCH_TOTAL_PERFORMANCE_SUCCESS = '[Performance Total] FETCH_TOTAL_PERFORMANCE_SUCCESS';
export class FetchTotalPerformanceSuccess implements Action {
  readonly type = FETCH_TOTAL_PERFORMANCE_SUCCESS;

  constructor(public payload: Performance) { }
}

export const FETCH_TOTAL_PERFORMANCE_FAILURE = '[Performance Total] FETCH_TOTAL_PERFORMANCE_FAILURE';
export class FetchTotalPerformanceFailure implements Action {
  readonly type = FETCH_TOTAL_PERFORMANCE_FAILURE;

  constructor(public payload: Error) { }
}

export const SET_TOTAL_PERFORMANCE = '[Performance Total] SET_TOTAL_PERFORMANCE';
export class SetTotalPerformance implements Action {
  readonly type = SET_TOTAL_PERFORMANCE;

  constructor(public payload: string) { }
}

export type Action
  = FetchResponsibilities
  | FetchResponsibilitiesSuccess
  | FetchResponsibilitiesFailure
  | FetchEntityWithPerformance
  | FetchEntityWithPerformanceSuccess
  | GetPeopleByRoleGroupAction
  | FetchSubAccountsAction
  | FetchSubAccountsSuccessAction
  | FetchTotalPerformance
  | FetchTotalPerformanceSuccess
  | FetchTotalPerformanceFailure
  | SetTotalPerformance;
