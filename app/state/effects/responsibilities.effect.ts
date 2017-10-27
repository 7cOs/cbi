import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { FetchAlternateHierarchyResponsibilitiesPayload,
         FetchSubAccountsPayload,
         FetchResponsibilitiesPayload } from '../../state/actions/responsibilities.action';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import {
  ResponsibilitiesService,
  ResponsibilitiesData,
  SubAccountData,
  RefreshAllPerformancesData,
  FetchEntityWithPerformanceData,
  RefreshEntitiesTotalPerformancesData
} from '../../services/responsibilities.service';
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
      .switchMap((action: Action): Observable<FetchResponsibilitiesPayload> => Observable.of(action.payload))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateHierarchy(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.checkEmptyResponsibilitiesResponse(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructFetchResponsibilitiesSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  fetchAlternateHierarchyResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES)
      .switchMap((action: Action): Observable<FetchAlternateHierarchyResponsibilitiesPayload> => Observable.of(action.payload))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAccountsDistributors(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.checkEmptyResponsibilitiesResponse(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructFetchAlternateHierarchySuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  FetchEntityWithPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES)
      .switchMap((action: Action): Observable<FetchEntityWithPerformanceData> => Observable.of(action.payload))
      .switchMap((fetchEntityWithPerformanceData: FetchEntityWithPerformanceData) =>
        this.responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceData))
      .switchMap((fetchEntityWithPerformanceData: FetchEntityWithPerformanceData) => {
        const salesHierarchyViewType: SalesHierarchyViewType = this.responsibilitiesService
          .getEntityGroupViewType(fetchEntityWithPerformanceData.entityType);

        return Observable.from([
          new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(fetchEntityWithPerformanceData.entityTypeCode),
          new ResponsibilitiesActions.GetPeopleByRoleGroup(fetchEntityWithPerformanceData.entityTypeGroupName),
          new ResponsibilitiesActions.FetchEntityWithPerformanceSuccess({
            entityWithPerformance: fetchEntityWithPerformanceData.entityWithPerformance,
            entityTypeCode: fetchEntityWithPerformanceData.entityTypeCode
          }),
          new ViewTypeActions.SetSalesHierarchyViewType(salesHierarchyViewType)
        ]);
      })
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  RefreshAllPerformances(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.REFRESH_ALL_PERFORMANCES)
      .switchMap((action: Action): Observable<RefreshAllPerformancesData> => Observable.of(action.payload))
      .switchMap((refreshAllPerformancesData: RefreshAllPerformancesData) =>
        this.responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData))
      .switchMap((refreshAllPerformancesData: RefreshAllPerformancesData) =>
        this.constructRefreshAllPerformancesSuccessAction(refreshAllPerformancesData))
      .catch((error: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(error)));
  }

  @Effect()
  RefreshEntitiesTotalPerformances(): Observable<Action> {
  return this.actions$
    .ofType(
      ResponsibilitiesActions.REFRESH_ALL_PERFORMANCES
    )
    .switchMap((action: Action) => Observable.of(action.payload))
    // TODO: Extract this function into responsibilities.service
    .switchMap((refreshEntitiesTotalPerformancesData: RefreshEntitiesTotalPerformancesData) => {
      if (refreshEntitiesTotalPerformancesData.salesHierarchyViewType === SalesHierarchyViewType.roleGroups
        || refreshEntitiesTotalPerformancesData.salesHierarchyViewType === SalesHierarchyViewType.accounts
        || refreshEntitiesTotalPerformancesData.salesHierarchyViewType === SalesHierarchyViewType.distributors) {
        return this.responsibilitiesService.getPerformance(
          refreshEntitiesTotalPerformancesData.positionId,
          refreshEntitiesTotalPerformancesData.filter,
          refreshEntitiesTotalPerformancesData.brandCode
        )
          .map((response: Performance) => {
            return Object.assign({}, refreshEntitiesTotalPerformancesData, {
              entitiesTotalPerformances: response
            });
          });
      } else if (refreshEntitiesTotalPerformancesData.salesHierarchyViewType === SalesHierarchyViewType.subAccounts) {
        return this.responsibilitiesService.getAccountPerformances(
          refreshEntitiesTotalPerformancesData.accountPositionId,
          refreshEntitiesTotalPerformancesData.filter,
          refreshEntitiesTotalPerformancesData.positionId,
          refreshEntitiesTotalPerformancesData.brandCode)
          .map((response: Performance) => {
            return Object.assign({}, refreshEntitiesTotalPerformancesData, {
              entitiesTotalPerformances: response
            });
          });
    } else {
        return this.responsibilitiesService.getRefreshEntitiesTotalPerformances(refreshEntitiesTotalPerformancesData);
      }
    })
    .switchMap((refreshEntitiesTotalPerformancesData: RefreshEntitiesTotalPerformancesData) => {
      return Observable.of(
        new ResponsibilitiesActions.FetchTotalPerformanceSuccess(refreshEntitiesTotalPerformancesData.entitiesTotalPerformances)
      );
    })
    .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchTotalPerformanceFailure(err)));
  }

  @Effect() fetchSubAccounts$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_SUBACCOUNTS)
      .switchMap((action: Action): Observable<FetchSubAccountsPayload> => Observable.of(action.payload))
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccounts(subAccountsData))
      .switchMap((subAccountsData) => this.responsibilitiesService.checkEmptySubaccountsResponse(subAccountsData))
      .switchMap((subAccountsData) => this.responsibilitiesService.getSubAccountsPerformances(subAccountsData))
      .switchMap((subAccountsData) => this.constructSubAccountsSuccessAction(subAccountsData))
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
        const { positionId, filter, brandCode } = action.payload;

        return this.responsibilitiesService.getPerformance(positionId, filter, brandCode)
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

  private constructFetchResponsibilitiesSuccessAction(responsibilitiesData: ResponsibilitiesData): Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetSalesHierarchyViewType(responsibilitiesData.salesHierarchyViewType),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: responsibilitiesData.positionId,
        groupedEntities: responsibilitiesData.groupedEntities,
        hierarchyGroups: responsibilitiesData.hierarchyGroups,
        entityWithPerformance: responsibilitiesData.entityWithPerformance
      })
    ]);
  }

  private constructFetchAlternateHierarchySuccessAction(responsibilitiesData: ResponsibilitiesData): Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetSalesHierarchyViewType(responsibilitiesData.salesHierarchyViewType),
      new ResponsibilitiesActions.SetTotalPerformance(responsibilitiesData.positionId),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: responsibilitiesData.positionId,
        groupedEntities: responsibilitiesData.groupedEntities,
        hierarchyGroups: responsibilitiesData.hierarchyGroups,
        entityWithPerformance: responsibilitiesData.entityWithPerformance
      })
    ]);
  }

  private constructRefreshAllPerformancesSuccessAction(refreshAllPerformancesData: RefreshAllPerformancesData): Observable<Action> {
    return Observable.from([
      new ViewTypeActions.SetSalesHierarchyViewType(refreshAllPerformancesData.salesHierarchyViewType),
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess({
        positionId: refreshAllPerformancesData.positionId,
        groupedEntities: refreshAllPerformancesData.groupedEntities,
        hierarchyGroups: refreshAllPerformancesData.hierarchyGroups,
        entityWithPerformance: refreshAllPerformancesData.entityWithPerformance
      })
    ]);
  }

  private constructSubAccountsSuccessAction(subAccountsData: SubAccountData): Observable<Action> {
    return Observable.from([
      new ResponsibilitiesActions.SetTotalPerformance(subAccountsData.selectedPositionId),
      new ResponsibilitiesActions.FetchSubAccountsSuccess({
        groupedEntities: subAccountsData.groupedEntities,
        entityWithPerformance: subAccountsData.entityWithPerformance
      }),
      new ResponsibilitiesActions.SetAccountPositionId(subAccountsData.positionId),
      new ViewTypeActions.SetSalesHierarchyViewType(SalesHierarchyViewType.subAccounts)
    ]);
  }
}
