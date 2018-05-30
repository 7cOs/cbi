import * as Chance from 'chance';

import { ActionStatus } from '../../enums/action-status.enum';
import { CopyOppsToListPayload, CopyStoresToListPayload, FetchListPerformancePayload, LeaveListPayload } from '../actions/lists.action';
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
import { ListsSummary } from '../../models/lists/lists-header.model';

const chance = new Chance();
const listIdMock = chance.string();
const oppIdMock = chance.string();
const storeSourceCode = chance.string();

describe('Lists Reducer', () => {

  describe('when a FetchStoreDetails action is dispatched', () => {
    it('should update the store details status to Fetching and reset the manageListStatus to NotFetched', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.NotFetched,
        listSummary: initialState.listSummary,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listSummary: initialState.listSummary,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listSummary: initialState.listSummary,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listSummary: initialState.listSummary,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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
        manageListStatus: initialState.manageListStatus,
        listStores:  initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
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

  describe('when an ArchiveList action is received', () => {
    it('should update the manageListStatus state to Fetching', () => {
      const payloadMock: ListsSummary = getListsSummaryMock();
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetching,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.ArchiveList(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an ArchiveListSuccess action is received', () => {
    it('should update the manageListStatus state to Fetched', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetched,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.ArchiveListSuccess()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an ArchiveListError action is received', () => {
    it('should update the manageListStatus state to Error', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Error,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.ArchiveListError()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an DeleteList action is received', () => {
    it('should update the manageListStatus state to Fetching', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetching,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.DeleteList(chance.string())
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an DeleteListSuccess action is received', () => {
    it('should update the manageListStatus state to Fetched', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetched,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.DeleteListSuccess()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an DeleteListError action is received', () => {
    it('should update the manageListStatus state to Error', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Error,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.DeleteListError()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an LeaveList action is received', () => {
    it('should update the manageListStatus state to Fetching', () => {
      const payloadMock: LeaveListPayload = {
        currentUserEmployeeId: chance.string(),
        listSummary: getListsSummaryMock()
      };
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetching,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.LeaveList(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an LeaveListSuccess action is received', () => {
    it('should update the manageListStatus state to Fetched', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Fetched,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.LeaveListSuccess()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an LeaveListError action is received', () => {
    it('should update the manageListStatus state to Error', () => {
      const expectedState: ListsState = {
        manageListStatus: ActionStatus.Error,
        listStores: initialState.listStores,
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.LeaveListError()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a RemoveStoreFromList action is dispatched', () => {

    it('should update the list stores and list summary details status to Deleting', () => {
        const expectedState: ListsState = {
          manageListStatus: initialState.manageListStatus,
          copyStatus: initialState.copyStatus,
          allLists: initialState.allLists,
          listStores: {
            stores: initialState.listStores.stores,
            storeStatus: ActionStatus.Deleting
          },
          listSummary: {
            summaryStatus: ActionStatus.Deleting,
            summaryData: initialState.listSummary.summaryData
          },
          listOpportunities: initialState.listOpportunities,
          performance: initialState.performance
        };

        const actualState = listsReducer(initialState, new ListsActions.RemoveStoreFromList(
          {listId: listIdMock, storeSourceCode: storeSourceCode}));

        expect(actualState).toEqual(expectedState);
      });

    it('should update the list stores and list summary to DeleteSuccess on success', () => {

      const expectedState: ListsState = {
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listStores: {
          stores: initialState.listStores.stores,
          storeStatus: ActionStatus.DeleteSuccess
        },
        listSummary: {
          summaryStatus: ActionStatus.DeleteSuccess,
          summaryData: initialState.listSummary.summaryData
        },
        listOpportunities: initialState.listOpportunities,
        manageListStatus: initialState.manageListStatus,
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.RemoveStoreFromListSuccess({listId: listIdMock, storeSourceCode: storeSourceCode})
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the list stores and summary status to Error', () => {
      const expectedState: ListsState = {
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listStores: {
          stores: initialState.listStores.stores,
          storeStatus: ActionStatus.DeleteFailure
        },
        listSummary: {
          summaryStatus: ActionStatus.DeleteFailure,
          summaryData: initialState.listSummary.summaryData
        },
        listOpportunities: initialState.listOpportunities,
        manageListStatus: initialState.manageListStatus,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.RemoveStoreFromListFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when a RemoveOppFromList action is dispatched', () => {

    it('should update the list opportunities status to Deleting', () => {
        const expectedState: ListsState = {
          copyStatus: initialState.copyStatus,
          allLists: initialState.allLists,
          listStores: initialState.listStores,
          listSummary: initialState.listSummary,
          listOpportunities: {
            opportunities: initialState.listOpportunities.opportunities,
            opportunitiesStatus: ActionStatus.Deleting
          },
          manageListStatus: initialState.manageListStatus,
          performance: initialState.performance
        };

        const actualState = listsReducer(initialState, new ListsActions.RemoveOppFromList(
          {listId: listIdMock, oppId: oppIdMock}));

        expect(actualState).toEqual(expectedState);
      });

    it('should update the list opportunities status to DeleteSuccess on success', () => {

      const expectedState: ListsState = {
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: {
          opportunities: initialState.listOpportunities.opportunities,
          opportunitiesStatus: ActionStatus.DeleteSuccess
        },
        manageListStatus: initialState.manageListStatus,
        performance: initialState.performance
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.RemoveOppFromListSuccess({listId: listIdMock, oppId: oppIdMock})
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the headers status to Error', () => {
      const expectedState: ListsState = {
        copyStatus: initialState.copyStatus,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: {
          opportunities: initialState.listOpportunities.opportunities,
          opportunitiesStatus: ActionStatus.DeleteFailure
        },
        manageListStatus: initialState.manageListStatus,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.RemoveOppFromListFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyStoreToList action is received', () => {
    it('should update the copytStatus state to Fetching', () => {
      const idMock = chance.string();
      const payloadMock: CopyStoresToListPayload = {
        listId: listIdMock,
        id: idMock
      };

      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Fetching,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyStoresToList(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyStoreToListSuccess action is received', () => {
    it('should update the copytStatus state to Fetched', () => {
      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Fetched,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyStoresToListSuccess()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyStoreToListError action is received', () => {
    it('should update the copyStatus state to Error', () => {
      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Error,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyStoresToListError()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyOppsToList action is received', () => {
    it('should update the copytStatus state to Fetching', () => {
      const idMock = [{opportunityId: chance.string()}, {opportunityId: chance.string()}] ;
      const payloadMock: CopyOppsToListPayload = {
        listId: listIdMock,
        ids: idMock
      };

      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Fetching,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyOppsToList(payloadMock)
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyOppsToListSuccess action is received', () => {
    it('should update the copytStatus state to Fetched', () => {
      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Fetched,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyOppsToListSuccess()
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('when an CopyOppsToListError action is received', () => {
    it('should update the copyStatus state to Error', () => {
      const expectedState: ListsState = {
        manageListStatus: initialState.manageListStatus,
        copyStatus: ActionStatus.Error,
        allLists: initialState.allLists,
        listStores: initialState.listStores,
        listSummary: initialState.listSummary,
        listOpportunities: initialState.listOpportunities,
        performance: initialState.performance
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.CopyOppsToListError()
      );

      expect(actualState).toEqual(expectedState);
    });
  });
});
