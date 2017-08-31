import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../state/reducers/root.reducer';
import { ResetBreadcrumbTrail } from '../state/actions/my-performance-breadcrumb.action';

// This service exists only to expose the Store to ui-router (AngularJS), so that we may reset the
// breadcrumb state via a lifecycle hook in the router. When we upgrade to a native Angular 2+ router,
// this service will not be necssary.
@Injectable()
export class BreadcrumbService {

  constructor(private store: Store<AppState>) { }

  public resetMyPerformanceBreadcrumb() {
    this.store.dispatch(new ResetBreadcrumbTrail());
  }
}
