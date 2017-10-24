import * as SalesHierarchyViewTypeActions from '../actions/sales-hierarchy-view-type.action';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';

export interface SalesHierarchyViewTypeState {
  viewType: SalesHierarchyViewType;
}

export const initialState: SalesHierarchyViewTypeState = {
  viewType: SalesHierarchyViewType.roleGroups
};

export function salesHierarchyViewTypeReducer(
  state: SalesHierarchyViewTypeState = initialState,
  action: SalesHierarchyViewTypeActions.Action
): SalesHierarchyViewTypeState {
  switch (action.type) {
    case SalesHierarchyViewTypeActions.SET_SALES_HIERARCHY_VIEW_TYPE:
      return Object.assign({}, state, {
        viewType: action.payload
      });

    default:
      return state;
  }
}
