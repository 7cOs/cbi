import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { PerformanceTotal } from '../../models/performance-total.model';
import * as PerformanceTotalActions from '../../state/actions/performance-total.action';

@Injectable()
export class PerformanceTotalEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService
  ) { }

  @Effect()
  fetchPerformanceTotal$(): Observable<Action> {
    return this.actions$
      .ofType(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION)
      .switchMap((action: Action) => {
        const personId = action.payload;

        return this.myPerformanceApiService.getPerformanceTotal(personId)
          .map((response: PerformanceTotal) => {
            return new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(response);
          })
          .catch((err: Error) => Observable.of(new PerformanceTotalActions.FetchPerformanceTotalFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchPerformanceTotalFailure$(): Observable<Action> {
    return this.actions$
      .ofType(PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
      .do(action => {
        console.error('Failed fetching performance total data', action.payload);
      });
  }
}
