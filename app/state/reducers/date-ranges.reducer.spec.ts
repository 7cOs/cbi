import { dateRangesReducer, initialState } from './date-ranges.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as DateRangesActions from '../actions/date-ranges.action';
import { dateRangeCollectionMock } from '../../models/date-range-collection.model.mock';

describe('Date Ranges Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      FYTM: initialState.FYTM,
      CQTD: initialState.CQTD,
      CYTM: initialState.CYTM,
      CYTDBDL: initialState.CYTDBDL,
      FYTDBDL: initialState.FYTDBDL,
      FQTD: initialState.FQTD,
      CCQTD: initialState.CCQTD,
      FCQTD: initialState.FCQTD,
      L60BDL: initialState.L60BDL,
      L90BDL: initialState.L90BDL,
      L120BDL: initialState.L120BDL,
      LCM: initialState.LCM,
      L3CM: initialState.L3CM,
      CMIPBDL: initialState.CMIPBDL
    };

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesAction());

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status and store the new data when a fetch is successful', () => {
    const payload = dateRangeCollectionMock;

    const expectedState = {
      status: ActionStatus.Fetched,
      L60BDL: dateRangeCollectionMock[0],
      L90BDL: dateRangeCollectionMock[1],
      CYTM: dateRangeCollectionMock[2],
      FYTM: dateRangeCollectionMock[3],
      CCQTD: dateRangeCollectionMock[4],
      FCQTD: dateRangeCollectionMock[5],
      FYTDBDL: dateRangeCollectionMock[6],
      L3CM: dateRangeCollectionMock[7],
      LCM: dateRangeCollectionMock[8],
      CMIPBDL: dateRangeCollectionMock[9],
      L120BDL: dateRangeCollectionMock[10],
      CYTDBDL: dateRangeCollectionMock[11],
      CQTD: dateRangeCollectionMock[12],
      FQTD: dateRangeCollectionMock[13],
    };

    const actualState = dateRangesReducer(initialState, new DateRangesActions.FetchDateRangesSuccessAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      FYTM: initialState.FYTM,
      CYTM: initialState.CYTM,
      CCQTD: initialState.CCQTD,
      FCQTD: initialState.FCQTD,
      CYTDBDL: initialState.CYTDBDL,
      FYTDBDL: initialState.FYTDBDL,
      CQTD: initialState.CQTD,
      L60BDL: initialState.L60BDL,
      L90BDL: initialState.L90BDL,
      L120BDL: initialState.L120BDL,
      LCM: initialState.LCM,
      L3CM: initialState.L3CM,
      CMIPBDL: initialState.CMIPBDL,
      FQTD: initialState.FQTD,
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
