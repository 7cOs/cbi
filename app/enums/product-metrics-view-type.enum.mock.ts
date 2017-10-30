import * as Chance from 'chance';
let chance = new Chance();

import { ProductMetricsViewType } from './product-metrics-view-type.enum';

const viewTypeValues = Object.keys(ProductMetricsViewType).map(key => ProductMetricsViewType[key]);

export function getProductMetricsViewTypeMock(): ProductMetricsViewType {
  return viewTypeValues[chance.integer({ min: 0, max: viewTypeValues.length - 1})];
}
