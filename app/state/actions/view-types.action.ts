import { Action } from '@ngrx/store';
import { ViewType } from '../../enums/view-type.enum';

export const SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE = '[View Types] SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE';
export class SetLeftMyPerformanceTableViewType implements Action {
  readonly type = SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE;

  constructor(public payload: ViewType) { }
}

export const SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE = '[View Types] SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE';
export class SetRightMyPerformanceTableViewType implements Action {
  readonly type = SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE;

  constructor(public payload: ViewType) { }
}

export type Action = SetLeftMyPerformanceTableViewType | SetRightMyPerformanceTableViewType;
