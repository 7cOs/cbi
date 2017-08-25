import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTotal } from '../../models/performance-total.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as PerformanceTotalActions from './performance-total.action';

const chance = new Chance();

describe('Performance Total Actions', () => {

  describe('Fetch Performance Total Action', () => {
    const mockPositionId: string = chance.string();
    const mockPerformanceFilterState: MyPerformanceFilterState = {
      metricType: MetricTypeValue.PointsOfDistribution,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On,
      distributionType: DistributionTypeValue.simple
    };
    let action: PerformanceTotalActions.FetchPerformanceTotalAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalAction({
        positionId: mockPositionId,
        filter: mockPerformanceFilterState
      });
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION).toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual({
        positionId: mockPositionId,
        filter: mockPerformanceFilterState
      });
    });
  });

  describe('Fetch Performance Total Success Action', () => {
    const mockPerformanceTotal: PerformanceTotal = getPerformanceTotalMock();
    let action: PerformanceTotalActions.FetchPerformanceTotalSuccessAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(mockPerformanceTotal);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(mockPerformanceTotal);
    });
  });

  describe('Fetch Performance Total Failure Action', () => {
    const mockError: Error = new Error(chance.string());
    let action: PerformanceTotalActions.FetchPerformanceTotalFailureAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalFailureAction(mockError);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(mockError);
    });
  });
});
