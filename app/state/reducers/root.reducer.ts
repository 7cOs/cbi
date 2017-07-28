import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  responsibilitiesState: ResponsibilitiesState;
}

export const rootReducer = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  responsibilities: responsibilitiesReducer
};
