import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { myPerformanceFilterReducer, initialState } from './my-performance-filter.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';

describe('My Performance Filter Reducer', () => {

  describe('when a MyPerformanceFilterAction of type SET_METRIC is received', () => {
    it('should set the metric and set correct default timePeriod and premiseType values when '
    + 'SET_METRIC "DEPLETIONS" is dispatched', () => {
      const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetric(MetricTypeValue.Depletions));
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Depletions,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
        premiseType: PremiseTypeValue.All
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set the metric and set correct default timePeriod and premiseType values when '
    + 'SET_METRIC "DISTRIBUTION" is dispatched', () => {
      const actualState = myPerformanceFilterReducer(
        initialState, new MyPerformanceFilterActions.SetMetric(MetricTypeValue.Distribution)
      );
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Distribution,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.Off,
        distributionType: DistributionTypeValue.Simple
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a MyPerformanceFilterAction of type SET_TIME_PERIOD is received', () => {
    it('should set the timePeriod when SET_TIME_PERIOD is dispatched', () => {
      const actualState = myPerformanceFilterReducer(
        initialState,
        new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.CMIPBDL)
      );
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Depletions,
        dateRangeCode: DateRangeTimePeriodValue.CMIPBDL,
        premiseType: PremiseTypeValue.All
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a MyPerformanceFilterAction of type SET_PREMISE_TYPE is received', () => {
    it('should set the premiseType when SET_PREMISE_TYPE is dispatched', () => {
      const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.On));
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Depletions,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a MyPerformanceFilterAction of type SET_DISTRIBUTION_TYPE is received', () => {
    it('should set the distribution type when SET_DISTRIBUTION_TYPE is dispatched', () => {
      const actualState = myPerformanceFilterReducer(
        initialState,
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.Effective)
      );
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Depletions,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
        premiseType: PremiseTypeValue.All,
        distributionType: DistributionTypeValue.Effective
      };

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a MyPerformanceFilterAction of type SET_METRIC_AND_PREMISE_TYPE is received', () => {
    it('should set the metric, premise type, and the correct default time period when the metric value is volume', () => {
      const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetricAndPremiseType({
        metricType: MetricTypeValue.Depletions,
        premiseType: PremiseTypeValue.On
      }));
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Depletions,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set the metric, premise, distribution type, and the correct default time period when the metric value '
    + 'is PointsOfDistribution', () => {
      const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetricAndPremiseType({
        metricType: MetricTypeValue.Distribution,
        premiseType: PremiseTypeValue.Off
      }));
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Distribution,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.Off,
        distributionType: DistributionTypeValue.Simple
      };

      expect(actualState).toEqual(expectedState);
    });

    it('should set the metric, premise type, and the correct default time period when the metric value is velocity', () => {
      const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetricAndPremiseType({
        metricType: MetricTypeValue.Velocity,
        premiseType: PremiseTypeValue.On
      }));
      const expectedState: MyPerformanceFilter = {
        metricType: MetricTypeValue.Velocity,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.On
      };

      expect(actualState).toEqual(expectedState);
    });
  });
});
