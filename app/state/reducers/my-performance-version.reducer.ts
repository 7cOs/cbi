import { ResponsibilitiesState } from './responsibilities.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';

import { MyPerformanceState } from './my-performance.reducer';

export interface MyPerformanceData {
  responsibilities?: ResponsibilitiesState;
}

export const initialState: Array<MyPerformanceData> = Array<MyPerformanceData>();

export function myPerformanceVersionReducer(
  state: MyPerformanceState,
  action: MyPerformanceVersionActions.Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION:
      state.versions.push(action.payload);
      return {
        current: {
          responsibilities: state.current.responsibilities
        },
        versions: state.versions
      };

    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
      const lastState = state.versions.pop(); // Do I need to use Object.assign?
      return lastState ?
      {
        current: {
          responsibilities: lastState.responsibilities
        },
        versions: state.versions
      }
      : state;

    default:
      return state;
  }
}
