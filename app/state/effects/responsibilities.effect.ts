import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../models/people-responsibilities-dto.model';
import { PerformanceTotalTransformerService } from '../../services/performance-total-transformer.service';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroupPerformanceTotalDTO } from '../../models/role-groups.model';
import { RoleGroups } from '../../models/role-groups.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import * as ViewTypeActions from '../../state/actions/view-types.action';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private myPerformanceApiService: MyPerformanceApiService,
    private performanceTotalTransformerService: PerformanceTotalTransformerService,
    private responsibilitiesTransformerService: ResponsibilitiesTransformerService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    let roleGroups: RoleGroups;
    let entityType: ViewType;
    let filter: MyPerformanceFilterState;
    let positionId: number;
    let entityTypes: Array<{ entityTypeName: string, entityTypeId: string }>;

    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        positionId = action.payload.positionId;
        filter = action.payload.filter;

        return this.myPerformanceApiService.getResponsibilities(positionId)
          .map((response: PeopleResponsibilitiesDTO) => {
            roleGroups = this.responsibilitiesTransformerService.groupPeopleByRoleGroups(response.positions);
            entityTypes = Object.keys(roleGroups).map((roleGroup: string) => {
              return {
                entityTypeName: roleGroup,
                entityTypeId: roleGroups[roleGroup][0].type
              };
            });

            if (response.positions) entityType = ViewType.roleGroups;
          });
        })
        .concatMap(() => {
          return this.myPerformanceApiService.getResponsibilitiesPerformanceTotals(positionId, entityTypes, filter)
            .mergeMap((response: Array<RoleGroupPerformanceTotalDTO>) => {
              const roleGroupPerformanceTotals = this.performanceTotalTransformerService.transformRoleGroupPerformanceTotalDTO(response);

              return Observable.from([
                new ViewTypeActions.SetLeftMyPerformanceTableViewType(entityType),
                new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
                  positionId: positionId,
                  responsibilities: roleGroups,
                  performanceTotals: roleGroupPerformanceTotals
                })
              ]);
            });
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
