import { dateRangesReducer, initialState } from './date-ranges.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as DateRangesActions from '../actions/date-ranges.action';

describe('Date Ranges Reducer', () => {

  fit('updates the status when a fetch is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      MTD: initialState.MTD,
      FYTM: initialState.FYTM,
      CYTM: initialState.CYTM,
      CYTD: initialState.CYTD,
      FYTD: initialState.FYTD,
      L60: initialState.L60,
      L90: initialState.L90,
      L120: initialState.L120,
      LCM: initialState.LCM,
      L3CM: initialState.L3CM
    };

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesAction());

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status and store the new data when a fetch is successful', () => {
    const payload = appVersionMock();

    const expectedState = {
      status: ActionStatus.Fetched,
      version: payload
    };

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesSuccessAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      version: initialState.version
    };

    const actualState = compassVersionReducer(initialState, new CompassVersionActions.FetchVersionFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(compassVersionReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
