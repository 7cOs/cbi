import { ActionStatus, State } from '../../enums/action-status.enum';
import * as ListsActions from '../actions/lists.action';
import { StoreHeaderDetails, Stores } from '../../models/lists.model';

export interface ListsState extends State {
  StoreDetailStatus: ActionStatus;
  headerInfoStatus: ActionStatus;
  stores: Stores;
  headerInfo?: StoreHeaderDetails;
}

export const initialState: ListsState = {
  StoreDetailStatus: ActionStatus.NotFetched,
  headerInfoStatus: ActionStatus.NotFetched,
  stores: {},
};

export interface ListsReducerState {
  current: ;
  versions: Array<>;
}

export function listsReducer(
  state: ListsState = initialState,
  action: ListsActions.Action
): ListsState {

  switch (action.type) {
    case ListsActions.FETCH_STORE_DETAILS:
      return Object.assign({}, state, {
        StoreDetailStatus: ActionStatus.Fetching
      });

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        StoreDetailStatus: ActionStatus.Fetched,
        stores: action.payload
      });

    case ListsActions.FETCH_STORE_DETAILS_FAILURE:
      return Object.assign({}, state, {
        StoreDetailStatus: ActionStatus.Error
      });

    case ListsActions.FETCH_HEADER_DETAILS:
      return Object.assign({}, state, {
        headerInfoStatus: ActionStatus.Fetching
      });

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        headerInfo: action.payload,
        headerInfoStatus: ActionStatus.Fetching
      });

    case ListsActions.FETCH_HEADER_DETAILS_FAILURE:
      return Object.assign({}, state, {
        headerInfoStatus: ActionStatus.Error
      });

    default:
      return state;
  }
}
