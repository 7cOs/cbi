import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroupPerformanceTotal } from '../../models/role-groups.model';
import { RoleGroups } from '../../models/role-groups.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
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
    let filter: MyPerformanceFilterState;
    let positionId: number;
    let entityTypes: any;
    let roleGroupsPerformanceTotals: Array<RoleGroupPerformanceTotal>;

    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        positionId = action.payload.positionId;
        filter = action.payload.filter;

        return this.myPerformanceApiService.getResponsibilities(positionId)
          .map((response: PeopleResponsibilitiesDTO) => {
            roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.positions);
            entityTypes = Object.keys(roleGroups);
            if (response.positions) entityType = ViewType.roleGroups;
          });
        })
        .concatMap(() => {
          return this.myPerformanceApiService.getResponsibilitiesPerformanceTotals(positionId, entityTypes, filter)
            .map((res: Array<RoleGroupPerformanceTotal>) => {
              roleGroupsPerformanceTotals = res;
            });
        })
        .concatMap(() => {
          return Observable.from([
            new ViewTypeActions.SetLeftMyPerformanceTableViewType(entityType),
            new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
              positionId: positionId,
              responsibilities: roleGroups,
              performanceTotals: roleGroupsPerformanceTotals
            })
          ]);
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
