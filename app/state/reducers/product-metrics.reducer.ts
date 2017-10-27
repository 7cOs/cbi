import { ActionStatus, State } from '../../enums/action-status.enum';
import { ProductMetrics, ProductMetricsValues } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ProductMetricsActions from '../actions/product-metrics.action';

export interface ProductMetricsState extends State {
  status: ActionStatus;
  products: ProductMetrics;
  selectedBrandCodeValues?: ProductMetricsValues;
  selectedSkuCodeValues?: ProductMetricsValues;
  productMetricsViewType?: ProductMetricsViewType;
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
      const selectedBrandCode = state.products.brandValues.find(brand => brand.brandCode === action.payload);

      return Object.assign({}, state, {
        productMetricsViewType: ProductMetricsViewType.brands,
        selectedBrandCodeValues: selectedBrandCode
      });

    case ProductMetricsActions.SELECT_SKU_VALUES:
      const selectedSkuCode = state.products.skuValues.find(sku => sku.beerId.masterPackageSKUCode === action.payload.skuPackageCode);

      return Object.assign({}, state, {
        productMetricsViewType: ProductMetricsViewType.skus,
        subBrandType: action.payload.subBrandType,
        selectedSkuCodeValues: selectedSkuCode
      });

    case ProductMetricsActions.CLEAR_SKU_VALUES:
      return Object.assign({}, state, {
        productMetricsViewType: ProductMetricsViewType.skus,
        selectedSkuCodeValues: null
      });

    case ProductMetricsActions.SET_PRODUCT_METRICS_VIEW_TYPE:
      return Object.assign({}, state, {
        productMetricsViewType: action.payload
      });

    default:
      return state;
  }
}
