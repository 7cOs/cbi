import { ActionStatus } from '../../enums/action-status.enum';
import { getStoreListsMock } from '../../models/lists-store.model.mock';
import { getListsSummaryMock } from '../../models/lists-header.model.mock';
import { listsReducer, initialState, ListsState } from './lists.reducer';
import * as ListsActions from '../actions/lists.action';

const listIdMock = chance.string();

describe('Lists Reducer', () => {

  describe('when a FetchStoreDetails action is dispatched', () => {
    it('should update the store details status to Fetching', () => {
      const expectedState = {
        listSummary:  initialState.listSummary,
        listStores:  Object.assign({}, initialState.listStores, {
          storeStatus: ActionStatus.Fetching
        })
      };

      const actualState = listsReducer(initialState, new ListsActions.FetchStoreDetails({
        listId: listIdMock
      }));

      expect(actualState).toEqual(expectedState);
    });

    it('should store the list of stores and set the store details status to Fetched on success', () => {
      const stores = getStoreListsMock();

      const expectedState = {
        listSummary:  initialState.listSummary,
        listStores:  Object.assign({}, initialState.listStores, {
          storeStatus: ActionStatus.Fetched,
          stores: stores
        })
      };

      const actualState = listsReducer(
        initialState,
        new ListsActions.FetchStoreDetailsSuccess(stores)
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should should update the store details status to Error', () => {
      const expectedState = {
        listSummary:  initialState.listSummary,
        listStores:  Object.assign({}, initialState.listStores, {
          storeStatus: ActionStatus.Error
        })
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
          listStores:  initialState.listStores,
          listSummary:  Object.assign({}, initialState.listSummary, {
            summaryStatus: ActionStatus.Fetching
          })
        };

        const actualState = listsReducer(initialState, new ListsActions.FetchHeaderDetails({
          listId: listIdMock
        }));

        expect(actualState).toEqual(expectedState);
      });

    it('should update the header details and set the headers status to Fetched on success', () => {
      const headersMock = getListsSummaryMock();

      const expectedState = {
        listStores:  initialState.listStores,
        listSummary:  Object.assign({}, initialState.listSummary, {
          summaryStatus: ActionStatus.Fetching,
          summaryData: headersMock
        })
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
        listSummary:  Object.assign({}, initialState.listSummary, {
          summaryStatus: ActionStatus.Error
        })
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });
});
