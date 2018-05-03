import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { FetchAlternateHierarchyResponsibilitiesPayload,
         FetchResponsibilitiesPayload,
         FetchSubAccountsPayload } from '../../state/actions/responsibilities.action';
import { FetchEntityWithPerformanceData,
         RefreshAllPerformancesData,
         RefreshTotalPerformanceData,
         ResponsibilitiesData,
         ResponsibilitiesService,
         SubAccountData } from '../../services/responsibilities.service';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
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
      .switchMap((action: ResponsibilitiesActions.FetchResponsibilities): Observable<FetchResponsibilitiesPayload> =>
        Observable.of(action.payload))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getEntityURIResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateHierarchy(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateEntityURIResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.checkEmptyResponsibilitiesResponse(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructFetchResponsibilitiesSuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  fetchAlternateHierarchyResponsibilities$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES)
      .switchMap((action: ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities):
        Observable<FetchAlternateHierarchyResponsibilitiesPayload> => Observable.of(action.payload))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getEntityURIResponsibilities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.checkEmptyResponsibilitiesResponse(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesData))
      .switchMap((responsibilitiesData) => this.constructFetchAlternateHierarchySuccessAction(responsibilitiesData))
      .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(err)));
  }

  @Effect()
  FetchEntityWithPerformance$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES)
      .switchMap((action: ResponsibilitiesActions.FetchEntityWithPerformance): Observable<FetchEntityWithPerformanceData> =>
        Observable.of(action.payload))
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
  RefreshAllPerformances$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.REFRESH_ALL_PERFORMANCES)
      .switchMap((action: ResponsibilitiesActions.RefreshAllPerformances): Observable<RefreshAllPerformancesData> =>
        Observable.of(action.payload))
      .switchMap((refreshAllPerformancesData: RefreshAllPerformancesData) =>
        this.responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData))
      .switchMap((refreshAllPerformancesData: RefreshAllPerformancesData) =>
        this.constructRefreshAllPerformancesSuccessAction(refreshAllPerformancesData))
      .catch((error: Error) => Observable.of(new ResponsibilitiesActions.FetchResponsibilitiesFailure(error)));
  }

  @Effect()
  RefreshTotalPerformance$(): Observable<Action> {
  return this.actions$
    .ofType(ResponsibilitiesActions.REFRESH_ALL_PERFORMANCES)
    .switchMap((action: ResponsibilitiesActions.RefreshAllPerformances) => Observable.of(action.payload))
    .switchMap((refreshTotalPerformanceData: RefreshTotalPerformanceData) =>
      this.responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData))
    .switchMap((refreshTotalPerformanceData: RefreshTotalPerformanceData) => {
      return Observable.of(
        new ResponsibilitiesActions.FetchTotalPerformanceSuccess(refreshTotalPerformanceData.entitiesTotalPerformances)
      );
    })
    .catch((err: Error) => Observable.of(new ResponsibilitiesActions.FetchTotalPerformanceFailure(err)));
  }

  @Effect() fetchSubAccounts$(): Observable<Action> {
    return this.actions$
      .ofType(ResponsibilitiesActions.FETCH_SUBACCOUNTS)
      .switchMap((action: ResponsibilitiesActions.FetchSubAccounts): Observable<FetchSubAccountsPayload> => Observable.of(action.payload))
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
    .do((action: ResponsibilitiesActions.FetchResponsibilitiesFailure) => {
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
      .switchMap((action: ResponsibilitiesActions.FetchTotalPerformance | ResponsibilitiesActions.FetchResponsibilities) => {
        const { positionId, filter, brandSkuCode, skuPackageType } = action.payload;

        return this.responsibilitiesService.getPerformance(positionId, filter, brandSkuCode, skuPackageType)
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
      .do((action: ResponsibilitiesActions.FetchTotalPerformanceFailure) => {
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
