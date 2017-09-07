import { Action } from '@ngrx/store';

import { initialState as initialStatePerformanceTotal } from './performance-total.reducer';
import { initialState as initialStateResponsibilities } from './responsibilities.reducer';
import { initialState as initialStateViewTypes } from './view-types.reducer';
import { initialStateVersions } from './my-performance-version.reducer';
import * as MyPerformanceActions from '../actions/my-performance.action';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import * as PerformanceTotalActions from '../actions/performance-total.action';
import { performanceTotalReducer, PerformanceTotalState } from './performance-total.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import * as viewTypesActions from '../actions/view-types.action';
import { viewTypesReducer, ViewTypeState } from './view-types.reducer';

export interface MyPerformanceData {
  performanceTotal?: PerformanceTotalState;
  responsibilities?: ResponsibilitiesState;
  viewType?: ViewTypeState;
  selectedEntity?: string;
}

export interface MyPerformanceState {
  current: MyPerformanceData;
  versions: Array<MyPerformanceData>;
}

export const initialState: MyPerformanceState = {
  current: {
    responsibilities: initialStateResponsibilities,
    viewType: initialStateViewTypes,
    performanceTotal: initialStatePerformanceTotal
  },
  versions: initialStateVersions
};

export function myPerformanceReducer(
  state: MyPerformanceState = initialState,
  action: Action
): MyPerformanceState {
  switch (action.type) {

    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION:
    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION:
    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
    case PerformanceTotalActions.SET_TABLE_ROW_PERFORMANCE_TOTAL:
      return {
        current: {
          performanceTotal: performanceTotalReducer(state.current.performanceTotal, action as PerformanceTotalActions.Action),
          responsibilities: state.current.responsibilities,
          viewType: state.current.viewType,
          selectedEntity: state.current.selectedEntity
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION:
    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
      return myPerformanceVersionReducer(state, action as MyPerformanceVersionActions.Action);

    case MyPerformanceActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION:
      return {
        current: {
          performanceTotal: state.current.performanceTotal,
          responsibilities: state.current.responsibilities,
          viewType: state.current.viewType,
          selectedEntity: action.payload
        },
        versions: state.versions
      };

    case MyPerformanceActions.CLEAR_MY_PERFORMANCE_STATE_ACTION:
      return initialState;

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS:
      return {
        current: {
          performanceTotal: state.current.performanceTotal,
          responsibilities: responsibilitiesReducer(state.current.responsibilities, action as ResponsibilitiesActions.Action),
          viewType: state.current.viewType,
          selectedEntity: state.current.selectedEntity
        },
        versions: state.versions
      };

    case viewTypesActions.SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
    case viewTypesActions.SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
      return {
        current: {
          performanceTotal: state.current.performanceTotal,
          responsibilities: state.current.responsibilities,
          viewType: viewTypesReducer(state.current.viewType, action as viewTypesActions.Action),
          selectedEntity: state.current.selectedEntity
        },
        versions: state.versions
      };

    default:
      return state;
  }
}
