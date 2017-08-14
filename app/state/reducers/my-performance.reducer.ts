import { Action } from '@ngrx/store';

import * as initialStateMyPerformanceSaver from './my-performance-version.reducer';
import * as initialStateResponsibilities from './responsibilities.reducer';
import * as initialStateViewTypes from './view-types.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import * as viewTypesActions from '../actions/view-types.action';
import { viewTypesReducer, ViewTypeState } from './view-types.reducer';

export interface MyPerformanceData {
  responsibilities?: ResponsibilitiesState;
  viewTypes?: ViewTypeState;
}

export interface MyPerformanceState {
  current: MyPerformanceData;
  versions: Array<MyPerformanceData>;
}

export const initialState: MyPerformanceState = {
  current: {
    responsibilities: initialStateResponsibilities.initialState,
    viewTypes: initialStateViewTypes.initialState
  },
  versions: initialStateMyPerformanceSaver.initialState
};

export function myPerformanceReducer(
  state: MyPerformanceState = initialState,
  action: Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION:
    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
      return myPerformanceVersionReducer(state, action as MyPerformanceVersionActions.Action);

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
      return {
        current: {
          responsibilities: responsibilitiesReducer(state.current.responsibilities, action as ResponsibilitiesActions.Action),
          viewTypes: state.current.viewTypes
        },
        versions: state.versions
      };

    case viewTypesActions.SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
    case viewTypesActions.SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
      return {
        current: {
          responsibilities: state.current.responsibilities, // If it doesn't exist, is that ok? I guess I might see with unit tests
          viewTypes: viewTypesReducer(state.current.viewTypes, action as viewTypesActions.Action)
        },
        versions: state.versions
      };

    default:
      return state;
  }
}
