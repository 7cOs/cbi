import { Action } from '@ngrx/store';
import { StoreDetailsRow, StoreHeaderDetails } from '../../models/lists.model';

export interface FetchStoreDetailsPayload {
  listId: string;
}

export interface FetchHeaderDetailsPayload {
  listId: string;
}

export const FETCH_STORE_DETAILS = '[StoreDetails] FETCH_STORE_DETAILS';
export class FetchStoreDetails implements Action {
  readonly type = FETCH_STORE_DETAILS;

  constructor(public payload: FetchStoreDetailsPayload) { }
}

export const FETCH_STORE_DETAILS_SUCCESS = '[StoreDetails] FETCH_STORE_DETAILS_SUCCESS';
export class FetchStoreDetailsSuccess implements Action {
  readonly type = FETCH_STORE_DETAILS_SUCCESS;

  constructor(public payload: Array<StoreDetailsRow>) { }
}

export const FETCH_STORE_DETAILS_FAILURE = '[StoreDetails] FETCH_STORE_DETAILS_FAILURE';
export class FetchStoreDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_HEADER_DETAILS = '[StoreDetails] FETCH_HEADER_DETAILS';
export class FetchHeaderDetails implements Action {
  readonly type = FETCH_HEADER_DETAILS;

  constructor(public payload: FetchHeaderDetailsPayload) { }
}

export const FETCH_HEADER_DETAILS_SUCCESS = '[StoreDetails] FETCH_HEADER_DETAILS_SUCCESS';
export class FetchHeaderDetailsSuccess implements Action {
  readonly type = FETCH_HEADER_DETAILS_SUCCESS;

  constructor(public payload: StoreHeaderDetails) { }
}

export const FETCH_HEADER_DETAILS_FAILURE = '[StoreDetails] FETCH_STORE_DETAILS_FAILURE';
export class FetchHeaderDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export type Action =
  FetchStoreDetails
  | FetchStoreDetailsSuccess
  | FetchStoreDetailsFailure
  | FetchHeaderDetails
  | FetchHeaderDetailsSuccess
  | FetchHeaderDetailsFailure;
