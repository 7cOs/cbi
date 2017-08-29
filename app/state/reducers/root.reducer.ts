import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import { myPerformanceFilterReducer, MyPerformanceFilterState } from './my-performance-filter.reducer';
import { myPerformanceBreadcrumbReducer, MyPerformanceBreadcrumbState } from './my-performance-breadcrumb.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  myPerformance: MyPerformanceState;
  myPerformanceBreadcrumb: MyPerformanceBreadcrumbState;
  myPerformanceFilter: MyPerformanceFilterState;
}

export const rootReducer = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  myPerformance: myPerformanceReducer,
  myPerformanceBreadcrumb: myPerformanceBreadcrumbReducer,
  myPerformanceFilter: myPerformanceFilterReducer
};
