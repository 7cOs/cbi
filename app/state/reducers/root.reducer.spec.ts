import * as Chance from 'chance';
import * as store from '@ngrx/store';

import { Environment } from '../../environment';
import { compassVersionReducer } from './compass-version.reducer';
import { dateRangesReducer } from './date-ranges.reducer';
import { myPerformanceReducer } from './my-performance.reducer';
import { myPerformanceFilterReducer } from './my-performance-filter.reducer';

const chance = new Chance();

describe('Root Reducer', () => {
  let inputStateMock: string;
  let inputActionMock: string;
  let outputStateMock: string;
  let combineReducersMock: jasmine.Spy;
  let rootReducerMock: jasmine.Spy;
  let rootReducer: any;
  let outputState: any;

  beforeEach(() => {
    inputStateMock = chance.string();
    inputActionMock = chance.string();
    outputStateMock = chance.string();

    rootReducerMock = jasmine.createSpy('productionReducer').and.returnValue(outputStateMock);
    combineReducersMock = jasmine.createSpy('combineReducers').and.returnValue(rootReducerMock);
    spyOnProperty(store, 'combineReducers', 'get').and.returnValue(combineReducersMock);
    spyOn(Environment, 'isLocal').and.returnValue(false);

    // must require after spying on combineReducers
    rootReducer = require('./root.reducer').rootReducer;
    outputState = rootReducer(inputStateMock, inputActionMock);
  });

  it('should combine all individual reducers with combineReducers function', () => {
    expect(store.combineReducers).toHaveBeenCalledWith({
      compassVersion: compassVersionReducer,
      dateRanges: dateRangesReducer,
      myPerformance: myPerformanceReducer,
      myPerformanceFilter: myPerformanceFilterReducer
    });
    expect(rootReducerMock).toHaveBeenCalledWith(inputStateMock, inputActionMock);
    expect(outputState).toEqual(outputStateMock);
  });
});
