import { ActionStatus, State } from '../../enums/action-status.enum';
import { ProductMetrics, ProductMetricsValues } from '../../models/product-metrics.model';
import * as ProductMetricsActions from '../actions/product-metrics.action';

export interface ProductMetricsState extends State {
  status: ActionStatus;
  products: ProductMetrics;
  selectedBrandValues?: ProductMetricsValues;
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
    case ProductMetricsActions.FETCH_PRODUCT_METRICS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        products: action.payload.products
      });

    case ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ProductMetricsActions.SELECT_BRAND_VALUES:
      const selectedBrand = state.products.brandValues.find(brand => brand.brandCode === action.payload);

      return Object.assign({}, state, {
        selectedBrandValues: selectedBrand
      });

    default:
      return state;
  }
}
