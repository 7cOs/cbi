import { rootReducer } from './root.reducer';
import { compassVersionReducer } from './compass-version.reducer';
import { dateRangesReducer } from './date-ranges.reducer';

describe('Root Reducer', () => {

  it('should expose all individual reducers as object properties', () => {
    expect(rootReducer.compassVersion).toBe(compassVersionReducer);
    expect(rootReducer.dateRanges).toBe(dateRangesReducer);
  });
});
