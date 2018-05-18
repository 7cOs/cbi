import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { CopyToListToastType } from '../../enums/lists/copy-to-list-toast-type.enum';
import * as ListActions from '../../state/actions/lists.action';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../../models/lists/list-performance-dto.model';
import { ListsActionTypes } from '../../enums/list-action-type.enum';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListStoreDTO } from '../../models/lists/lists-store-dto.model';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../../models/lists/lists-header-dto.model';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { ListOpportunityDTO } from '../../models/lists/lists-opportunities-dto.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { V3List } from '../../models/lists/v3-list.model';

@Injectable()
export class ListsEffects {

  constructor(
    private actions$: Actions,
    private listsApiService: ListsApiService,
    private listsTransformerService: ListsTransformerService,
    @Inject('toastService') private toastService: any
  ) { }

  @Effect()
  fetchStoreDetails$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_STORE_DETAILS)
      .switchMap((action: ListActions.FetchStoreDetails) => {
        return this.listsApiService.getStoreListDetails(action.payload.listId)
          .map((response: Array<ListStoreDTO>) => {
            console.log(response);
            const transformedData: Array<StoreDetails> = this.listsTransformerService.formatStoresData(response);
            return new ListActions.FetchStoreDetailsSuccess(transformedData);
          })
          .catch((error: Error) => Observable.of(new ListActions.FetchStoreDetailsFailure(error)));
      });
  }

  @Effect({dispatch: false})
  fetchStoreDetailsFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_STORE_DETAILS_FAILURE)
      .do((action: ListActions.FetchStoreDetailsFailure) => {
        console.error('StoreDetail fetch failure:', action.payload);
      });
  }

  @Effect()
  fetchHeaderDetails$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_HEADER_DETAILS)
      .switchMap((action: ListActions.FetchHeaderDetails) => {
        return this.listsApiService.getListSummary(action.payload.listId)
          .map((response: ListsSummaryDTO) => {
            const transformedData: ListsSummary = this.listsTransformerService.formatListsSummaryData(response);
            return new ListActions.FetchHeaderDetailsSuccess(transformedData);
          })
          .catch((error: Error) => Observable.of(new ListActions.FetchHeaderDetailsFailure(error)));
      });
  }

  @Effect({dispatch: false})
  fetchHeaderDetailsFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_HEADER_DETAILS_FAILURE)
      .do((action: ListActions.FetchHeaderDetailsFailure) => {
        console.error('Header fetch failure:', action.payload);
      });
  }

  @Effect()
  fetchOppsforList$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.FETCH_OPPS_FOR_LIST)
      .switchMap((action: ListActions.FetchOppsForList) => {
        return this.listsApiService.getOppsDataForList(action.payload.listId)
          .map((response: Array<ListOpportunityDTO>) => {
            const transformedData: Array<ListsOpportunities> = this.listsTransformerService.formatListOpportunitiesData(response);
            const groupedOpportunities = this.listsTransformerService.groupOppsByStore(transformedData);
            return new ListActions.FetchOppsForListSuccess(groupedOpportunities);
          })
          .catch((error: Error) => Observable.of(new ListActions.FetchOppsForListFailure(error)));
      });
  }

  @Effect({dispatch: false})
  fetchOppsforListFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.FETCH_OPPS_FOR_LIST_FAILURE)
      .do((action: ListActions.FetchOppsForListFailure) => {
        console.error('Opportunities fetch failure:', action.payload);
      });
  }

  @Effect()
  fetchListPerformanceVolume$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME)
      .switchMap((action: ListActions.FetchListPerformanceVolume) => {
        return this.listsApiService.getListStorePerformance(
          action.payload.listId,
          action.payload.performanceType,
          action.payload.beverageType,
          action.payload.dateRangeCode
        )
        .map((response: ListPerformanceDTO) => {
          const listPerformance: ListPerformance = this.listsTransformerService.transformListPerformanceDTO(response);

          return new ListActions.FetchListPerformanceVolumeSuccess(listPerformance);
        })
        .catch((error: Error) => Observable.of(new ListActions.FetchListPerformanceVolumeError(error)));
      });
  }

  @Effect()
  copyStoresToList$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.COPY_STORES_TO_LIST)
      .switchMap((action: ListActions.CopyStoresToList) => {
        return this.listsApiService.addStoresToList(action.payload.listId, {storeSourceCode: action.payload.id})
          .map(() => {
            this.toastService.showCopyToListToast(CopyToListToastType.CopyStores);
            return new ListActions.CopyStoresToListSuccess;
          })
          .catch(() => {
            this.toastService.showCopyToListToast(CopyToListToastType.CopyStoresError);
            return Observable.of(new ListActions.CopyStoresToListError);
          });
      });
  }

  @Effect()
  copyOppsToList$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.COPY_OPPS_TO_LIST)
      .switchMap((action: ListActions.CopyOppsToList) => {
        return this.listsApiService.addOpportunitiesToList(action.payload.listId, action.payload.ids)
          .map(() => {
            this.toastService.showCopyToListToast(CopyToListToastType.CopyOpps);
            return new ListActions.CopyOppsToListSuccess;
          })
          .catch(() => {
            this.toastService.showCopyToListToast(CopyToListToastType.CopyOppsError);
            return Observable.of(new ListActions.CopyOppsToListError);
          });
      });
  }

  @Effect()
  fetchListPerformancePOD$(): Observable<Action> {
    return this.actions$
      .ofType(ListsActionTypes.FETCH_LIST_PERFORMANCE_POD)
      .switchMap((action: ListActions.FetchListPerformancePOD) => {
        return this.listsApiService.getListStorePerformance(
          action.payload.listId,
          action.payload.performanceType,
          action.payload.beverageType,
          action.payload.dateRangeCode
        )
        .map((response: ListPerformanceDTO) => {
          const listPerformance: ListPerformance = this.listsTransformerService.transformListPerformanceDTO(response);

          return new ListActions.FetchListPerformancePODSuccess(listPerformance);
        })
        .catch((error: Error) => Observable.of(new ListActions.FetchListPerformancePODError(error)));
      });
  }

  @Effect()
  fetchLists$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_LISTS)
      .switchMap((action: ListActions.FetchLists) => {
        return this.listsApiService.getLists()
          .map((response: V3List[]) => {
            const groupedLists = this.listsTransformerService.groupLists(response, action.payload.currentUserEmployeeID);
            return new ListActions.FetchListsSuccess(groupedLists);
          })
          .catch((error: Error) => Observable.of(new ListActions.FetchListsFailure(error)));
      });
  }

  @Effect()
  patchList$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.PATCH_LIST)
      .switchMap((action: ListActions.PatchList) => {
        const convertedPayload = this.listsTransformerService.convertCollaborators(action.payload);
        return this.listsApiService.updateList(convertedPayload, action.payload.id)
        .map((response: ListsSummaryDTO) => {
          const transformedData: ListsSummary = this.listsTransformerService.formatListsSummaryData(response);
          return new ListActions.PatchListSuccess(transformedData);
        })
        .catch((error: Error) => Observable.of(new ListActions.PatchListFailure(error)));
      });
  }

  @Effect({dispatch: false})
  patchListFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.PATCH_LIST_FAILURE)
      .do((action: ListActions.PatchListFailure) => {
        console.error('Update List failure:', action.payload);
      });
  }
}
