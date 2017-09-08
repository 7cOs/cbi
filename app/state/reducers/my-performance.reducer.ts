import { Action } from '@ngrx/store';

import { initialState as initialStateResponsibilities } from './responsibilities.reducer';
import { initialState as initialStateViewTypes } from './view-types.reducer';
import { initialStateVersions } from './my-performance-version.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import * as viewTypesActions from '../actions/view-types.action';
import { viewTypesReducer, ViewTypeState } from './view-types.reducer';

export interface MyPerformanceEntitiesData {
  responsibilities?: ResponsibilitiesState;
  viewType?: ViewTypeState;
  selectedEntity?: string;
}

export interface MyPerformanceState {
  current: MyPerformanceEntitiesData;
  versions: Array<MyPerformanceEntitiesData>;
}

export const initialState: MyPerformanceState = {
  current: {
    responsibilities: initialStateResponsibilities,
    viewType: initialStateViewTypes,
  },
  versions: initialStateVersions
};

export function myPerformanceReducer(
  state: MyPerformanceState = initialState,
  action: Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION:
    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION:
    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE_ACTION:
      return myPerformanceVersionReducer(state, action as MyPerformanceVersionActions.Action);

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS:
    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION:
    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION:
    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
    case ResponsibilitiesActions.SET_TABLE_ROW_PERFORMANCE_TOTAL:
      return {
        current: {
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
