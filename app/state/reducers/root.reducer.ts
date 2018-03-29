import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { Environment } from '../../environment';
import { listsReducer, ListsState } from './lists.reducer';
import { myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import { myPerformanceFilterReducer, MyPerformanceFilterState } from './my-performance-filter.reducer';
import { productMetricsReducer, ProductMetricsState } from './product-metrics.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  myPerformance: MyPerformanceState;
  myPerformanceProductMetrics: ProductMetricsState;
  listsDetails: ListsState;
  myPerformanceFilter: MyPerformanceFilterState;
}

export const reducers: ActionReducerMap<AppState> = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  myPerformance: myPerformanceReducer,
  listsDetails : listsReducer,
  myPerformanceProductMetrics: productMetricsReducer,
  myPerformanceFilter: myPerformanceFilterReducer
};

export const metaReducers: MetaReducer<AppState>[] = Environment.isLocal() ? [storeFreeze] : [];
