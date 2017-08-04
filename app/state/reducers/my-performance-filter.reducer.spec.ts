import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricValue } from '../../enums/metric-type.enum';
import { myPerformanceFilterReducer, initialState } from './my-performance-filter.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';

describe('My Performance Filter Reducer', () => {

  it('should set the metric and set correct default timePeriod and premiseType values when SET_METRIC "DEPLETIONS" is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetric(MetricValue.DEPLETIONS));
    const expectedState: MyPerformanceFilter = {
      metric: MetricValue.DEPLETIONS,
      timePeriod: DateRangeTimePeriodValue.CYTDBDL,
      premiseType: PremiseTypeValue.ALL,
      distributionType: DistributionTypeValue.SIMPLE
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the metric and set correct default timePeriod and premiseType values when SET_METRIC "DISTRIBUTION" is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetric(MetricValue.DISTRIBUTION));
    const expectedState: MyPerformanceFilter = {
      metric: MetricValue.DISTRIBUTION,
      timePeriod: DateRangeTimePeriodValue.L90BDL,
      premiseType: PremiseTypeValue.OFF,
      distributionType: DistributionTypeValue.SIMPLE
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the timePeriod when SET_TIME_PERIOD is dispatched', () => {
    const actualState = myPerformanceFilterReducer(
      initialState,
      new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.CMIPBDL)
    );
    const expectedState: MyPerformanceFilter = {
      metric: MetricValue.DEPLETIONS,
      timePeriod: DateRangeTimePeriodValue.CMIPBDL,
      premiseType: PremiseTypeValue.ALL,
      distributionType: DistributionTypeValue.SIMPLE
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the premiseType when SET_PREMISE_TYPE is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.ON));
    const expectedState: MyPerformanceFilter = {
      metric: MetricValue.DEPLETIONS,
      timePeriod: DateRangeTimePeriodValue.CYTDBDL,
      premiseType: PremiseTypeValue.ON,
      distributionType: DistributionTypeValue.SIMPLE
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the distribution type when SET_DISTRIBUTION_TYPE is dispatched', () => {
    const actualState = myPerformanceFilterReducer(
      initialState,
      new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.EFFECTIVE)
    );
    const expectedState: MyPerformanceFilter = {
      metric: MetricValue.DEPLETIONS,
      timePeriod: DateRangeTimePeriodValue.CYTDBDL,
      premiseType: PremiseTypeValue.ALL,
      distributionType: DistributionTypeValue.EFFECTIVE
    };

    expect(actualState).toEqual(expectedState);
  });
});
