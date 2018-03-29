import * as Chance from 'chance';
import * as ListsActions from './lists.action';

import { getStoreListsMock } from '../../models/lists-store.model.mock';
import { getListHeaderInfoMock } from '../../models/lists-header.model.mock';

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
      expect(ListsActions.FETCH_STORE_DETAILS).toBe('[StoreDetails] FETCH_STORE_DETAILS');
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
        .toBe('[StoreDetails] FETCH_STORE_DETAILS_SUCCESS');
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
        .toBe('[StoreDetails] FETCH_STORE_DETAILS_FAILURE');
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
      expect(ListsActions.FETCH_HEADER_DETAILS).toBe('[StoreDetails] FETCH_HEADER_DETAILS');
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
      mockSuccessActionPayload = getListHeaderInfoMock();

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
