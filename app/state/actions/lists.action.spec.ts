import * as Chance from 'chance';

import { FetchOpportunityCountsPayload } from './product-metrics.action';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getOpportunitiesGroupedByBrandSkuPackageCodeMock } from '../../models/opportunity-count.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { getProductMetricsWithBrandValuesMock } from '../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../../models/opportunity-count.model';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ListsActions from './lists.action';

const chance = new Chance();

describe('Lists Actions', () => {

  describe('FetchStoreDetails', () => {
    let action: ListsActions.FetchStoreDetails;
    let positionIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      positionIdMock = chance.string();
      actionPayloadMock = {
        positionId: positionIdMock,
      };
      action = new ListsActions.FetchStoreDetails(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_STORE_DETAILS).toBe('[StoreDetails] FETCH_STORE_DETAILS');
      expect(action.type).toBe(ListsActions.FETCH_STORE_DETAILS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchStoreDetailsSuccess', () => {
    let action: ListsActions.FetchStoreDetailsSuccess;
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

      action = new ListsActions.FetchStoreDetailsSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_STORE_DETAILS_SUCCESS)
        .toBe('[StoreDetails] FETCH_STORE_DETAILS_SUCCESS');
      expect(action.type).toBe(ListsActions.FETCH_STORE_DETAILS_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchStoreDetailsFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.FetchHeaderDetailsFailure;

    beforeEach(() => {
      action = new ListsActions.FetchHeaderDetailsFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS_FAILURE)
        .toBe('[StoreDetails] FETCH_STORE_DETAILS_SUCCESS_FAILURE');
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('FetchHeaderDetails', () => {
    let action: ListsActions.FetchHeaderDetails;
    let positionIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      positionIdMock = chance.string();
      actionPayloadMock = {
        positionId: positionIdMock,
      };
      action = new ListsActions.FetchHeaderDetails(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS).toBe('[StoreDetails] FETCH_HEADER_DETAILS');
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchHeaderDetailsSuccess', () => {
    let action: ListsActions.FetchHeaderDetailsSuccess;
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

      action = new ListsActions.FetchHeaderDetailsSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS_SUCCESS)
        .toBe('[StoreDetails] FETCH_HEADER_DETAILS_SUCCESS');
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchHeaderDetailsFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.FetchHeaderDetailsFailure;

    beforeEach(() => {
      action = new ListsActions.FetchHeaderDetailsFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS_FAILURE)
        .toBe('[StoreDetails] FETCH_HEADER_DETAILS_FAILURE');
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

});
