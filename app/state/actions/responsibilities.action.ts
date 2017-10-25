import { Action } from '@ngrx/store';

import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { HierarchyGroup } from '../../models/hierarchy-group.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { Performance } from '../../models/performance.model';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';

export interface FetchResponsibilitiesPayload {
  positionId: string;
  filter: MyPerformanceFilterState;
  brandCode?: string;
}

export interface FetchResponsibilitiesSuccessPayload {
  positionId: string;
  groupedEntities: GroupedEntities;
  hierarchyGroups: Array<HierarchyGroup>;
  entityWithPerformance: EntityWithPerformance[];
}

export interface FetchEntityWithPerformancePayload {
  entityTypeGroupName: EntityPeopleType;
  entityTypeCode: string;
  entities: HierarchyEntity[];
  filter: MyPerformanceFilterState;
  positionId: string;
  entityType: EntityType;
  brandCode?: string;
}

export interface FetchEntityWithPerformanceSuccessPayload {
  entityWithPerformance: EntityWithPerformance[];
  entityTypeCode: string;
}

export interface RefreshAllPerformancesPayload {
  positionId: string;
  groupedEntities: GroupedEntities;
  hierarchyGroups: Array<HierarchyGroup>;
  selectedEntityType: EntityType;
  selectedEntityTypeCode: string;
  salesHierarchyViewType: SalesHierarchyViewType;
  filter: MyPerformanceFilterState;
  brandCode?: string;
  entityType?: EntityType;
}

export interface RefreshAllPerformancesSuccesPayload {

}

export interface FetchSubAccountsPayload {
  positionId: string;
  contextPositionId: string;
  entityTypeAccountName: string;
  selectedPositionId: string;
  filter: MyPerformanceFilterState;
}

export interface FetchSubAccountsSuccessPayload {
  groupedEntities: GroupedEntities;
  entityWithPerformance: EntityWithPerformance[];
}

export interface FetchAlternateHierarchyResponsibilitiesPayload {
  positionId: string;
  alternateHierarchyId: string;
  filter: MyPerformanceFilterState;
}

export const FETCH_RESPONSIBILITIES = '[Responsibilities] FETCH_RESPONSIBILITIES';
export class FetchResponsibilities implements Action {
  readonly type = FETCH_RESPONSIBILITIES;

  constructor(public payload: FetchResponsibilitiesPayload) { }
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

  constructor(public payload: FetchEntityWithPerformanceSuccessPayload) { }
}

export const REFRESH_ALL_PERFORMANCES = '[Responsibilities] REFRESH_ALL_PERFORMANCES';
export class RefreshAllPerformances implements Action {
  readonly type = REFRESH_ALL_PERFORMANCES;

  constructor(public payload: RefreshAllPerformancesPayload) { }
}

export const REFRESH_ALL_PERFORMANCES_SUCCESS = '[Responsibilities] REFRESH_ALL_PERFORMANCES_SUCCESS';
export class RefreshAllPerformancesSuccess implements Action {
  readonly type = REFRESH_ALL_PERFORMANCES;

  constructor(public payload: RefreshAllPerformancesSuccesPayload) { }
}

export const GET_PEOPLE_BY_ROLE_GROUP = '[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP';
export class GetPeopleByRoleGroup implements Action {
  readonly type = GET_PEOPLE_BY_ROLE_GROUP;

  constructor(public payload: EntityPeopleType) { }
}

export const FETCH_SUBACCOUNTS = '[Responsibilities] FETCH_SUBACCOUNTS';
export class FetchSubAccounts implements Action {
  readonly type = FETCH_SUBACCOUNTS;

  constructor(public payload: FetchSubAccountsPayload) { }
}

export const FETCH_SUBACCOUNTS_SUCCESS = '[Responsibilities] FETCH_SUBACCOUNTS_SUCCESS';
export class FetchSubAccountsSuccess implements Action {
  readonly type = FETCH_SUBACCOUNTS_SUCCESS;

  constructor(public payload: FetchSubAccountsSuccessPayload) { }
}

export const SET_ALTERNATE_HIERARCHY_ID = '[Responsibilities] SET_ALTERNATE_HIERARCHY_ID';
export class SetAlternateHierarchyId implements Action {
  readonly type = SET_ALTERNATE_HIERARCHY_ID;

  constructor(public payload: string) { }
}

export const FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES = '[Responsibilities] FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES';
export class FetchAlternateHierarchyResponsibilities implements Action {
  readonly type = FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES;

  constructor(public payload: FetchAlternateHierarchyResponsibilitiesPayload) { }
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

export const SET_TOTAL_PERFORMANCE_FOR_SELECTED_ROLE_GROUP = '[Performance Total] SET_TOTAL_PERFORMANCE_FOR_SELECTED_ROLE_GROUP';
export class SetTotalPerformanceForSelectedRoleGroup implements Action {
  readonly type = SET_TOTAL_PERFORMANCE_FOR_SELECTED_ROLE_GROUP;

  constructor(public payload: string) { }
}

export type Action
  = FetchResponsibilities
  | FetchResponsibilitiesSuccess
  | FetchResponsibilitiesFailure
  | FetchEntityWithPerformance
  | FetchEntityWithPerformanceSuccess
  | GetPeopleByRoleGroup
  | FetchSubAccounts
  | FetchSubAccountsSuccess
  | SetAlternateHierarchyId
  | FetchAlternateHierarchyResponsibilities
  | FetchTotalPerformance
  | FetchTotalPerformanceSuccess
  | FetchTotalPerformanceFailure
  | SetTotalPerformance
  | SetTotalPerformanceForSelectedRoleGroup;
