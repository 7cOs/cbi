import { Action } from '@ngrx/store';
import { ListsActionTypes } from '../../enums/list-action-type.enum';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

export interface FetchStoreDetailsPayload {
  listId: string;
}

export interface FetchHeaderDetailsPayload {
  listId: string;
}

export const FETCH_STORE_DETAILS = ListsActionTypes.FETCH_STORE_DETAILS;
export class FetchStoreDetails implements Action {
  readonly type = FETCH_STORE_DETAILS;

  constructor(public payload: FetchStoreDetailsPayload) { }
}

export const FETCH_STORE_DETAILS_SUCCESS = ListsActionTypes.FETCH_STORE_DETAILS_SUCCESS;
export class FetchStoreDetailsSuccess implements Action {
  readonly type = FETCH_STORE_DETAILS_SUCCESS;

  constructor(public payload: Array<StoreDetails>) { }
}

export const FETCH_STORE_DETAILS_FAILURE = ListsActionTypes.FETCH_STORE_DETAILS_FAILURE;
export class FetchStoreDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_HEADER_DETAILS = ListsActionTypes.FETCH_HEADER_DETAILS;
export class FetchHeaderDetails implements Action {
  readonly type = FETCH_HEADER_DETAILS;

  constructor(public payload: FetchHeaderDetailsPayload) { }
}

export const FETCH_HEADER_DETAILS_SUCCESS = ListsActionTypes.FETCH_HEADER_DETAILS_SUCCESS;
export class FetchHeaderDetailsSuccess implements Action {
  readonly type = FETCH_HEADER_DETAILS_SUCCESS;

  constructor(public payload: ListsSummary) { }
}

export const FETCH_HEADER_DETAILS_FAILURE = ListsActionTypes.FETCH_HEADER_DETAILS_FAILURE;
export class FetchHeaderDetailsFailure implements Action {
  readonly type = FETCH_HEADER_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_OPPS_FOR_LIST = ListsActionTypes.FETCH_OPPS_FOR_LIST;
export class FetchOppsForList implements Action {
  readonly type = FETCH_OPPS_FOR_LIST;

  constructor(public payload: any) { }
}

export const FETCH_OPPS_FOR_LIST_SUCCESS = ListsActionTypes.FETCH_OPPS_FOR_LIST_SUCCESS;
export class FetchOppsForListSuccess implements Action {
  readonly type = FETCH_OPPS_FOR_LIST_SUCCESS;

  constructor(public payload: any) { }
}

export const FETCH_OPPS_FOR_LIST_FAILURE = ListsActionTypes.FETCH_OPPS_FOR_LIST_FAILURE;
export class FetchOppsForListFailure implements Action {
  readonly type = FETCH_OPPS_FOR_LIST_FAILURE;

  constructor(public payload: Error) { }
}

export type Action =
  FetchStoreDetails
  | FetchStoreDetailsSuccess
  | FetchStoreDetailsFailure
  | FetchHeaderDetails
  | FetchHeaderDetailsSuccess
  | FetchHeaderDetailsFailure
  | FetchOppsForList
  | FetchOppsForListSuccess
  | FetchOppsForListFailure;
