import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { myPerformanceFilterReducer, MyPerformanceFilterState } from './my-performance-filter.reducer';
import { responsibilitiesReducer, ResponsibilitiesState } from './responsibilities.reducer';
import { viewTypesReducer, ViewTypeState } from './view-types.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  myPerformanceFilter: MyPerformanceFilterState;
  responsibilities: ResponsibilitiesState;
  viewTypes: ViewTypeState;
}

export const rootReducer = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  myPerformanceFilter: myPerformanceFilterReducer,
  responsibilities: responsibilitiesReducer,
  viewTypes: viewTypesReducer
};
