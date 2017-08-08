import { Action } from '@ngrx/store';

import * as initialStateMyPerformanceSaver from './my-performance-version.reducer';
import * as initialStateResponsibilities from './responsibilities.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface MyPerformanceData {
  responsibilities?: ResponsibilitiesState;
}

export interface MyPerformanceState {
  current: MyPerformanceData;
  versions: Array<MyPerformanceData>;
}

export const initialState: MyPerformanceState = {
  current: {
    responsibilities: initialStateResponsibilities.initialState
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
          responsibilities: responsibilitiesReducer(state.current.responsibilities, action as ResponsibilitiesActions.Action)
        },
        versions: state.versions
      };

    default:
      return state;
  }
}
