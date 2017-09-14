import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { ResponsibilitiesService, ResponsibilitiesData } from '../../services/responsibilities.service';
import { ViewType } from '../../enums/view-type.enum';
import * as ViewTypeActions from '../../state/actions/view-types.action';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private responsibilitiesService: ResponsibilitiesService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION)
      .switchMap((action: Action) => {
        const responsibilitiesData: ResponsibilitiesData = {
          filter: action.payload.filter,
          positionId: action.payload.positionId
        };

        return Observable.of(responsibilitiesData);
      })
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceTotalForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
  }

  @Effect()
  FetchResponsibilityEntityPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE)
      .switchMap((action: Action) => {
        const { entityType, entities, filter, entitiesTotalPerformances, viewType } = action.payload;

        return this.responsibilitiesService.getResponsibilitiesPerformanceTotals(entities, filter)
          .switchMap((entityPerformances: EntitiesPerformances[]) => {
            return Observable.from([
              new ResponsibilitiesActions.SetTableRowPerformanceTotal(entitiesTotalPerformances),
              new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityType),
              new ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess(entityPerformances),
              new ViewTypeActions.SetLeftMyPerformanceTableViewType(viewType)
            ]);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(err)));
    });
  }

  @Effect() fetchSubAccounts$(): any {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_SUBACCOUNTS_ACTION)
      .switchMap((action: Action) => Observable.of(action.payload))
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccounts(subAccountsData))
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccountsPerformanceTotals(subAccountsData))
      .switchMap((subAccountsData) => this.constructSubAccountsSuccessAction(subAccountsData))
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

  @Effect()
  fetchPerformanceTotal$(): Observable<Action> {
    return this.actions$
      .ofType(
        ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION,
        ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION
      )
      .switchMap((action: Action) => {
        const { positionId, filter } = action.payload;

        return this.responsibilitiesService.getPerformanceTotal(positionId, filter)
          .map((response: EntitiesTotalPerformances) => {
            return new ResponsibilitiesActions.FetchPerformanceTotalSuccessAction(response);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchPerformanceTotalFailureAction(err)));
      });
  }

  @Effect({dispatch: false})
  fetchPerformanceTotalFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION)
      .do(action => {
        console.error('Failed fetching performance total data', action.payload);
      });
  }

  private constructSuccessAction(responsibilitiesData: ResponsibilitiesData): Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetLeftMyPerformanceTableViewType(responsibilitiesData.viewType),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
        positionId: responsibilitiesData.positionId,
        groupedEntities: responsibilitiesData.groupedEntities,
        entitiesPerformances: responsibilitiesData.entitiesPerformances
      })
    ]);
  }

  private constructSubAccountsSuccessAction(subAccountsData: any): Observable<Action> {
    return Observable.from([
      new ResponsibilitiesActions.SetTableRowPerformanceTotal(subAccountsData.entitiesTotalPerformances),
      new ResponsibilitiesActions.FetchSubAccountsSuccessAction({
        groupedEntities: subAccountsData.groupedEntities,
        entitiesPerformances: subAccountsData.entitiesPerformances
      }),
      new ViewTypeActions.SetLeftMyPerformanceTableViewType(ViewType.subAccounts)
    ]);
  }
}
