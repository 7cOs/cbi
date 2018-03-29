import { ActionStatus } from '../../enums/action-status.enum';
import { getStoreListsMock } from '../../models/lists-store.model.mock';
import { getListHeaderInfoMock } from '../../models/lists-header.model.mock';
import { listsReducer, initialState, ListsState } from './lists.reducer';
import * as ListsActions from '../actions/lists.action';

const listIdMock = chance.string();

describe('Lists Reducer', () => {

  describe('when a FetchStoreDetails action is dispatched', () => {
    it('should update the store details status to Fetching', () => {
      const expectedState = {
        status: ActionStatus.Fetching,
        headerInfoStatus: initialState.headerInfoStatus,
        stores: initialState.stores,
      };

      const actualState = listsReducer(initialState, new ListsActions.FetchStoreDetails({
        listId: listIdMock
      }));

      expect(actualState).toEqual(expectedState);
    });

    it('should store the list of stores and set the store details status to Fetched on success', () => {
      const stores = getStoreListsMock();

      const expectedState = {
        status: ActionStatus.Fetched,
        headerInfoStatus: initialState.headerInfoStatus,
        stores: stores,
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsSuccess(stores)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the store details status to Error', () => {
      const expectedState: ListsState = {
        status: ActionStatus.Error,
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
    it('should update the header details status to Fetching', () => {
        const expectedState = {
          status: initialState.status,
          headerInfoStatus: ActionStatus.Fetching,
          stores: initialState.stores,
        };

        const actualState = listsReducer(initialState, new ListsActions.FetchHeaderDetails({
          listId: listIdMock
        }));

        expect(actualState).toEqual(expectedState);
      });
    it('should update the header details and set the headers status to Fetched on success', () => {
      const headersMock = getListHeaderInfoMock();

      const expectedState = {
        status: initialState.status,
        headerInfo: headersMock,
        headerInfoStatus: ActionStatus.Fetched,
        stores: initialState.stores
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsSuccess(headersMock)
      );

      expect(actualState).toEqual(expectedState);
    });
    it('should should update the headers status to Error', () => {
      const expectedState: ListsState = {
        status: initialState.status,
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
