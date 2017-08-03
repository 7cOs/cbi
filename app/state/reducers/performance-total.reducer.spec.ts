import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { initialState, performanceTotalReducer } from './performance-total.reducer';
import * as PerformanceTotalActions from '../actions/performance-total.action';

const chance = new Chance();

describe('Performance Total Reducer', () => {
  const mockPositionId: number = chance.integer();

  it('should update its status when a fetch action is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      performanceTotal: {
        total: 0,
        totalYearAgo: 0,
        contributionToVolume: 0
      }
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalAction(mockPositionId));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const mockPayload = getPerformanceTotalMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      performanceTotal: mockPayload
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(mockPayload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      performanceTotal: {
        total: 0,
        totalYearAgo: 0,
        contributionToVolume: 0
      }
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return the current state when an unknown action is dispatched', () => {
    expect(performanceTotalReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
