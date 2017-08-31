import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../state/reducers/root.reducer';
import { ResetBreadcrumbTrail } from '../state/actions/my-performance-breadcrumb.action';

@Injectable()
export class BreadcrumbService {

  constructor(private store: Store<AppState>) { }

  public resetMyPerformanceBreadcrumb() {
    this.store.dispatch(new ResetBreadcrumbTrail());
  }
}
