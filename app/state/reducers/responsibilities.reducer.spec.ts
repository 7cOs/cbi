import { responsibilitiesReducer, initialState } from './responsibilities.reducer';
import { ActionStatus } from '../../enums/action-status.enum';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { getMockRoleGroups } from '../../models/role-groups.model.mock';

describe('Responsibilities Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {
    const mockPositionId = 1;
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: 0,
      responsibilities: {},
      responsibilitiesPerformanceTotals: new Array()
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction(mockPositionId));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status and store a fetch responsibilities is successful', () => {
    const mockPositionId = 1;
    const mockRoleGroups = getMockRoleGroups();
    const mockPayload = {
      positionId: mockPositionId,
      responsibilities: mockRoleGroups
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: mockPositionId,
      responsibilities: mockRoleGroups,
      responsibilitiesPerformanceTotals: new Array()
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(mockPayload)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: 0,
      responsibilities: {},
      responsibilitiesPerformanceTotals: new Array()
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
