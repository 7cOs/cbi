import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import * as ListActions from '../../state/actions/lists.action';
import { ListsEffects } from './lists.effect';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { FetchHeaderDetailsPayload, FetchStoreDetailsPayload } from '../actions/lists.action';
import { ListStoreDTO } from '../../models/lists-store-dto.model';
import { StoreHeaderInfoDTO } from '../../models/lists-store-header-dto.model';
import { StoreDetailsRow, StoreHeaderDetails } from '../../models/lists.model';

const chance = new Chance();

describe('Lists Effects', () => {
  let error: Error;
  let actions$: Subject<ListActions.Action>;
  let listsEffects: ListsEffects;
  let listsApiService: ListsApiService;
  let listsTransformerService: ListsTransformerService;
  let listHeaderMock: StoreHeaderInfoDTO;
  let storeListMock: ListStoreDTO[];
  let headerDetailMock: StoreHeaderDetails;
  let storesDataMock: StoreDetailsRow;
  let storesData: Array<StoreDetailsRow>;

  const listsApiServiceMock = {
    getStorePerformance(listIdMock: string): Observable<ListStoreDTO[]> {
      return Observable.of(storeListMock);
    },
    getHeaderDetail(listIdMock: string): Observable<StoreHeaderInfoDTO> {
      return Observable.of(listHeaderMock);
    }
  };

  let listsTransformerServiceMock = {
    formatListHeaderData(headerDataDTO: StoreHeaderInfoDTO): StoreHeaderDetails {
      return headerDetailMock;
    },
    formatStoreData(store: ListStoreDTO): StoreDetailsRow {
      return storesDataMock;
    },
  };

  beforeEach(() => {
    let listIdMock = chance.string();
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
  });

  beforeEach(inject([ ListsEffects, ListsApiService ],
    (_listsEffects: ListsEffects,
     _listsApiService: ListsApiService,
     _listsTransformerService: ListsTransformerService) => {
      listsEffects = _listsEffects;
      listsApiService = _listsApiService;
      listsTransformerService = _listsTransformerService;
    }
  ));

 fdescribe('when a FetchStoreDetails actions is received', () => {
    let actionPayloadMock: FetchStoreDetailsPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string()
      };

      actions$.next(new ListActions.FetchStoreDetails(actionPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call getStoreDetails from the ListsService given the passed in action payload', (done) => {
        const getOpportunitiesSpy = spyOn(listsApiService, 'getStorePerformance').and.callThrough();

        listsEffects.fetchStoreDetail$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesSpy.calls.count()).toBe(1);
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock.listId);
      });

      it('should dispatch a FetchStoreDetailsSuccess action with the returned GroupedData', (done) => {
        listsEffects.fetchStoreDetail$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchStoreDetailsSuccess(storesData));
          done();
        });
      });
    });

    describe('when an error is returned from getStoreDetails', () => {
      it('should dispatch a FetchStoreDetailsFailure action with the error', (done) => {
        spyOn(listsApiService, 'getStorePerformance').and.returnValue(Observable.throw(error));

        listsEffects.fetchStoreDetail$().subscribe((response) => {
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
        const getOpportunitiesSpy = spyOn(listsApiService, 'getHeaderDetail').and.callThrough();

        listsEffects.fetchStoreDetail$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesSpy.calls.count()).toBe(1);
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock.listId);
      });

      it('should dispatch a getHeaderDetailsSuccess action with the returned GroupedData', (done) => {
        listsEffects.fetchStoreDetail$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchHeaderDetailsSuccess(headerDetailMock));
          done();
        });
      });
    });

    describe('when an error is returned from getHeaderDetails', () => {
      it('should dispatch a FetchHeaderDetailsFailure action with the error', (done) => {
        spyOn(listsApiService, 'getHeaderDetail').and.returnValue(Observable.throw(error));

        listsEffects.fetchStoreDetail$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchHeaderDetailsFailure(error));
          done();
        });
      });
    });
  });
});
