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
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroups } from '../../models/role-groups.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ViewTypeActions from '../../state/actions/view-types.action';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    let roleGroups: RoleGroups;
    let entityType: ViewType;
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        const entityId = action.payload;
          return this.myPerformanceApiService.getResponsibilities(entityId)
            .map((response: PeopleResponsibilitiesDTO) => {
              roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.positions);
              if (response.positions) entityType = ViewType.roleGroups;
            });
        })
        .concatMap(() => {
          return Observable.from(
            [
              new ViewTypeActions.SetLeftMyPerformanceTableViewType(entityType),
              new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(roleGroups)
            ]
          );
        })
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
  }

  @Effect({dispatch: false})
  fetchResponsibilitiesFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
      .do((action: Action) => {
        console.error('Responsibilities fetch failure:', action.payload);
      });
  }
}
