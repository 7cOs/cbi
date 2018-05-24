import * as Chance from 'chance';

import { FetchListPerformancePayload, LeaveListPayload, RemoveStoreFromListPayload } from './lists.action';
import { getDateRangeTimePeriodValueMock } from '../../enums/date-range-time-period.enum.mock';
import { getListBeverageTypeMock } from '../../enums/list-beverage-type.enum.mock';
import { getListPerformanceMock } from '../../models/lists/list-performance.model.mock';
import { getListPerformanceTypeMock } from '../../enums/list-performance-type.enum.mock';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import * as ListsActions from './lists.action';
import { ListsActionTypes } from '../../enums/list-action-type.enum';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListsSummary } from '../../models/lists/lists-header.model';

const chance = new Chance();

describe('Lists Actions', () => {

  describe('FetchStoreDetails', () => {
    let action: ListsActions.FetchStoreDetails;
    let listIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      listIdMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
      };
      action = new ListsActions.FetchStoreDetails(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_STORE_DETAILS).toBe(ListsActionTypes.FETCH_STORE_DETAILS);
      expect(action.type).toBe(ListsActions.FETCH_STORE_DETAILS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchStoreDetailsSuccess', () => {
    let action: ListsActions.FetchStoreDetailsSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = getStoreListsMock();

      action = new ListsActions.FetchStoreDetailsSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_STORE_DETAILS_SUCCESS)
        .toBe(ListsActionTypes.FETCH_STORE_DETAILS_SUCCESS);
      expect(action.type).toBe(ListsActions.FETCH_STORE_DETAILS_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchStoreDetailsFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.FetchStoreDetailsFailure;

    beforeEach(() => {
      action = new ListsActions.FetchStoreDetailsFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_STORE_DETAILS_FAILURE)
        .toBe(ListsActionTypes.FETCH_STORE_DETAILS_FAILURE);
      expect(action.type).toBe(ListsActions.FETCH_STORE_DETAILS_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('FetchHeaderDetails', () => {
    let action: ListsActions.FetchHeaderDetails;
    let listIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      listIdMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
      };
      action = new ListsActions.FetchHeaderDetails(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS).toBe(ListsActionTypes.FETCH_HEADER_DETAILS);
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchHeaderDetailsSuccess', () => {
    let action: ListsActions.FetchHeaderDetailsSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = getListsSummaryMock();

      action = new ListsActions.FetchHeaderDetailsSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.FETCH_HEADER_DETAILS_SUCCESS)
        .toBe(ListsActionTypes.FETCH_HEADER_DETAILS_SUCCESS);
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
        .toBe(ListsActionTypes.FETCH_HEADER_DETAILS_FAILURE);
      expect(action.type).toBe(ListsActions.FETCH_HEADER_DETAILS_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('FetchListPerformanceVolume', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: FetchListPerformancePayload = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };
      const action = new ListsActions.FetchListPerformanceVolume(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListPerformanceVolumeSuccess', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: ListPerformance = getListPerformanceMock();
      const action = new ListsActions.FetchListPerformanceVolumeSuccess(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_SUCCESS);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListPerformanceVolumeError', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: Error = new Error(chance.string());
      const action = new ListsActions.FetchListPerformanceVolumeError(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_ERROR);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListPerformancePOD', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: FetchListPerformancePayload = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };
      const action = new ListsActions.FetchListPerformancePOD(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_POD);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListPerformancePODSuccess', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: ListPerformance = getListPerformanceMock();
      const action = new ListsActions.FetchListPerformancePODSuccess(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_SUCCESS);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListPerformancePODError', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: Error = new Error(chance.string());
      const action = new ListsActions.FetchListPerformancePODError(payloadMock);

      expect(action.type).toBe(ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_ERROR);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('FetchListOpportunities', () => {
    let action: ListsActions.FetchOppsForList;
    let listIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      listIdMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
      };
      action = new ListsActions.FetchOppsForList(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(action.type).toBe(ListsActionTypes.FETCH_OPPS_FOR_LIST);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('FetchListOpportunitiesSuccess', () => {
    let action: ListsActions.FetchOppsForListSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = getStoreListsMock();

      action = new ListsActions.FetchOppsForListSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(action.type).toBe(ListsActionTypes.FETCH_OPPS_FOR_LIST_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('FetchListOpportunitiesFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.FetchOppsForListFailure;

    beforeEach(() => {
      action = new ListsActions.FetchOppsForListFailure(error);
    });

    it('should have the correct type', () => {
      expect(action.type).toBe(ListsActionTypes.FETCH_OPPS_FOR_LIST_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('PatchList', () => {
    let action: ListsActions.PatchList;
    let listIdMock: string;
    let actionPayloadMock: any;

    beforeEach(() => {
      listIdMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
      };
      action = new ListsActions.PatchList(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.PATCH_LIST).toBe(ListsActionTypes.PATCH_LIST);
      expect(action.type).toBe(ListsActions.PATCH_LIST);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('PatchListSuccess', () => {
    let action: ListsActions.PatchListSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = getListsSummaryMock();

      action = new ListsActions.PatchListSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.PATCH_LIST_SUCCESS)
        .toBe(ListsActionTypes.PATCH_LIST_SUCCESS);
      expect(action.type).toBe(ListsActions.PATCH_LIST_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('PatchListFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.PatchListFailure;

    beforeEach(() => {
      action = new ListsActions.PatchListFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.PATCH_LIST_FAILURE)
        .toBe(ListsActionTypes.PATCH_LIST_FAILURE);
      expect(action.type).toBe(ListsActions.PATCH_LIST_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('RemoveStoreFromList', () => {
    let action: ListsActions.RemoveStoreFromList;
    let listIdMock: string;
    let sourceStoreCodeMock: string;
    let actionPayloadMock: RemoveStoreFromListPayload;

    beforeEach(() => {
      listIdMock = chance.string();
      sourceStoreCodeMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
        storeSourceCode: sourceStoreCodeMock
      };
      action = new ListsActions.RemoveStoreFromList(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_STORE_FROM_LIST).toBe(ListsActionTypes.DELETE_STORE_FROM_LIST);
      expect(action.type).toBe(ListsActions.DELETE_STORE_FROM_LIST);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('RemoveFromStoreListSuccess', () => {
    let action: ListsActions.RemoveStoreFromListSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = {};

      action = new ListsActions.RemoveStoreFromListSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_STORE_FROM_LIST_SUCCESS)
        .toBe(ListsActionTypes.DELETE_STORE_FROM_LIST_SUCCESS);
      expect(action.type).toBe(ListsActions.DELETE_STORE_FROM_LIST_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('RemoveFromStoreListFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.RemoveStoreFromListFailure;

    beforeEach(() => {
      action = new ListsActions.RemoveStoreFromListFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_STORE_FROM_LIST_FAILURE)
        .toBe(ListsActionTypes.DELETE_STORE_FROM_LIST_FAILURE);
      expect(action.type).toBe(ListsActions.DELETE_STORE_FROM_LIST_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('RemoveOppFromList', () => {
    let action: ListsActions.RemoveOppFromList;
    let listIdMock: string;
    let oppIdMock: string;
    let actionPayloadMock: ListsActions.RemoveOppFromListPayload;

    beforeEach(() => {
      listIdMock = chance.string();
      oppIdMock = chance.string();
      actionPayloadMock = {
        listId: listIdMock,
        oppId: oppIdMock
      };
      action = new ListsActions.RemoveOppFromList(actionPayloadMock);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_OPP_FROM_LIST).toBe(ListsActionTypes.DELETE_OPP_FROM_LIST);
      expect(action.type).toBe(ListsActions.DELETE_OPP_FROM_LIST);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(actionPayloadMock);
    });
  });

  describe('RemoveFromStoreListSuccess', () => {
    let action: ListsActions.RemoveOppFromListSuccess;
    let mockSuccessActionPayload: any;

    beforeEach(() => {
      mockSuccessActionPayload = {};

      action = new ListsActions.RemoveOppFromListSuccess(mockSuccessActionPayload);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_OPP_FROM_LIST_SUCCESS)
        .toBe(ListsActionTypes.DELETE_OPP_FROM_LIST_SUCCESS);
      expect(action.type).toBe(ListsActions.DELETE_OPP_FROM_LIST_SUCCESS);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockSuccessActionPayload);
    });
  });

  describe('RemoveFromStoreListFailure', () => {
    const error: Error = new Error(chance.string());
    let action: ListsActions.RemoveOppFromListFailure;

    beforeEach(() => {
      action = new ListsActions.RemoveOppFromListFailure(error);
    });

    it('should have the correct type', () => {
      expect(ListsActions.DELETE_OPP_FROM_LIST_FAILURE)
        .toBe(ListsActionTypes.DELETE_OPP_FROM_LIST_FAILURE);
      expect(action.type).toBe(ListsActions.DELETE_OPP_FROM_LIST_FAILURE);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('ArchiveList', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: ListsSummary = getListsSummaryMock();
      const action = new ListsActions.ArchiveList(payloadMock);

      expect(action.type).toBe(ListsActionTypes.ARCHIVE_LIST);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('ArchiveListSuccess', () => {
    it('should have the correct action type', () => {
      const action = new ListsActions.ArchiveListSuccess();

      expect(action.type).toBe(ListsActionTypes.ARCHIVE_LIST_SUCCESS);
    });
  });

  describe('ArchiveListError', () => {
    it('should have the correct action type', () => {
      const action = new ListsActions.ArchiveListError();

      expect(action.type).toBe(ListsActionTypes.ARCHIVE_LIST_ERROR);
    });
  });

  describe('DeleteList', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: string = chance.string();
      const action = new ListsActions.DeleteList(payloadMock);

      expect(action.type).toBe(ListsActionTypes.DELETE_LIST);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('DeleteListSuccess', () => {
    it('should have the correct action type', () => {
      const action = new ListsActions.DeleteListSuccess();

      expect(action.type).toBe(ListsActionTypes.DELETE_LIST_SUCCESS);
    });
  });

  describe('DeleteListError', () => {
    it('should have the correct action type', () => {
      const action = new ListsActions.DeleteListError();

      expect(action.type).toBe(ListsActionTypes.DELETE_LIST_ERROR);
    });
  });

  describe('LeaveList', () => {
    it('should have the correct action type and contain its payload', () => {
      const payloadMock: LeaveListPayload = {
        currentUserEmployeeId: chance.string(),
        listSummary: getListsSummaryMock()
      };
      const action = new ListsActions.LeaveList(payloadMock);

      expect(action.type).toBe(ListsActionTypes.LEAVE_LIST);
      expect(action.payload).toEqual(payloadMock);
    });
  });

  describe('LeaveListSuccess', () => {
    it('should be the correct action type', () => {
      const action = new ListsActions.LeaveListSuccess();

      expect(action.type).toBe(ListsActionTypes.LEAVE_LIST_SUCCESS);
    });
  });

  describe('LeaveListError', () => {
    it('should be the correct action type', () => {
      const action = new ListsActions.LeaveListError();

      expect(action.type).toBe(ListsActionTypes.LEAVE_LIST_ERROR);
    });
  });
});
