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
        current: state.current,
        versions: versionsUpdated
      };

    case MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION:
      debugger;
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

    default:
      return state;
  }
}
