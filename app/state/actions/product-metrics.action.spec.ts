import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { getProductMetricsWithBrandValuesMock } from '../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ProductMetricsActions from './product-metrics.action';

const chance = new Chance();

describe('ProductMetrics Actions', () => {

  describe('FetchProductMetrics', () => {
    let action: ProductMetricsActions.FetchProductMetrics;
    let positionIdMock: string;
    let actionPayloadMock: any;
    const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

    beforeEach(() => {
      positionIdMock = chance.string();
      actionPayloadMock = {
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      };
      action = new ProductMetricsActions.FetchProductMetrics(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS).toBe('[ProductMetrics] FETCH_PRODUCT_METRICS');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchProductMetricsSuccess', () => {
    let action: ProductMetricsActions.FetchProductMetricsSuccess;
    let product: ProductMetrics;
    let mockUserId: number;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      product = getProductMetricsWithBrandValuesMock();
      mockUserId = chance.natural();
      mockSuccessActionPayload = {
        positionId: mockUserId,
        products: product,
      };

      action = new ProductMetricsActions.FetchProductMetricsSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS)
        .toBe('[ProductMetrics] FETCH_PRODUCT_METRICS_SUCCESS');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchProductMetricsFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ProductMetricsActions.FetchProductMetricsFailure;

    beforeEach(() => {
      action = new ProductMetricsActions.FetchProductMetricsFailure(error);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE)
        .toBe('[ProductMetrics] FETCH_PRODUCT_METRICS_FAILURE');
      expect(action.type).toBe(ProductMetricsActions.FETCH_PRODUCT_METRICS_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('SelectBrandValues', () => {
    let action: ProductMetricsActions.SelectBrandValues;
    let actionPayloadMock: string;

    beforeEach(() => {
      actionPayloadMock = chance.string();
      action = new ProductMetricsActions.SelectBrandValues(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.SELECT_BRAND_VALUES).toBe('[ProductMetrics] SELECT_BRAND_VALUES');
      expect(action.type).toBe(ProductMetricsActions.SELECT_BRAND_VALUES);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('SelectSkuValues', () => {
    let action: ProductMetricsActions.SelectSkuValues;
    let actionPayloadMock: string;

    beforeEach(() => {
      actionPayloadMock = chance.string();
      action = new ProductMetricsActions.SelectSkuValues(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.SELECT_SKU_VALUES).toBe('[ProductMetrics] SELECT_SKU_VALUES');
      expect(action.type).toBe(ProductMetricsActions.SELECT_SKU_VALUES);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('ClearSelectedSkuValues', () => {
    let action: ProductMetricsActions.ClearSkuValues;

    beforeEach(() => {
      action = new ProductMetricsActions.ClearSkuValues();
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.CLEAR_SKU_VALUES).toBe('[ProductMetrics] CLEAR_SKU_VALUES');
      expect(action.type).toBe(ProductMetricsActions.CLEAR_SKU_VALUES);
    });

  });

  describe('SetProductMetricsViewType', () => {
    let action: ProductMetricsActions.SetProductMetricsViewType;

    beforeEach(() => {
      action = new ProductMetricsActions.SetProductMetricsViewType(ProductMetricsViewType[getProductMetricsViewTypeMock()]);
    });

    it('should have the correct type', () => {
      expect(ProductMetricsActions.SET_PRODUCT_METRICS_VIEW_TYPE).toBe('[View Types] SET_PRODUCT_METRICS_VIEW_TYPE');
      expect(action.type).toBe(ProductMetricsActions.SET_PRODUCT_METRICS_VIEW_TYPE);
    });
  });

});
