import { ActionStatus, State } from '../../enums/action-status.enum';
import { ProductMetrics } from '../../models/product-metrics.model';
import * as ProductMetricsActions from '../actions/product-metrics.action';

export interface ProductMetricsState extends State {
  status: ActionStatus;
  products: ProductMetrics;
}

export const initialState: ProductMetricsState = {
  status: ActionStatus.NotFetched,
  products: {}
};

export function productMetricsReducer(
  state: ProductMetricsState = initialState,
  action: ProductMetricsActions.Action
): ProductMetricsState {

  switch (action.type) {
    case ProductMetricsActions.FETCH_PRODUCT_METRICS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        products: action.payload.products
      });

    case ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
