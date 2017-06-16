import { dateRangesReducer, initialState } from './date-ranges.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as DateRangesActions from '../actions/date-ranges.action';
import { dateRangeCollectionMock } from '../../models/date-range-collection.model.mock';

describe('Date Ranges Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {
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
    const payload = dateRangeCollectionMock;

    const expectedState = {
      status: ActionStatus.Fetched,
      L60: dateRangeCollectionMock[0],
      L90: dateRangeCollectionMock[1],
      CYTM: dateRangeCollectionMock[2],
      FYTM: dateRangeCollectionMock[3],
      FYTD: dateRangeCollectionMock[4],
      L3CM: dateRangeCollectionMock[5],
      LCM: dateRangeCollectionMock[6],
      MTD: dateRangeCollectionMock[7],
      L120: dateRangeCollectionMock[8],
      CYTD: dateRangeCollectionMock[9]
    };

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesSuccessAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
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

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(dateRangesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});