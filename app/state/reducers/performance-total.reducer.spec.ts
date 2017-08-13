import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { initialState, performanceTotalReducer } from './performance-total.reducer';
import * as PerformanceTotalActions from '../actions/performance-total.action';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';

const chance = new Chance();

describe('Performance Total Reducer', () => {
  const mockPositionId: number = chance.integer();
  const mockPerformanceFilterState: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };

  it('should update its status when a fetch action is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      performanceTotal: {
        total: 0,
        totalYearAgo: 0,
        contributionToVolume: 0
      }
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalAction({
      positionId: mockPositionId,
      filter: mockPerformanceFilterState
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const mockPayload = getPerformanceTotalMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      performanceTotal: mockPayload
    };
    const actualState = performanceTotalReducer(
initialState, new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(mockPayload));

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
    const actualState = performanceTotalReducer(
initialState, new PerformanceTotalActions.FetchPerformanceTotalFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return the current state when an unknown action is dispatched', () => {
    expect(performanceTotalReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
