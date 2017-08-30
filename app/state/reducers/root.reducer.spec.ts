import { rootReducer } from './root.reducer';
import { compassVersionReducer } from './compass-version.reducer';
import { dateRangesReducer } from './date-ranges.reducer';
import { myPerformanceReducer } from './my-performance.reducer';
import { myPerformanceFilterReducer } from './my-performance-filter.reducer';

describe('Root Reducer', () => {

  it('should expose all individual reducers as object properties', () => {
    expect(rootReducer.compassVersion).toBe(compassVersionReducer);
    expect(rootReducer.dateRanges).toBe(dateRangesReducer);
    expect(rootReducer.myPerformance).toBe(myPerformanceReducer);
    expect(rootReducer.myPerformanceFilter).toBe(myPerformanceFilterReducer);
  });
});
