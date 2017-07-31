import { responsibilitiesReducer, initialState } from './responsibilities.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { getMockRoleGroups } from '../../models/role-groups.model.mock';

describe('Responsibilities Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {
    const mockPersonID = 1;
    const expectedState = {
      status: ActionStatus.Fetching,
      responsibilities: {}
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction(mockPersonID));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status and store the new data when a fetch is successful', () => {
    const payload = getMockRoleGroups();

    const expectedState = {
      status: ActionStatus.Fetched,
      responsibilities: payload
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      responsibilities: {}
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
