import { ActionStatus } from '../../enums/action-status.enum';
import * as ListsActions from '../actions/lists.action';
import { ListsSummary } from '../../models/lists-header.model';
import { StoreDetails } from '../../models/lists-store.model';

interface ListSummaryState {
  summaryStatus: ActionStatus;
  summaryData: ListsSummary;
}

interface ListStoresState {
  storeStatus: ActionStatus;
  stores: StoreDetails[];
}

export interface ListsState {
  listSummary: ListSummaryState;
  listStores: ListStoresState;
}

export const initialState: ListsState = {
    listSummary: {
      summaryStatus: ActionStatus.NotFetched,
      summaryData: {
        archived: false,
        description: '',
        id: Number(''),
        name: '',
        closedOpportunities: Number(''),
        totalOpportunities: Number(''),
        numberOfAccounts: Number(''),
        ownerFirstName: '',
        ownerLastName: ''
      }
    },
    listStores: {
      storeStatus: ActionStatus.NotFetched,
      stores: []
    }
};

export function listsReducer(
  state: ListsState = initialState,
  action: ListsActions.Action
): ListsState {

  switch (action.type) {
    case ListsActions.FETCH_STORE_DETAILS:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Fetching
        })
      };

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Fetched,
          stores: action.payload
        })
      };

    case ListsActions.FETCH_STORE_DETAILS_FAILURE:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Error
        })
      };

    case ListsActions.FETCH_HEADER_DETAILS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        })
      };

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching,
          summaryData: action.payload
        })
      };

    case ListsActions.FETCH_HEADER_DETAILS_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        })
      };

    default:
      return state;
  }
}
