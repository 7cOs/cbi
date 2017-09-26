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

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE:
    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES:
    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE:
    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE:
    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_ACTION:
    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS_ACTION:
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
