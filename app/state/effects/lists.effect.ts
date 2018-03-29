import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { ListsApiService } from '../../services/api/v3/lists-api.service';
import * as ListActions from '../../state/actions/lists.action';
import { StoreListDTO } from '../../models/lists-store-dto.model';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListHeaderInfoDTO } from '../../models/lists-store-header-dto.model';

@Injectable()
export class ListsEffects {

  constructor(private actions$: Actions,
              private listsApiService: ListsApiService,
              private listsTransformerService: ListsTransformerService) {
  }

  @Effect()
  fetchStoreDetail$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_STORE_DETAILS)
      .switchMap((action: ListActions.FetchStoreDetails) => this.listsApiService.getStorePerformance(action.payload.listId))
      .switchMap((response: Array<StoreListDTO>) =>
        Observable.of(new ListActions.FetchStoreDetailsSuccess(this.listsTransformerService.formatStoresData(response))))
      .catch((error: Error) => Observable.of(new ListActions.FetchStoreDetailsFailure(error)));
  }

  @Effect({dispatch: false})
  fetchStoreFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_STORE_DETAILS_FAILURE)
      .do((action: ListActions.FetchStoreDetailsFailure) => {
        console.error('StoreDetail fetch failure:', action.payload);
      });
  }

  @Effect()
  fetchHeaderDetail$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_HEADER_DETAILS)
      .switchMap((action: ListActions.FetchHeaderDetails) => this.listsApiService.getHeaderDetail(action.payload.listId))
      .switchMap((response: ListHeaderInfoDTO) =>
        Observable.of(new ListActions.FetchHeaderDetailsSuccess(this.listsTransformerService.formatListHeaderData(response))))
      .catch((error: Error) => Observable.of(new ListActions.FetchHeaderDetailsFailure(error)));
  }

  @Effect({dispatch: false})
  fetchHeaderDetailFailure$(): Observable<Action> {
    return this.actions$
      .ofType(ListActions.FETCH_HEADER_DETAILS_FAILURE)
      .do((action: ListActions.FetchHeaderDetailsFailure) => {
        console.error('Header fetch failure:', action.payload);
      });
  }
}
