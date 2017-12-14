import { ActionStatus, State } from '../../enums/action-status.enum';
import { GroupedOpportunityCounts } from '../../models/opportunity-count.model';
import { ProductMetrics, ProductMetricsValues } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ProductMetricsActions from '../actions/product-metrics.action';

export interface ProductMetricsState extends State {
  status: ActionStatus;
  opportunityCountsStatus: ActionStatus;
  products: ProductMetrics;
  opportunityCounts: GroupedOpportunityCounts;
  selectedBrandCodeValues?: ProductMetricsValues;
  productMetricsViewType: ProductMetricsViewType;
}

export const initialState: ProductMetricsState = {
  status: ActionStatus.NotFetched,
  opportunityCountsStatus: ActionStatus.NotFetched,
  products: {},
  opportunityCounts: {},
  productMetricsViewType: ProductMetricsViewType.brands
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
      const selectedBrandValues = state.products.brandValues.find(brand => brand.brandCode === action.payload);

      return Object.assign({}, state, {
        selectedBrandCodeValues: selectedBrandValues
      });

    case ProductMetricsActions.DESELECT_BRAND_VALUES:
      return {
        status: state.status,
        opportunityCountsStatus: state.opportunityCountsStatus,
        products: state.products,
        opportunityCounts: state.opportunityCounts,
        productMetricsViewType: state.productMetricsViewType
      };

    case ProductMetricsActions.SET_PRODUCT_METRICS_VIEW_TYPE:
      return Object.assign({}, state, {
        productMetricsViewType: action.payload
      });

    case ProductMetricsActions.FETCH_OPPORTUNITY_COUNTS:
      return Object.assign({}, state, {
        opportunityCountsStatus: ActionStatus.Fetching
      });

    case ProductMetricsActions.FETCH_OPPORTUNITY_COUNTS_SUCCESS:
      return Object.assign({}, state, {
        opportunityCounts: action.payload,
        opportunityCountsStatus: ActionStatus.Fetched
      });

    case ProductMetricsActions.FETCH_OPPORTUNITY_COUNTS_FAILURE:
      return Object.assign({}, state, {
        opportunityCountsStatus: ActionStatus.Error
      });

    default:
      return state;
  }
}
