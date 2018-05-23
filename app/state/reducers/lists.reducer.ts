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
  manageListStatus: ActionStatus;
  listSummary: ListSummaryState;
  listStores: ListStoresState;
  listOpportunities: ListsOpportunitiesState;
  performance: ListPerformanceState;
}

export const initialState: ListsState = {
  manageListStatus: ActionStatus.NotFetched,
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
        manageListStatus: ActionStatus.NotFetched,
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_STORE_DETAILS_SUCCESS:
      return {
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
        listSummary:  state.listSummary,
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_HEADER_DETAILS:
      return {
        manageListStatus: state.manageListStatus,
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.FETCH_HEADER_DETAILS_SUCCESS:
      return {
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActionTypes.FETCH_OPPS_FOR_LIST:
      return {
        manageListStatus: state.manageListStatus,
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Fetching
        }),
        performance: state.performance
      };

    case ListsActionTypes.FETCH_OPPS_FOR_LIST_SUCCESS:
      return {
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Fetching
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActions.PATCH_LIST_SUCCESS:
      return {
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
        listStores:  state.listStores,
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Error
        }),
        listOpportunities: state.listOpportunities,
        performance: state.performance
      };

    case ListsActionTypes.ARCHIVE_LIST:
    case ListsActionTypes.DELETE_LIST:
    case ListsActionTypes.LEAVE_LIST:
      return Object.assign({}, state, {
        manageListStatus: ActionStatus.Fetching
      });

    case ListsActionTypes.ARCHIVE_LIST_SUCCESS:
    case ListsActionTypes.DELETE_LIST_SUCCESS:
    case ListsActionTypes.LEAVE_LIST_SUCCESS:
      return Object.assign({}, state, {
        manageListStatus: ActionStatus.Fetched
      });

    case ListsActionTypes.ARCHIVE_LIST_ERROR:
    case ListsActionTypes.DELETE_LIST_ERROR:
    case ListsActionTypes.LEAVE_LIST_ERROR:
      return Object.assign({}, state, {
        manageListStatus: ActionStatus.Error
      });

    case ListsActions.DELETE_STORE_FROM_LIST:
      return {
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.Deleting
        }),
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.Deleting
        }),
        listOpportunities: state.listOpportunities,
        manageListStatus: state.manageListStatus,
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
        manageListStatus: state.manageListStatus,
        performance: state.performance
      };

    case ListsActions.DELETE_STORE_FROM_LIST_FAILURE:
      return {
        listStores:  Object.assign({}, state.listStores, {
          storeStatus: ActionStatus.DeleteFailure
        }),
        listSummary:  Object.assign({}, state.listSummary, {
          summaryStatus: ActionStatus.DeleteFailure
        }),
        listOpportunities: state.listOpportunities,
        manageListStatus: state.manageListStatus,
        performance: state.performance
      };

    case ListsActions.DELETE_OPP_FROM_LIST:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.Deleting
        }),
        manageListStatus: state.manageListStatus,
        performance: state.performance
      };

    case ListsActions.DELETE_OPP_FROM_LIST_SUCCESS:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.DeleteSuccess
        }),
        manageListStatus: state.manageListStatus,
        performance: state.performance
      };

    case ListsActions.DELETE_OPP_FROM_LIST_FAILURE:
      return {
        listStores:  state.listStores,
        listSummary:  state.listSummary,
        listOpportunities: Object.assign({}, state.listOpportunities, {
          opportunitiesStatus: ActionStatus.DeleteFailure
        }),
        manageListStatus: state.manageListStatus,
        performance: state.performance
      };

    default:
      return state;
  }
}
