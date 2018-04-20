import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { ListsApiService } from '../../services/api/v3/lists-api.service';
import * as ListActions from '../../state/actions/lists.action';
import { ListStoreDTO } from '../../models/lists/lists-store-dto.model';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListsSummaryDTO } from '../../models/lists/lists-header-dto.model';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListOpportunitiesDTO } from '../../models/lists/lists-opportunities-dto.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';

@Injectable()
export class ListsEffects {

  constructor(private actions$: Actions,
              private listsApiService: ListsApiService,
              private listsTransformerService: ListsTransformerService) {
  }

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
      .ofType(ListActions.FETCH_OPPS_FOR_LIST)
      .switchMap((action: ListActions.FetchOppsForList) => {
        return this.listsApiService.getOppsDataForList(action.payload.listId)
          .map((response: Array<ListOpportunitiesDTO>) => {
            // const transformedData: ListsSummary = this.listsTransformerService.formatListsSummaryData(response);
            console.log(response);
            const transformedData: Array<ListsOpportunities> = this.listsTransformerService.formatListOpportunitiesData(response);
            return new ListActions.FetchOppsForListSuccess(transformedData);
          })
          .catch((error: Error) => Observable.of(new ListActions.FetchOppsForListFailure(error)));
      });
  }
}
