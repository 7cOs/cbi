import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';

import { compassVersionReducer, CompassVersionState } from './compass-version.reducer';
import { dateRangesReducer, DateRangesState } from './date-ranges.reducer';
import { Environment } from '../../environment';
import { myPerformanceReducer, MyPerformanceState } from './my-performance.reducer';
import { myPerformanceFilterReducer, MyPerformanceFilterState } from './my-performance-filter.reducer';

export interface AppState {
  compassVersion: CompassVersionState;
  dateRanges: DateRangesState;
  myPerformance: MyPerformanceState;
  myPerformanceFilter: MyPerformanceFilterState;
}

const allReducers = {
  compassVersion: compassVersionReducer,
  dateRanges: dateRangesReducer,
  myPerformance: myPerformanceReducer,
  myPerformanceFilter: myPerformanceFilterReducer
};

const developmentReducer: ActionReducer<AppState> = compose(storeFreeze, combineReducers)(allReducers);
const productionReducer: ActionReducer<AppState> = combineReducers(allReducers);
export const rootReducer: ActionReducer<AppState> = Environment.isLocal() ? developmentReducer : productionReducer;
