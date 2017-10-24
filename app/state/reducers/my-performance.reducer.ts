import { Action } from '@ngrx/store';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { initialState as initialStateResponsibilities } from './responsibilities.reducer';
import { initialState as initialStateSalesHierarchyViewType } from './sales-hierarchy-view-type.reducer';
import { initialStateVersions } from './my-performance-version.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';
import { myPerformanceVersionReducer } from './my-performance-version.reducer';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';
import { salesHierarchyViewTypeReducer, SalesHierarchyViewTypeState } from './sales-hierarchy-view-type.reducer';

export interface MyPerformanceEntitiesData {
  responsibilities?: ResponsibilitiesState;
  salesHierarchyViewType?: SalesHierarchyViewTypeState;
  selectedEntity?: string;
  selectedEntityType: EntityType;
  selectedBrandCode?: string;
}

export interface MyPerformanceState {
  current: MyPerformanceEntitiesData;
  versions: Array<MyPerformanceEntitiesData>;
}

export const initialState: MyPerformanceState = {
  current: {
    responsibilities: initialStateResponsibilities,
    salesHierarchyViewType: initialStateSalesHierarchyViewType,
    selectedEntityType: EntityType.Person
  },
  versions: initialStateVersions
};

export function myPerformanceReducer(
  state: MyPerformanceState = initialState,
  action: Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE:
    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE:
    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY:
    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE:
    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_BRAND:
    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE:
      return myPerformanceVersionReducer(state, action as MyPerformanceVersionActions.Action);

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS:
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE:
    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP:
    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES:
    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS:
    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE:
    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE:
    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE_FOR_SELECTED_ROLE_GROUP:
    case ResponsibilitiesActions.FETCH_SUBACCOUNTS:
    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS:
    case ResponsibilitiesActions.SET_ALTERNATE_HIERARCHY_ID:
    case ResponsibilitiesActions.FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES:
      return {
        current: {
          responsibilities: responsibilitiesReducer(state.current.responsibilities, action as ResponsibilitiesActions.Action),
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntity: state.current.selectedEntity,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode
        },
        versions: state.versions
      };

    case SalesHierarchyViewTypeActions.SET_SALES_HIERARCHY_VIEW_TYPE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: salesHierarchyViewTypeReducer(
            state.current.salesHierarchyViewType,
            action as SalesHierarchyViewTypeActions.Action
          ),
          selectedEntity: state.current.selectedEntity,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode
        },
        versions: state.versions
      };

    default:
      return state;
  }
}
