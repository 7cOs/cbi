import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../state/reducers/root.reducer';
import { ResetBreadcrumbTrail } from '../state/actions/my-performance-breadcrumb.action';

@Injectable()
export class UtilService {

  constructor(private store: Store<AppState>) { }

  // generic comparison for sort functions
  public compareObjects(a: any, b: any) {
    return a < b
      ? -1
      : a > b
        ? 1
        : 0;
  }

  public getYearAgoPercent(total: number, totalYearAgo: number): number {
    return parseFloat((total / totalYearAgo).toFixed(1));
  }

  public resetMyPerformanceBreadcrumb() {
    this.store.dispatch(new ResetBreadcrumbTrail());
  }
}
