import { compassVersionReducer, initialState } from './compass-version.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as CompassVersionActions from '../actions/compass-version.action';
import { getAppVersionMock } from '../../models/app-version.model.mock';

describe('Compass Version Reducer', () => {

  it('should update the status when a fetch is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      version: initialState.version
    };

    const actualState = compassVersionReducer(initialState, new CompassVersionActions.FetchVersionAction());

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status and store the new data when a fetch is successful', () => {
    const payload = getAppVersionMock();

    const expectedState = {
      status: ActionStatus.Fetched,
      version: payload
    };

    const actualState = compassVersionReducer(initialState, new CompassVersionActions.FetchVersionSuccessAction(payload));

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
