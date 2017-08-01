import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { myPerformanceFilterReducer, MyPerformanceFilterState } from './my-performance-filter.reducer';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  myPerformanceFilter: MyPerformanceFilterState;
  responsibilitiesState: ResponsibilitiesState;
}

export const rootReducer = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  myPerformanceFilter: myPerformanceFilterReducer,
  responsibilities: responsibilitiesReducer
};
