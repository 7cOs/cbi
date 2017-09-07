import * as Chance from 'chance';
const chance = new Chance();

import { ActionStatus } from '../../enums/action-status.enum';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { initialState, performanceTotalReducer } from './performance-total.reducer';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PerformanceTotal } from '../../models/performance-total.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import * as PerformanceTotalActions from '../actions/performance-total.action';

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
      performanceTotal: initialState.performanceTotal
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalAction({
      positionId: mockPositionId,
      filter: mockPerformanceFilterState
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const mockPayload: PerformanceTotal = getPerformanceTotalMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      performanceTotal: mockPayload
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(mockPayload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the performanceTotal data when SetTableRowPerformanceTotal action is received', () => {
    const mockPayload: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
    const expectedState = {
      status: initialState.status,
      performanceTotal: {
        total: mockPayload.metricColumn0,
        totalYearAgo: mockPayload.metricColumn1,
        totalYearAgoPercent: mockPayload.metricColumn2,
        contributionToVolume: mockPayload.ctv,
        entityType: mockPayload.descriptionRow0
      }
    };
    const actualState = performanceTotalReducer(initialState, new PerformanceTotalActions.SetTableRowPerformanceTotal(mockPayload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      performanceTotal: initialState.performanceTotal
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
