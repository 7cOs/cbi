import { ActionStatus } from '../../enums/action-status.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getOpportunitiesGroupedByBrandSkuPackageCodeMock } from '../../models/opportunity-count.model.mock';
import { getProductMetricsWithBrandValuesMock } from '../../models/product-metrics.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { initialState, listsReducer } from './lists.reducer';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../../models/opportunity-count.model';
import * as ListsActions from '../actions/lists.action';
import { ProductMetricsState } from './product-metrics.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

describe('Lists Reducer', () => {

  describe('when a FetchStoreDetails action is dispatched', () => {
    it('should update the store details status to Fetching', () => {
      const expectedState = {
        StoreDetailStatus: ActionStatus.Fetching,
        headerInfoStatus: initialState.headerInfoStatus,
        stores: initialState.stores,
      };

      const actualState = listsReducer(initialState, new ListsActions.FetchStoreDetails({
        positionId: positionIdMock
      }));

      expect(actualState).toEqual(expectedState);
    });
    it('should store the list of stores and set the store details status to Fetched on success', () => {
      const stores = getProductMetricsWithBrandValuesMock();

      const payloadMock = {
        positionId: positionIdMock,
      };

      const expectedState = {
        StoreDetailStatus: ActionStatus.Fetched,
        headerInfoStatus: initialState.headerInfoStatus,
        stores: stores,
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsSuccess(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
    it('should should update the store details status to Error', () => {
      const expectedState: ListsState = {
        StoreDetailStatus: ActionStatus.Error,
        headerInfoStatus: initialState.headerInfoStatus,
        stores: initialState.stores,
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchHeaderDetails action is dispatched', () => {
    it('should update the store details status to Fetching', () => {
        const expectedState = {
          StoreDetailStatus: initialState.StoreDetailStatus,
          headerInfoStatus: ActionStatus.Fetching,
          stores: initialState.stores,
        };

        const actualState = listsReducer(initialState, new ListsActions.FetchHeaderDetails({
          positionId: positionIdMock
        }));

        expect(actualState).toEqual(expectedState);
      });
    it('should store the header details and set the headers status to Fetched on success', () => {
      const headersMock = getProductMetricsWithBrandValuesMock();

      const payloadMock = {
        positionId: positionIdMock,
      };

      const expectedState = {
        StoreDetailStatus: initialState.StoreDetailStatus,
        headerInfo: headersMock,
        headerInfoStatus: ActionStatus.Fetched,
        stores: initialState.stores
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsSuccess(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
    it('should should update the headers status to Error', () => {
      const expectedState: ListsState = {
        StoreDetailStatus: initialState.StoreDetailStatus,
        headerInfoStatus: ActionStatus.Error,
        stores: initialState.stores,
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });
});
