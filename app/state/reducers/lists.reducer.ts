import { ActionStatus, State } from '../../enums/action-status.enum';
import * as ListsActions from '../actions/lists.action';
import { StoreDetailsRow, StoreHeaderDetails } from '../../models/lists.model';

export interface ListsState extends State {
  status: ActionStatus;
  headerInfoStatus: ActionStatus;
  stores: Array<StoreDetailsRow>;
  headerInfo?: StoreHeaderDetails;
}

export const initialState: ListsState = {
  status: ActionStatus.NotFetched,
  headerInfoStatus: ActionStatus.NotFetched,
  stores: [],
};

export function listsReducer(
  state: ListsState = initialState,
  action: ListsActions.Action
): ListsState {

  switch (action.type) {
    case ListsActions.FETCH_STORE_DETAILS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        stores: action.payload
      });

    case ListsActions.FETCH_STORE_DETAILS_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ListsActions.FETCH_HEADER_DETAILS:
      return Object.assign({}, state, {
        headerInfoStatus: ActionStatus.Fetching
      });

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        headerInfo: action.payload,
        headerInfoStatus: ActionStatus.Fetched
      });

    case ListsActions.FETCH_HEADER_DETAILS_FAILURE:
      return Object.assign({}, state, {
        headerInfoStatus: ActionStatus.Error
      });

    default:
      return state;
  }
}
