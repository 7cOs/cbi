import { MyPerformanceData, MyPerformanceState } from './my-performance.reducer';
import * as MyPerformanceVersionActions from '../actions/my-performance-version.action';

export const initialState: Array<MyPerformanceData> = Array<MyPerformanceData>();

export function myPerformanceVersionReducer(
  state: MyPerformanceState,
  action: MyPerformanceVersionActions.Action
): MyPerformanceState {
  switch (action.type) {

    case MyPerformanceVersionActions.SAVE_MY_PERFORMANCE_STATE_ACTION:
      const versionsUpdated = [...state.versions];
      versionsUpdated.push(action.payload);
      return {
        current: {
          responsibilities: state.current.responsibilities
        },
        versions: versionsUpdated
      };

    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
      const lastState = [...state.versions].pop();
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
