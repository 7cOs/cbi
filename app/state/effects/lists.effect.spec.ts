import * as Chance from 'chance';
import { Action } from '@ngrx/store';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

import { FetchHeaderDetailsPayload, FetchStoreDetailsPayload } from '../actions/lists.action';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import * as ListActions from '../../state/actions/lists.action';
import { ListsEffects } from './lists.effect';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListStoreDTO } from '../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../models/lists/lists-header-dto.model';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

const chance = new Chance();

describe('Lists Effects', () => {
  let error: Error;
  let actions$: Subject<ListActions.Action>;
  let listsEffects: ListsEffects;
  let listsApiService: ListsApiService;
  let listsTransformerService: ListsTransformerService;
  let listHeaderMock: ListsSummaryDTO;
  let storeListMock: ListStoreDTO[];
  let testBed: TestBed;
  let headerDetailMock: ListsSummary;
  let storesData: Array<StoreDetails> = getStoreListsMock();

  const listsApiServiceMock = {
    getStoreListDetails(listIdMock: string): Observable<ListStoreDTO[]> {
      return Observable.of(storeListMock);
    },
    getListSummary(listIdMock: string): Observable<ListsSummaryDTO> {
      return Observable.of(listHeaderMock);
    }
  };

  let listsTransformerServiceMock = {
    formatListsSummaryData(headerDataDTO: ListsSummaryDTO): ListsSummary {
      return headerDetailMock;
    },
    formatStoresData(store: Array<ListStoreDTO>): Array<StoreDetails> {
      return storesData;
    },
  };

  beforeEach(() => {
    error = new Error(chance.string());

    TestBed.configureTestingModule({
      providers: [
        ListsEffects,
        provideMockActions(() => actions$),
        {
          provide: ListsApiService,
          useValue: listsApiServiceMock
        },
        {
          provide: ListsTransformerService,
          useValue: listsTransformerServiceMock
        }
      ]
    });

    actions$ = new ReplaySubject(1);
    testBed = getTestBed();

    listsEffects = testBed.get(ListsEffects);
    listsApiService = testBed.get(ListsApiService);
    listsTransformerService = testBed.get(ListsTransformerService);
  });

 describe('when a FetchStoreDetails actions is received', () => {
    let actionPayloadMock: FetchStoreDetailsPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string()
      };

      actions$.next(new ListActions.FetchStoreDetails(actionPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call getStoreDetails from the ListsService given the passed in action payload', (done) => {
        const getOpportunitiesSpy = spyOn(listsApiService, 'getStoreListDetails').and.callThrough();

        listsEffects.fetchStoreDetails$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesSpy.calls.count()).toBe(1);
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock.listId);
      });

      it('should dispatch a FetchStoreDetailsSuccess action with the returned Formatted Data', (done) => {
        listsEffects.fetchStoreDetails$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchStoreDetailsSuccess(storesData));
          done();
        });
      });
    });

    describe('when an error is returned from getStoreDetails', () => {
      it('should dispatch a FetchStoreDetailsFailure action with the error', (done) => {
        spyOn(listsApiService, 'getStoreListDetails').and.returnValue(Observable.throw(error));

        listsEffects.fetchStoreDetails$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchStoreDetailsFailure(error));
          done();
        });
      });
    });
  });

  describe('when a fetchHeaderDetail actions is received', () => {
    let actionPayloadMock: FetchHeaderDetailsPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string()
      };

      actions$.next(new ListActions.FetchHeaderDetails(actionPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call getHeaderDetails from the ListsService given the passed in action payload', (done) => {
        const getOpportunitiesSpy = spyOn(listsApiService, 'getListSummary').and.callThrough();

        listsEffects.fetchHeaderDetails$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesSpy.calls.count()).toBe(1);
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock.listId);
      });

      it('should dispatch a getHeaderDetailsSuccess action with the returned transformed data', (done) => {
        listsEffects.fetchHeaderDetails$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchHeaderDetailsSuccess(headerDetailMock));
          done();
        });
      });
    });

    describe('when an error is returned from getHeaderDetails', () => {
      it('should dispatch a FetchHeaderDetailsFailure action with the error', (done) => {
        spyOn(listsApiService, 'getListSummary').and.returnValue(Observable.throw(error));

        listsEffects.fetchHeaderDetails$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchHeaderDetailsFailure(error));
          done();
        });
      });
    });
  });
});
