import * as Chance from 'chance';
const chance = new Chance();

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PerformanceTotal } from '../../models/performance-total.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as PerformanceTotalActions from './performance-total.action';

describe('Performance Total Actions', () => {

  describe('Fetch Performance Total Action', () => {
    const positionIdMock: string = chance.string();
    const performanceFilterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.PointsOfDistribution,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On,
      distributionType: DistributionTypeValue.simple
    };
    let action: PerformanceTotalActions.FetchPerformanceTotalAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalAction({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION).toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      });
    });
  });

  describe('Fetch Performance Total Success Action', () => {
    const performanceTotalMock: PerformanceTotal = getPerformanceTotalMock();
    let action: PerformanceTotalActions.FetchPerformanceTotalSuccessAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(performanceTotalMock);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(performanceTotalMock);
    });
  });

  describe('Fetch Performance Total Failure Action', () => {
    const errorMock: Error = new Error(chance.string());
    let action: PerformanceTotalActions.FetchPerformanceTotalFailureAction;

    beforeEach(() => {
      action = new PerformanceTotalActions.FetchPerformanceTotalFailureAction(errorMock);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
        .toBe('[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION');
      expect(action.type).toBe(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toBe(errorMock);
    });
  });

  describe('Set Table Row Performance Total Action', () => {
    const tableRowMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
    let action: PerformanceTotalActions.SetTableRowPerformanceTotal;

    beforeEach(() => {
      action = new PerformanceTotalActions.SetTableRowPerformanceTotal(tableRowMock);
    });

    it('should be the correct type', () => {
      expect(PerformanceTotalActions.SET_TABLE_ROW_PERFORMANCE_TOTAL).toBe('[Performance Total] SET_TABLE_ROW_PERFORMANCE_TOTAL');
      expect(action.type).toBe(PerformanceTotalActions.SET_TABLE_ROW_PERFORMANCE_TOTAL);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(tableRowMock);
    });
  });
});
