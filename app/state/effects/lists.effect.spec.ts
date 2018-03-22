import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import * as ProductMetricsActions from '../actions/product-metrics.action';
import * as ListActions from '../../state/actions/lists.action';
import { ListsEffects } from './lists.effect';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { Stores, StoresHeader } from '../../models/lists.model';
import { FetchHeaderDetails, FetchStoreDetails } from '../actions/lists.action';

const chance = new Chance();

describe('Lists Effects', () => {
  let error: Error;
  let actions$: Subject<ProductMetricsActions.Action>;
  let listIdMock: string;
  let listsEffects: ListsEffects;
  let listsApiService: ListsApiService;
  let storesDataMock: Stores;
  let storeHeaderInfoMock: StoresHeader;

  const listsApiServiceMock = {
    getStorePerformance(storesData: Stores): Observable<Stores> {
      return Observable.of(storesData);
    },
    getHeaderDetail(storedHeaderInfo: StoresHeader): Observable<StoresHeader> {
      return Observable.of(storedHeaderInfo);
    }
  };

  beforeEach(() => {
    listIdMock = chance.string();
    error = new Error(chance.string());

    storesDataMock = {
      listId: listIdMock
    };

    storeHeaderInfoMock = {
      listId: listIdMock
    };

    TestBed.configureTestingModule({
      providers: [
        ListsEffects,
        provideMockActions(() => actions$),
        {
          provide: ListsApiService,
          useValue: listsApiServiceMock
        }
      ]
    });

    actions$ = new ReplaySubject(1);
  });

  beforeEach(inject([ ListsEffects, ListsApiService ],
    (_listsEffects: ListsEffects,
     _listsApiService: ListsApiService) => {
      listsEffects = _listsEffects;
      listsApiService = _listsApiService;
    }
  ));

  describe('when a FetchStoreDetails actions is received', () => {
    let actionPayloadMock: FetchStoreDetails;

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
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock);
      });

      it('should dispatch a FetchStoreDetailsSuccess action with the returned GroupedData', (done) => {
        listsEffects.fetchStoreDetail$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchStoreDetailsSuccess(storesDataMock));
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
    let actionPayloadMock: FetchHeaderDetails;

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
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock);
      });

      it('should dispatch a getHeaderDetailsSuccess action with the returned GroupedData', (done) => {
        listsEffects.fetchStoreDetail$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchHeaderDetailsSuccess(storeHeaderInfoMock));
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
