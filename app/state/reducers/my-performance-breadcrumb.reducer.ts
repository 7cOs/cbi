import * as MyPerformanceBreadcrumbActions from '../actions/my-performance-breadcrumb.action';

export interface MyPerformanceBreadcrumbState {
  trail: string[];
}

export const initialState: MyPerformanceBreadcrumbState = {
  trail: []
};

export function myPerformanceBreadcrumbReducer(
  state: MyPerformanceBreadcrumbState = initialState,
  action: MyPerformanceBreadcrumbActions.Action
): MyPerformanceBreadcrumbState {
  switch (action.type) {

    case MyPerformanceBreadcrumbActions.ADD_BREADCRUMB_ENTITY:
      return Object.assign({}, state, {
        trail: state.trail.concat(action.payload)
      });

    case MyPerformanceBreadcrumbActions.REMOVE_BREADCRUMB_ENTITIES:
      return Object.assign({}, state, {
        trail: state.trail.slice(0, state.trail.length - action.payload)
      });

    case MyPerformanceBreadcrumbActions.RESET_BREADCRUMB_TRAIL:
      return initialState;

    default:
      return state;
  }
}
