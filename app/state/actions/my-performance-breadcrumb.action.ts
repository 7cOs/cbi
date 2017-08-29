import { Action } from '@ngrx/store';

export const ADD_BREADCRUMB_ENTITY = '[Breadcrumb] ADD_BREADCRUMB_ENTITY';
export class AddBreadcrumbEntity implements Action {
  readonly type = ADD_BREADCRUMB_ENTITY;

  constructor(public payload: string) { }
}

export const REMOVE_BREADCRUMB_ENTITIES = '[Breadcrumb] REMOVE_BREADCRUMB_ENTITIES';
export class RemoveBreadcrumbEntities implements Action {
    readonly type = REMOVE_BREADCRUMB_ENTITIES;

    constructor(public payload: number) { }
}

export const RESET_BREADCRUMB_TRAIL = '[Breadcrumb] RESET_BREADCRUMB_TRAIL';
export class ResetBreadcrumbTrail implements Action {
    readonly type = RESET_BREADCRUMB_TRAIL;
}

export type Action = AddBreadcrumbEntity
| RemoveBreadcrumbEntities
| ResetBreadcrumbTrail;
