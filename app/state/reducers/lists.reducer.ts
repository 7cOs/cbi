import { ActionStatus, State } from '../../enums/action-status.enum';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../../models/opportunity-count.model';
import { ProductMetrics, ProductMetricsValues } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ListsActions from '../actions/lists.action';

export interface ProductMetricsState extends State {
  status: ActionStatus;
  opportunityCountsStatus: ActionStatus;
  products: ProductMetrics;
  opportunityCounts?: OpportunitiesGroupedByBrandSkuPackageCode;
  selectedBrandCodeValues?: ProductMetricsValues;
  productMetricsViewType: ProductMetricsViewType;
}

export const initialState: ProductMetricsState = {
  StoreDetailStatus: ActionStatus.NotFetched,
  headerInfoStatus: ActionStatus.NotFetched,
  stores: {},
  productMetricsViewType: ProductMetricsViewType.brands
};

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
