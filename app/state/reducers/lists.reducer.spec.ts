import { ActionStatus } from '../../enums/action-status.enum';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import { listsReducer, initialState, ListsState } from './lists.reducer';
import * as ListsActions from '../actions/lists.action';

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
        listOpportunities: initialState.listOpportunities
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
        listOpportunities: initialState.listOpportunities
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
        listOpportunities: initialState.listOpportunities
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
          listOpportunities: initialState.listOpportunities
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
        listOpportunities: initialState.listOpportunities
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
        listOpportunities: initialState.listOpportunities
      };
      const actualState: ListsState = listsReducer(
        initialState,
        new ListsActions.FetchHeaderDetailsFailure(new Error()));

      expect(actualState).toEqual(expectedState);
    });
  });
});
