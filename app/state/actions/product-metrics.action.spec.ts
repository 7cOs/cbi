import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ProductMetrics } from '../../models/product-metrics.model';
import * as ProductMetricsActions from './product-metrics.action';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';

const chance = new Chance();

describe('ProductMetrics Actions', () => {

  describe('FetchProductMetricsAction', () => {
    let action: ProductMetricsActions.FetchProductMetricsAction;
    let positionIdMock: string;
    let actionPayloadMock: any;
    const mockPerformanceFilterState: MyPerformanceFilterState = {
      metricType: MetricTypeValue.PointsOfDistribution,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On,
      distributionType: DistributionTypeValue.simple
    };

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
