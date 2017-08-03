import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { MyPerformanceApiService } from '../../services/my-performance-api.service';
// TODO Figure out: Array<PeopleResponsibilitiesDTO | PerformanceTotal>
// import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
// import { PerformanceTotal } from '../../models/performance-total.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import * as PerformanceTotalActions from '../../state/actions/performance-total.action';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        const entityId = action.payload;

        return Observable.forkJoin(
          this.myPerformanceApiService.getResponsibilities(entityId),
          this.myPerformanceApiService.getPerformanceTotal(entityId)
        );
      })
      .mergeMap(([responsibilities, performanceTotal]: Array<any>) => {
        const roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(responsibilities.people);

        return [
          new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(roleGroups),
          new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(performanceTotal)
        ];
      })
      // TODO: Follow up on error handling different action failures
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
  }

  @Effect({dispatch: false})
  fetchVersionFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
      .do(action => {
        console.error('Responsibilities fetch failure:', action.payload);
      });
  }
}
