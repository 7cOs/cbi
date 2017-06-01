import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
};

export const rootReducer = {
  compassVersion: compassVersionReducer
};
