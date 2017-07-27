// tslint:disable:no-unused-variable
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { Person } from '../../models/person.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { ResponsibilitiesApiService } from '../../services/responsibilities-api.service';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private responsibilitiesApiService: ResponsibilitiesApiService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap(() => {
        return this.responsibilitiesApiService.getResponsibilities(1)
          .map((response: Person[]) => {
            let roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response);
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
