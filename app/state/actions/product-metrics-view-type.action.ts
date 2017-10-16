import { Action } from '@ngrx/store';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

export const SET_PRODUCT_METRICS_VIEW_TYPE = '[View Types] SET_PRODUCT_METRICS_VIEW_TYPE';
export class SetProductMetricsViewType implements Action {
  readonly type = SET_PRODUCT_METRICS_VIEW_TYPE;

  constructor(public payload: ProductMetricsViewType) { }
}

export type Action = SetProductMetricsViewType;
