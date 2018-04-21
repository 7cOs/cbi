import { ActionStatus } from '../../enums/action-status.enum';
import * as ListsActions from '../actions/lists.action';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

interface ListSummaryState {
  summaryStatus: ActionStatus;
  summaryData: ListsSummary;
}

interface ListStoresState {
  storeStatus: ActionStatus;
  stores: StoreDetails[];
}

interface ListsOpportunitiesState {
  opportunitiesStatus: ActionStatus;
  opportunities: ListsOpportunities[];
}

export interface ListsState {
  listSummary: ListSummaryState;
  listStores: ListStoresState;
  listOpportunities: ListsOpportunitiesState;
}

export const initialState: ListsState = {
    listSummary: {
      summaryStatus: ActionStatus.NotFetched,
      summaryData: {
        archived: false,
        description: null,
        id: null,
        name: null,
        closedOpportunities: null,
        totalOpportunities: null,
        numberOfAccounts: null,
        ownerFirstName: null,
        ownerLastName: null
      }
    },
    listStores: {
      storeStatus: ActionStatus.NotFetched,
      stores: []
    },
    listOpportunities: {
      opportunitiesStatus: ActionStatus.NotFetched,
      opportunities: []
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
        }),
        listOpportunities: state.listOpportunities
      };

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Fetched,
          stores: action.payload
        }),
        listOpportunities: state.listOpportunities
      };

    case ListsActions.FETCH_STORE_DETAILS_FAILURE:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities
      };

    case ListsActions.FETCH_HEADER_DETAILS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities
      };

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetched,
          summaryData: action.payload
        }),
        listOpportunities: state.listOpportunities
      };

    case ListsActions.FETCH_HEADER_DETAILS_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities
      };
      case ListsActions.FETCH_OPPS_FOR_LIST:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunityStatus: ActionStatus.Fetching
        })
      };
      case ListsActions.FETCH_OPPS_FOR_LIST_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunityStatus: ActionStatus.Fetched,
          opportunities: action.payload
        })
      };
      case ListsActions.FETCH_OPPS_FOR_LIST_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunityStatus: ActionStatus.Error,
        })
      };
    default:
      return state;
  }
}
