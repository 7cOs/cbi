import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { SetMetricAndPremiseTypePayload } from './my-performance-filter.action';
import * as MyPerformanceFilterActions from './my-performance-filter.action';

describe('My Performance Filter Actions', () => {

  describe('SetMetric action', () => {
    let action: MyPerformanceFilterActions.SetMetric;
    const payload: MetricTypeValue = MetricTypeValue.volume;

    beforeEach(() => {
      action = new MyPerformanceFilterActions.SetMetric(payload);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceFilterActions.SET_METRIC).toBe('[My Performance Filter] SET_METRIC');
      expect(action.type).toBe(MyPerformanceFilterActions.SET_METRIC);
    });

    it('should have the correct payload', () => {
      expect(action.payload).toBe(payload);
    });
  });

  describe('SetTimePeriod action', () => {
    let action: MyPerformanceFilterActions.SetTimePeriod;
    const payload: DateRangeTimePeriodValue = DateRangeTimePeriodValue.FYTDBDL;

    beforeEach(() => {
      action = new MyPerformanceFilterActions.SetTimePeriod(payload);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceFilterActions.SET_TIME_PERIOD).toBe('[My Performance Filter] SET_TIME_PERIOD');
      expect(action.type).toBe(MyPerformanceFilterActions.SET_TIME_PERIOD);
    });

    it('should have the correct payload', () => {
      expect(action.payload).toBe(payload);
    });
  });

  describe('SetPremiseType action', () => {
    let action: MyPerformanceFilterActions.SetPremiseType;
    const payload: PremiseTypeValue = PremiseTypeValue.Off;

    beforeEach(() => {
      action = new MyPerformanceFilterActions.SetPremiseType(payload);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceFilterActions.SET_PREMISE_TYPE).toBe('[My Performance Filter] SET_PREMISE_TYPE');
      expect(action.type).toBe(MyPerformanceFilterActions.SET_PREMISE_TYPE);
    });

    it('should have the correct payload', () => {
      expect(action.payload).toBe(payload);
    });
  });

  describe('SetDistributionType action', () => {
    let action: MyPerformanceFilterActions.SetDistributionType;
    const payload: DistributionTypeValue = DistributionTypeValue.simple;

    beforeEach(() => {
      action = new MyPerformanceFilterActions.SetDistributionType(payload);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceFilterActions.SET_DISTRIBUTION_TYPE).toBe('[My Performance Filter] SET_DISTRIBUTION_TYPE');
      expect(action.type).toBe(MyPerformanceFilterActions.SET_DISTRIBUTION_TYPE);
    });

    it('should have the correct payload', () => {
      expect(action.payload).toBe(payload);
    });
  });

  describe('SetMetricAndPremiseType', () => {
    let action: MyPerformanceFilterActions.SetMetricAndPremiseType;
    const payloadMock: SetMetricAndPremiseTypePayload = {
      metricType: MetricTypeValue.volume,
      premiseType: PremiseTypeValue.On
    };

    beforeEach(() => {
      action = new MyPerformanceFilterActions.SetMetricAndPremiseType(payloadMock);
    });

    it('should have the correct type', () => {
      expect(MyPerformanceFilterActions.SET_METRIC_AND_PREMISE_TYPE).toBe('[My Performance Filter] SET_METRIC_AND_PREMISE_TYPE');
      expect(action.type).toBe(MyPerformanceFilterActions.SET_METRIC_AND_PREMISE_TYPE);
    });

    it('should have the correct payload', () => {
      expect(action.payload).toBe(payloadMock);
    });
  });
});
