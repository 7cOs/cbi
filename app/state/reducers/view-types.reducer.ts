import * as ViewTypesActions from '../actions/view-types.action';
import { ViewType } from '../../enums/view-type.enum';

export interface ViewTypeState {
  leftTableViewType: ViewType;
  rightTableViewType: ViewType;
}

export const initialState: ViewTypeState = {
  leftTableViewType: ViewType.roleGroups,
  rightTableViewType: ViewType.brands
};

export function viewTypesReducer(
  state: ViewTypeState = initialState,
  action: ViewTypesActions.Action
): ViewTypeState {
  switch (action.type) {

    case ViewTypesActions.SET_LEFT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
      return Object.assign({}, state, {
        leftTableViewType: action.payload
      });

    case ViewTypesActions.SET_RIGHT_MY_PERFORMANCE_TABLE_VIEW_TYPE:
      return Object.assign({}, state, {
        rightTableViewType: action.payload
      });

    default:
      return state;
  }
}
