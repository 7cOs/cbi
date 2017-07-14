import * as MyPerformanceFilterActions from './my-performance-filter.action';
import * as MyPerformanceFilterModel from '../../models/my-performance-filter.model';

describe('My Performance Filter Actions', () => {

  describe('SetMetric action', () => {
    let action: MyPerformanceFilterActions.SetMetric;
    const payload: MyPerformanceFilterModel.MetricValue = 'DEPLETIONS';

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
    const payload: MyPerformanceFilterModel.TimePeriodValue = 'FYTDBDL';

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
    const payload: MyPerformanceFilterModel.PremiseTypeValue = 'OFF-PREMISE';

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
    const payload: MyPerformanceFilterModel.DistributionTypeValue = 'SIMPLE';

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
});
