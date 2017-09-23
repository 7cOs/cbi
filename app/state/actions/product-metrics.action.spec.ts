import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import * as ProductMetricsActions from './product-metrics.action';

const chance = new Chance();

describe('ProductMetrics Actions', () => {

  describe('FetchProductMetricsAction', () => {
    let action: ProductMetricsActions.FetchProductMetricsAction;
    let positionIdMock: string;
    let actionPayloadMock: any;
    const mockPerformanceFilterState: MyPerformanceFilterState = getMyPerformanceFilterMock();

    beforeEach(() => {
      positionIdMock = chance.string();
      actionPayloadMock = {
        positionId: positionIdMock,
        filter: mockPerformanceFilterState
      };
      action = new ProductMetricsActions.FetchProductMetricsAction(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS_ACTION).toBe('[ProductMetrics] FETCH_PRODUCT_METRICS_ACTION');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchProductMetricsSuccessAction', () => {
    let action: ProductMetricsActions.FetchProductMetricsSuccessAction;
    let product: ProductMetrics;
    let mockUserId: number;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      product = getProductMetricMock();
      mockUserId = chance.natural();
      mockSuccessActionPayload = {
        positionId: mockUserId,
        products: product,
      };

      action = new ProductMetricsActions.FetchProductMetricsSuccessAction(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS_ACTION)
        .toBe('[ProductMetrics] FETCH_PRODUCT_METRICS_SUCCESS_ACTION');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchProductMetricsFailureAction', () => {
    const error: Error = new Error(chance.string());
    let action: ProductMetricsActions.FetchProductMetricsFailureAction;

    beforeEach(() => {
      action = new ProductMetricsActions.FetchProductMetricsFailureAction(error);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE_ACTION)
        .toBe('[ProductMetrics] FETCH_PRODUCT_METRICS_FAILURE_ACTION');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

});
