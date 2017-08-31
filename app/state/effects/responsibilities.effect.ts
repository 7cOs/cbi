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
import { ResponsibilityEntityPerformanceDTO } from '../../models/entity-responsibilities.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroups } from '../../models/role-groups.model';
import { SetTableRowPerformanceTotal } from '../../state/actions/performance-total.action';
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
    let entityTypes: Array<{ id: number, type: string, name: string }>;

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
                id: positionId,
                type: roleGroups[roleGroup][0].type,
                name: roleGroup
              };
            });

            if (response.positions) entityType = ViewType.roleGroups;
          });
        })
        .concatMap(() => {
          return this.myPerformanceApiService.getResponsibilitiesPerformanceTotals(entityTypes, filter)
            .mergeMap((response: ResponsibilityEntityPerformanceDTO[]) => {
              const roleGroupPerformanceTotals = this.performanceTotalTransformerService.transformEntityPerformanceTotalDTO(response);

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

  @Effect() FetchResponsibilityEntityPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE)
      .switchMap((action: Action) => {
        const { entityType, entities, filter, performanceTotal, viewType } = action.payload;

        return this.myPerformanceApiService.getResponsibilitiesPerformanceTotals(entities, filter)
          .switchMap((response: ResponsibilityEntityPerformanceDTO[]) => {
            const entityPerformance = this.performanceTotalTransformerService.transformEntityPerformanceTotalDTO(response);

            return Observable.from([
              new SetTableRowPerformanceTotal(performanceTotal),
              new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityType),
              new ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess(entityPerformance),
              new ViewTypeActions.SetLeftMyPerformanceTableViewType(viewType)
            ]);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
    });
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
