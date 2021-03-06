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

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: state.current.selectedSkuPackageCode,
          selectedEntityType: action.payload,
          selectedSubaccountCode: state.current.selectedSubaccountCode,
          selectedDistributorCode: state.current.selectedDistributorCode,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_BRAND_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedBrandCode: action.payload,
          selectedEntityType: state.current.selectedEntityType,
          selectedSubaccountCode: state.current.selectedSubaccountCode,
          selectedDistributorCode: state.current.selectedDistributorCode,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_SKU_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: action.payload.skuPackageCode,
          selectedSkuPackageType: action.payload.skuPackageType,
          selectedEntityType: state.current.selectedEntityType,
          selectedSubaccountCode: state.current.selectedSubaccountCode,
          selectedDistributorCode: state.current.selectedDistributorCode,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_SELECTED_SKU_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: null,
          selectedEntityType: state.current.selectedEntityType,
          selectedSubaccountCode: state.current.selectedSubaccountCode,
          selectedDistributorCode: state.current.selectedDistributorCode,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_SELECTED_BRAND_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedEntityType: state.current.selectedEntityType,
          selectedSubaccountCode: state.current.selectedSubaccountCode,
          selectedDistributorCode: state.current.selectedDistributorCode,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_SUBACCOUNT_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: state.current.selectedSkuPackageCode,
          selectedSkuPackageType: state.current.selectedSkuPackageType,
          selectedSubaccountCode: action.payload,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.SET_MY_PERFORMANCE_SELECTED_DISTRIBUTOR_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: state.current.selectedSkuPackageCode,
          selectedSkuPackageType: state.current.selectedSkuPackageType,
          selectedDistributorCode: action.payload,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_SELECTED_SUBACCOUNT_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: state.current.selectedSkuPackageCode,
          selectedSkuPackageType: state.current.selectedSkuPackageType,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_SELECTED_DISTRIBUTOR_CODE:
      return {
        current: {
          responsibilities: state.current.responsibilities,
          salesHierarchyViewType: state.current.salesHierarchyViewType,
          selectedEntityDescription: state.current.selectedEntityDescription,
          selectedEntityType: state.current.selectedEntityType,
          selectedBrandCode: state.current.selectedBrandCode,
          selectedSkuPackageCode: state.current.selectedSkuPackageCode,
          selectedSkuPackageType: state.current.selectedSkuPackageType,
          filter: state.current.filter
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE:
      return initialState;

    default:
      return state;
  }
}
