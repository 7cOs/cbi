import { ActionStatus } from '../../enums/action-status.enum';
import { ListPerformance } from '../../models/lists/list-performance.model';
import * as ListsActions from '../actions/lists.action';
import { ListsActionTypes } from '../../enums/list-action-type.enum';
import { ListsSummary } from '../../models/lists/lists-header.model';
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
  opportunities: {};
}

interface ListPerformanceState {
  pod: ListPerformance;
  podStatus: ActionStatus;
  volume: ListPerformance;
  volumeStatus: ActionStatus;
}

export interface ListsState {
  listSummary: ListSummaryState;
  listStores: ListStoresState;
  listOpportunities: ListsOpportunitiesState;
  performance: ListPerformanceState;
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
      ownerLastName: null,
      collaborators: null,
      ownerId: null,
      collaboratorType: null,
      category: null,
      type: null
    }
  },
  listStores: {
    storeStatus: ActionStatus.NotFetched,
    stores: []
  },
  listOpportunities: {
    opportunitiesStatus: ActionStatus.NotFetched,
    opportunities: {}
  },
  performance: {
    podStatus: ActionStatus.NotFetched,
    pod: null,
    volumeStatus: ActionStatus.NotFetched,
    volume: null
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
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Fetched,
          stores: action.payload
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_STORE_DETAILS_FAILURE:
      return {
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_HEADER_DETAILS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetched,
          summaryData: action.payload
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_HEADER_DETAILS_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActionTypes.FETCH_OPPS_FOR_LIST:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Fetching
        }),
        performance: state.performance
      };

    case ListsActionTypes.FETCH_OPPS_FOR_LIST_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Fetched,
          opportunities: action.payload
        }),
        performance: state.performance
      };

    case ListsActionTypes.FETCH_OPPS_FOR_LIST_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Error
        }),
        performance: state.performance
      };

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          volumeStatus: ActionStatus.Fetching
        })
      });

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_SUCCESS:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          volumeStatus: ActionStatus.Fetched,
          volume: action.payload
        })
      });

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_ERROR:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          volumeStatus: ActionStatus.Error
        })
      });

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_POD:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          podStatus: ActionStatus.Fetching
        })
      });

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_SUCCESS:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          podStatus: ActionStatus.Fetched,
          pod: action.payload
        })
      });

    case ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_ERROR:
      return Object.assign({}, state, {
        performance: Object.assign({}, state.performance, {
          podStatus: ActionStatus.Error
        })
      });

    case ListsActions.PATCH_LIST:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.PATCH_LIST_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetched,
          summaryData: action.payload
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.PATCH_LIST_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

      case ListsActions.DELETE_STORE_FROM_LIST:
      return {
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Deleting
        }),
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Deleting
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

      case ListsActions.DELETE_STORE_FROM_LIST_SUCCESS:
      return {
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.DeleteSuccess
        }),
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.DeleteSuccess
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

      case ListsActions.DELETE_STORE_FROM_LIST_FAILURE:
      return {
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Error
        }),
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

      case ListsActions.DELETE_OPP_FROM_LIST:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Deleting
        }),
        performance: state.performance
      };

      case ListsActions.DELETE_OPP_FROM_LIST_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.DeleteSuccess
        }),
        performance: state.performance
      };

      case ListsActions.DELETE_OPP_FROM_LIST_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Error
        }),
        performance: state.performance
      };

    default:
      return state;
  }
}
