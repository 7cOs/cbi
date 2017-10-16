import * as ProductMetricsViewTypeActions from '../actions/product-metrics-view-type.action';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

export interface ProductMetricsViewTypeState {
  viewType: ProductMetricsViewType;
}

export const initialState: ProductMetricsViewTypeState = {
  viewType: ProductMetricsViewType.brands
};

export function productMetricsViewTypeReducer(
  state: ProductMetricsViewTypeState = initialState,
  action: ProductMetricsViewTypeActions.Action
): ProductMetricsViewTypeState {
  switch (action.type) {
    case ProductMetricsViewTypeActions.SET_PRODUCT_METRICS_VIEW_TYPE:
      return Object.assign({}, state, {
        viewType: action.payload
      });

    default:
      return state;
  }
}
