// tslint:disable:no-unused-variable
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityResponsibilitiesDTO } from '../../models/entity-responsibilities-dto.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';

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
        return this.myPerformanceApiService.getResponsibilities(entityId)
          .map(response => {
            const roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.people);
            return new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(roleGroups);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
      });
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
