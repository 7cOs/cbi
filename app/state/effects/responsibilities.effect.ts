import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { ResponsibilitiesService, ResponsibilitiesData, SubAccountData } from '../../services/responsibilities.service';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import * as ViewTypeActions from '../../state/actions/sales-hierarchy-view-type.action';

@Injectable()
export class ResponsibilitiesEffects {

  constructor(
    private actions$: Actions,
    private responsibilitiesService: ResponsibilitiesService
  ) { }

  @Effect()
  fetchResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES)
      .switchMap((action: Action) => {
        const responsibilitiesData: ResponsibilitiesData = {
          filter: action.payload.filter,
          positionId: action.payload.positionId
        };

        return Observable.of(responsibilitiesData);
      })
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateHierarchy(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  FetchEntityWithPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES)
      .switchMap((action: Action) => {
        const { entityType, entityTypeGroupName, entityTypeCode } = action.payload;
        const salesHierarchyViewType: SalesHierarchyViewType = this.responsibilitiesService.getEntityGroupViewType(entityType);

        return this.responsibilitiesService.getEntitiesWithPerformanceForGroup(action.payload)
          .switchMap((entityWithPerformance: EntityWithPerformance[]) => {
            return Observable.from([
              new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(entityTypeCode),
              new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityTypeGroupName),
              new ResponsibilitiesActions.FetchEntityWithPerformanceSuccess({
                entityWithPerformance: entityWithPerformance,
                entityTypeCode: entityTypeCode
              }),
              new ViewTypeActions.SetSalesHierarchyViewType(salesHierarchyViewType)
            ]);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
    });
  }

  @Effect() fetchSubAccounts$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_SUBACCOUNTS)
      .switchMap((action: Action): Observable<SubAccountData> => {
        return Observable.of(action.payload);
      })
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccounts(subAccountsData))
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccountsPerformances(subAccountsData))
      .switchMap((subAccountsData) => this.constructSubAccountsSuccessAction(subAccountsData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect() constructRoleGroups$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.CONSTRUCT_ROLE_GROUPS)
      .switchMap((action: Action) => Observable.of(action.payload))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.groupPeopleResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect({dispatch: false})
  fetchResponsibilitiesFailure$(): Observable<Action> {
    return this.actions$
    .ofType(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE)
    .do((action: Action) => {
      console.error('Responsibilities fetch failure:', action.payload);
    });
  }

  @Effect()
  fetchPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(
        ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE,
        ResponsibilitiesActions.FETCH_RESPONSIBILITIES
      )
      .switchMap((action: Action) => {
        const { positionId, filter } = action.payload;

        return this.responsibilitiesService.getPerformance(positionId, filter)
          .map((response: Performance) => {
            return new ResponsibilitiesActions.FetchTotalPerformanceSuccess(response);
          })
          .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchTotalPerformanceFailure(err)));
      });
  }

  @Effect({dispatch: false})
  fetchPerformanceFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE)
      .do(action => {
        console.error('Failed fetching performance total data', action.payload);
      });
  }

  private constructSuccessAction(responsibilitiesData: ResponsibilitiesData): Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetSalesHierarchyViewType(responsibilitiesData.salesHierarchyViewType),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: responsibilitiesData.positionId,
        groupedEntities: responsibilitiesData.groupedEntities,
        entityWithPerformance: responsibilitiesData.entityWithPerformance
      })
    ]);
  }

  private constructSubAccountsSuccessAction(subAccountsData: SubAccountData): Observable<Action> {
    return Observable.from([
      new ResponsibilitiesActions.SetTotalPerformance(subAccountsData.selectedPositionId),
      new ResponsibilitiesActions.FetchSubAccountsSuccessAction({
        groupedEntities: subAccountsData.groupedEntities,
        entityWithPerformance: subAccountsData.entityWithPerformance
      }),
      new ViewTypeActions.SetSalesHierarchyViewType(SalesHierarchyViewType.subAccounts)
    ]);
  }
}
