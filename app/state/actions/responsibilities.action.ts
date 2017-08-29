import { Action } from '@ngrx/store';

import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilitiesSuccessPayload } from '../../models/role-groups.model';
import { FetchResponsibilityEntitiesPerformancePayload } from '../../models/entity-responsibilities.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';

export const FETCH_RESPONSIBILITIES_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_ACTION';
export class FetchResponsibilitiesAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_ACTION;

  constructor(public payload: { positionId: number, filter: MyPerformanceFilterState }) { }
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

  constructor(public payload: ResponsibilityEntityPerformance[]) { }
}

export const GET_PEOPLE_BY_ROLE_GROUP_ACTION = '[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION';
export class GetPeopleByRoleGroupAction implements Action {
  readonly type = GET_PEOPLE_BY_ROLE_GROUP_ACTION;

  constructor(public payload: EntityPeopleType) { }
}

export type Action
  = FetchResponsibilitiesAction
  | FetchResponsibilitiesSuccessAction
  | FetchResponsibilitiesFailureAction
  | GetPeopleByRoleGroupAction
  | FetchResponsibilityEntityPerformance
  | FetchResponsibilityEntityPerformanceSuccess;
