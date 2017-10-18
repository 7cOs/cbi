import { MyPerformanceEntitiesData, MyPerformanceState, initialState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';

export const initialStateVersions: Array<MyPerformanceEntitiesData> = Array<MyPerformanceEntitiesData>();

export function myPerformanceVersionReducer(
  state: MyPerformanceState,
  action: MyPerformanceVersionActions.Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE:
      const versionsUpdated = [...state.versions];
      versionsUpdated.push(action.payload);
      return {
        current: state.current,
        versions: versionsUpdated
      };

    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE:
      const updatedVersions = [...state.versions];
      const stepsBack: number = action.payload;
      const startIndex: number = updatedVersions.length - stepsBack;
      const lastState = updatedVersions.splice(startIndex, stepsBack)[0];
      return lastState
        ? {
          current: lastState,
          versions: updatedVersions
          }
        : state;

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntity: action.payload,
          selectedBrand: state.current.selectedBrand,
          selectedEntityType: state.current.selectedEntityType
        },
        versions: state.versions
      };

      case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE:
        return {
          current: {
            responsibilities: state.current.responsibilities,
            salesHierarchyViewType: state.current.salesHierarchyViewType,
            selectedEntity: state.current.selectedEntity,
            selectedBrand: state.current.selectedBrand,
            selectedEntityType: action.payload
          },
          versions: state.versions
        };

      case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_BRAND:
        return {
          current: {
            responsibilities: state.current.responsibilities,
            salesHierarchyViewType: state.current.salesHierarchyViewType,
            selectedEntity: state.current.selectedEntity,
            selectedBrand: action.payload,
            selectedEntityType: state.current.selectedEntityType
          },
          versions: state.versions
        };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE:
      return initialState;

    default:
      return state;
  }
}
