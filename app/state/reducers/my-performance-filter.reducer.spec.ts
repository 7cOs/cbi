import { myPerformanceFilterReducer, initialState } from './my-performance-filter.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';

describe('My Performance Filter Reducer', () => {

  it('should set the metric and set correct default timePeriod and premiseType values when SET_METRIC "DEPLETIONS" is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetric('DEPLETIONS'));
    const expectedState: MyPerformanceFilter = {
      metric: 'DEPLETIONS',
      timePeriod: 'CYTDBDL',
      premiseType: 'ALL',
      distributionType: 'SIMPLE'
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the metric and set correct default timePeriod and premiseType values when SET_METRIC "DISTRIBUTION" is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetMetric('DISTRIBUTION'));
    const expectedState: MyPerformanceFilter = {
      metric: 'DISTRIBUTION',
      timePeriod: 'L90BDL',
      premiseType: 'OFF-PREMISE',
      distributionType: 'SIMPLE'
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the timePeriod when SET_TIME_PERIOD is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetTimePeriod('CMIPBDL'));
    const expectedState: MyPerformanceFilter = {
      metric: 'DEPLETIONS',
      timePeriod: 'CMIPBDL',
      premiseType: 'ALL',
      distributionType: 'SIMPLE'
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the premiseType when SET_PREMISE_TYPE is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetPremiseType('ON-PREMISE'));
    const expectedState: MyPerformanceFilter = {
      metric: 'DEPLETIONS',
      timePeriod: 'CYTDBDL',
      premiseType: 'ON-PREMISE',
      distributionType: 'SIMPLE'
    };

    expect(actualState).toEqual(expectedState);
  });

  it('should set the distribution type when SET_DISTRIBUTION_TYPE is dispatched', () => {
    const actualState = myPerformanceFilterReducer(initialState, new MyPerformanceFilterActions.SetDistributionType('EFFECTIVE'));
    const expectedState: MyPerformanceFilter = {
      metric: 'DEPLETIONS',
      timePeriod: 'CYTDBDL',
      premiseType: 'ALL',
      distributionType: 'EFFECTIVE'
    };

    expect(actualState).toEqual(expectedState);
  });
});
