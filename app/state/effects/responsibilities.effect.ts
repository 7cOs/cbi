// tslint:disable:no-unused-variable
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityResponsibilitiesDTO } from '../../models/entity-responsibilities-dto.model';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroupPerformanceTotal } from '../../models/role-groups.model';
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
        const positionId = action.payload;
        return this.myPerformanceApiService.getResponsibilities(positionId)
          .map((response: PeopleResponsibilitiesDTO) => {
            const payload = {
              positionId: positionId,
              responsibilities: this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.positions)
            };

            return new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(payload);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
      });
  }

  @Effect()
  fetchResponsibilitiesPerformanceTotals$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION)
      .switchMap((action: Action) => {
        const positionId = action.payload.positionId;
        const entityTypes = Object.keys(action.payload.responsibilities);

        return this.myPerformanceApiService.getResponsibilitiesPerformanceTotal(positionId, entityTypes)
          .map((response: RoleGroupPerformanceTotal[]) => {
            return new ResponsibilitiesActions.FetchResponsibilitiesPerformanceTotalsSuccess(response);
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
