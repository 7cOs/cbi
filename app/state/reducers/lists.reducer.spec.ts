import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { FetchListPerformancePayload } from '../actions/lists.action';
import { getDateRangeTimePeriodValueMock } from '../../enums/date-range-time-period.enum.mock';
import { getListBeverageTypeMock } from '../../enums/list-beverage-type.enum.mock';
import { getListOpportunitiesMock } from '../../models/lists/lists-opportunities.model.mock';
import { getListPerformanceMock } from '../../models/lists/list-performance.model.mock';
import { getListPerformanceTypeMock } from '../../enums/list-performance-type.enum.mock';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import { initialState, listsReducer, ListsState } from './lists.reducer';
import * as ListsActions from '../actions/lists.action';
import { ListPerformance } from '../../models/lists/list-performance.model';

const chance = new Chance();
const listIdMock = chance.string();

describe('Lists Reducer', () => {

  describe('when a FetchStoreDetails action is dispatched', () => {
    it('should update the store details status to Fetching', () => {
      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: {
          storeStatus: ActionStatus.Fetching,
          stores: initialState.listStores.stores
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };

      const actualState = listsReducer(initialState, new ListsActions.FetchStoreDetails({
        listId: listIdMock
      }));

      expect(actualState).toEqual(expectedState);
    });

    it('should store the list of stores and set the store details status to Fetched on success', () => {
      const stores = getStoreListsMock();

      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: {
          storeStatus: ActionStatus.Fetched,
          stores: stores
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsSuccess(stores)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the store details status to Error', () => {
      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: {
          storeStatus: ActionStatus.Error,
          stores: initialState.listStores.stores
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchHeaderDetails action is dispatched', () => {
    it('should update the header details status to Fetching', () => {
        const expectedState: ListsState = {
          listStores:  initialState.listStores,
          listSummary: {
            summaryStatus: ActionStatus.Fetching,
            summaryData: initialState.listSummary.summaryData
          },
          listOpportunities: initialState.listOpportunities,
          performance: initialState.performance
        };

        const actualState = listsReducer(initialState, new ListsActions.FetchHeaderDetails({
          listId: listIdMock
        }));

        expect(actualState).toEqual(expectedState);
      });

    it('should update the header details and set the headers status to Fetched on success', () => {
      const headersMock = getListsSummaryMock();

      const expectedState: ListsState = {
        listStores:  initialState.listStores,
        listSummary: {
          summaryStatus: ActionStatus.Fetched,
          summaryData: headersMock
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsSuccess(headersMock)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the headers status to Error', () => {
      const expectedState: ListsState = {
        listStores:  initialState.listStores,
        listSummary: {
          summaryStatus: ActionStatus.Error,
          summaryData: initialState.listSummary.summaryData
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformanceVolume action is received', () => {
    it('should set the performance volumeStatus to Fetching', () => {
      const payloadMock: FetchListPerformancePayload = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: initialState.performance.podStatus,
          pod: initialState.performance.pod,
          volumeStatus: ActionStatus.Fetching,
          volume: initialState.performance.volume
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformanceVolume(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformanceVolumeSuccess action is received', () => {
    it('should set the performance volumeStatus to Fetched and the performance volume to the payload', () => {
      const payloadMock: ListPerformance = getListPerformanceMock();
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: initialState.performance.podStatus,
          pod: initialState.performance.pod,
          volumeStatus: ActionStatus.Fetched,
          volume: payloadMock
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformanceVolumeSuccess(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformanceVolumeError action is received', () => {
    it('should set the performance volumeStatus to Error', () => {
      const payloadMock: Error = new Error(chance.string());
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: initialState.performance.podStatus,
          pod: initialState.performance.pod,
          volumeStatus: ActionStatus.Error,
          volume: initialState.performance.volume
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformanceVolumeError(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformancePOD action is received', () => {
    it('should set the performance podStatus to Fetching', () => {
      const payloadMock: FetchListPerformancePayload = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: ActionStatus.Fetching,
          pod: initialState.performance.pod,
          volumeStatus: initialState.performance.volumeStatus,
          volume: initialState.performance.volume
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformancePOD(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformancePODSuccess action is received', () => {
    it('should set the performance podStatus to Fetched and the performance pod to the payload', () => {
      const payloadMock: ListPerformance = getListPerformanceMock();
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: ActionStatus.Fetched,
          pod: payloadMock,
          volumeStatus: initialState.performance.volumeStatus,
          volume: initialState.performance.volume
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformancePODSuccess(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchListPerformancePODError action is received', () => {
    it('should set the performance podStatus to Error', () => {
      const payloadMock: Error = new Error(chance.string());
      const expectedState: ListsState = {
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: {
          podStatus: ActionStatus.Error,
          pod: initialState.performance.pod,
          volumeStatus: initialState.performance.volumeStatus,
          volume: initialState.performance.volume
        }
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchListPerformancePODError(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a FetchOppsForList action is dispatched', () => {
    it('should update the opportunities status to Fetching', () => {
      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        listOpportunities: {
          opportunitiesStatus: ActionStatus.Fetching,
          opportunities: initialState.listOpportunities.opportunities
        },
        performance: initialState.performance
      };

      const actualState = listsReducer(initialState, new ListsActions.FetchOppsForList({
        listId: listIdMock
      }));

      expect(actualState).toEqual(expectedState);
    });

    it('should store the list of opportunities and set the opportunitiesStatus to Fetched on success', () => {
      const opportunities = getListOpportunitiesMock();

      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        listOpportunities: {
          opportunitiesStatus: ActionStatus.Fetched,
          opportunities: opportunities
        },
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchOppsForListSuccess(opportunities)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the opportunitiesStatus to Error', () => {
      const expectedState: ListsState = {
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        listOpportunities: {
          opportunitiesStatus: ActionStatus.Error,
          opportunities: initialState.listOpportunities.opportunities
        },
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchOppsForListFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a PatchList action is dispatched', () => {
    it('should update the list summary details status to Fetching', () => {
        const expectedState: ListsState = {
          listStores:  initialState.listStores,
          listSummary: {
            summaryStatus: ActionStatus.Fetching,
            summaryData: initialState.listSummary.summaryData
          },
          listOpportunities: initialState.listOpportunities,
          performance: initialState.performance
        };

        const actualState = listsReducer(initialState, new ListsActions.PatchList(getListsSummaryMock()));

        expect(actualState).toEqual(expectedState);
      });

    it('should update the header details and set the headers status to Fetched on success', () => {
      const headersMock = getListsSummaryMock();

      const expectedState: ListsState = {
        listStores:  initialState.listStores,
        listSummary: {
          summaryStatus: ActionStatus.Fetched,
          summaryData: headersMock
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.PatchListSuccess(headersMock)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the headers status to Error', () => {
      const expectedState: ListsState = {
        listStores:  initialState.listStores,
        listSummary: {
          summaryStatus: ActionStatus.Error,
          summaryData: initialState.listSummary.summaryData
        },
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.PatchListFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });
});
