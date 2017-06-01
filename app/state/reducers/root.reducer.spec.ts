import { rootReducer } from './root.reducer';
import { compassVersionReducer } from './compass-version.reducer';

describe('Root Reducer', () => {

  it('should expose all individual reducers as object properties', () => {
    expect(rootReducer.compassVersion).toBe(compassVersionReducer);
  });
});
