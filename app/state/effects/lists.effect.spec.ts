import * as Chance from 'chance';
import { Action } from '@ngrx/store';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { FetchHeaderDetailsPayload,
         FetchOppsForListPayload,
         FetchListPerformancePayload,
         FetchStoreDetailsPayload } from '../actions/lists.action';
import { FormattedNewList } from '../../models/lists/lists.model';
import { getDateRangeTimePeriodValueMock } from '../../enums/date-range-time-period.enum.mock';
import { getListBeverageTypeMock } from '../../enums/list-beverage-type.enum.mock';
import { getListOpportunitiesMock } from '../../models/lists/lists-opportunities.model.mock';
import { getListPerformanceDTOMock } from '../../models/lists/list-performance-dto.model.mock';
import { getListPerformanceMock } from '../../models/lists/list-performance.model.mock';
import { getListPerformanceTypeMock } from '../../enums/list-performance-type.enum.mock';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import { getOpportunitiesByStoreMock } from '../../models/lists/opportunities-by-store.model.mock';
import * as ListActions from '../../state/actions/lists.action';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../../models/lists/list-performance-dto.model';
import { ListsEffects } from './lists.effect';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListStoreDTO } from '../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../models/lists/lists-header-dto.model';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { ListOpportunityDTO } from '../../models/lists/lists-opportunities-dto.model';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';

const chance = new Chance();

describe('Lists Effects', () => {
  let testBed: TestBed;
  let listsEffects: ListsEffects;
  let listsApiService: ListsApiService;
  let actions$: Subject<ListActions.Action>;

  let errorMock: Error;
  let listsTransformerService: ListsTransformerService;
  let listHeaderMock: ListsSummaryDTO;
  let storeListMock: ListStoreDTO[];
  let headerDetailMock: ListsSummary;
  let storesData: Array<StoreDetails> = getStoreListsMock();
  let listOpportunities: Array<ListsOpportunities> = getListOpportunitiesMock();
  let groupedOppsObj: OpportunitiesByStore = getOpportunitiesByStoreMock();
  let listOpportunitiesDTOMock: ListOpportunityDTO[];
  let listPerformanceDTOMock: ListPerformanceDTO;
  let listPerformanceMock: ListPerformance;
  let patchListPayloadMock: ListsSummary;

  const listsApiServiceMock = {
    getStoreListDetails(listIdMock: string): Observable<ListStoreDTO[]> {
      return Observable.of(storeListMock);
    },
    getListSummary(listIdMock: string): Observable<ListsSummaryDTO> {
      return Observable.of(listHeaderMock);
    },
    getListStorePerformance(listId: string): Observable<ListPerformanceDTO> {
      return Observable.of(listPerformanceDTOMock);
    },
    getOppsDataForList(listIdMock: string): Observable<ListOpportunityDTO[]> {
      return Observable.of(listOpportunitiesDTOMock);
    },
    updateList(payload: ListsSummary, listId: string): Observable<ListsSummary> {
      return Observable.of(patchListPayloadMock);
    }
  };

  const listsTransformerServiceMock = {
    formatListsSummaryData(headerDataDTO: ListsSummaryDTO): ListsSummary {
      return headerDetailMock;
    },
    formatStoresData(store: Array<ListStoreDTO>): Array<StoreDetails> {
      return storesData;
    },
    transformListPerformanceDTO(listPerformanceDTO: ListPerformanceDTO): ListPerformance {
      return listPerformanceMock;
    },
    formatListOpportunitiesData(oppotunity: Array<ListOpportunityDTO>): Array<ListsOpportunities> {
      return listOpportunities;
    },
    groupOppsByStore(allOpps: Array<ListsOpportunities>): OpportunitiesByStore {
      return groupedOppsObj;
    },
    convertCollaborators(list: ListsSummary): any {
      return list;
    }
  };

  beforeEach(() => {
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

    testBed = getTestBed();
    listsEffects = testBed.get(ListsEffects);
    listsApiService = testBed.get(ListsApiService);
    listsTransformerService = testBed.get(ListsTransformerService);
    actions$ = new ReplaySubject(1);

    errorMock = new Error(chance.string());
    listPerformanceDTOMock = getListPerformanceDTOMock();
    listPerformanceMock = getListPerformanceMock();
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
        spyOn(listsApiService, 'getStoreListDetails').and.returnValue(Observable.throw(errorMock));

        listsEffects.fetchStoreDetails$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchStoreDetailsFailure(errorMock));
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
        spyOn(listsApiService, 'getListSummary').and.returnValue(Observable.throw(errorMock));

        listsEffects.fetchHeaderDetails$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchHeaderDetailsFailure(errorMock));
          done();
        });
      });
    });
  });

  describe('when an action of type FETCH_LIST_PERFORMANCE_VOLUME is received', () => {
    let actionPayloadMock: FetchListPerformancePayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };

      actions$.next(new ListActions.FetchListPerformanceVolume(actionPayloadMock));
    });

    it('should call reach out to the listsApiService and call getListStorePerformance with the action payload', (done) => {
      spyOn(listsApiService, 'getListStorePerformance').and.callThrough();

      listsEffects.fetchListPerformanceVolume$().subscribe(() => {
        done();
      });

      expect(listsApiService.getListStorePerformance).toHaveBeenCalledWith(
        actionPayloadMock.listId,
        actionPayloadMock.performanceType,
        actionPayloadMock.beverageType,
        actionPayloadMock.dateRangeCode
      );
    });

    describe('when the getListStorePerformance api call is successful', () => {
      it('should reach out to the listsTransformerService and call transformListPerformanceDTO with'
      + ' the returned ListPerformanceDTO data', (done) => {
        spyOn(listsTransformerService, 'transformListPerformanceDTO').and.callThrough();

        listsEffects.fetchListPerformanceVolume$().subscribe(() => {
          done();
        });

        expect(listsTransformerService.transformListPerformanceDTO).toHaveBeenCalledWith(listPerformanceDTOMock);
      });

      it('should dispatch a FetchListPerformanceVolumeSuccess action with the transformed ListPerformance data', (done) => {
        listsEffects.fetchListPerformanceVolume$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.FetchListPerformanceVolumeSuccess(listPerformanceMock));
          done();
        });
      });
    });

    describe('when the getListStorePerformance api call returns an error', () => {
      it('should dispatch a FetchListPerformanceVolumeError action containing the error', (done) => {
        spyOn(listsApiService, 'getListStorePerformance').and.returnValue(Observable.throw(errorMock));

        listsEffects.fetchListPerformanceVolume$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.FetchListPerformanceVolumeError(errorMock));
          done();
        });
      });
    });
  });

  describe('when an action of type FETCH_LIST_PERFORMANCE_POD is received', () => {
    let actionPayloadMock: FetchListPerformancePayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string(),
        performanceType: getListPerformanceTypeMock(),
        beverageType: getListBeverageTypeMock(),
        dateRangeCode: getDateRangeTimePeriodValueMock()
      };

      actions$.next(new ListActions.FetchListPerformancePOD(actionPayloadMock));
    });

    it('should call reach out to the listsApiService and call getListStorePerformance with the action payload', (done) => {
      spyOn(listsApiService, 'getListStorePerformance').and.callThrough();

      listsEffects.fetchListPerformancePOD$().subscribe(() => {
        done();
      });

      expect(listsApiService.getListStorePerformance).toHaveBeenCalledWith(
        actionPayloadMock.listId,
        actionPayloadMock.performanceType,
        actionPayloadMock.beverageType,
        actionPayloadMock.dateRangeCode
      );
    });

    describe('when the getListStorePerformance api call is successful', () => {
      it('should reach out to the listsTransformerService and call transformListPerformanceDTO with'
      + ' the returned ListPerformanceDTO data', (done) => {
        spyOn(listsTransformerService, 'transformListPerformanceDTO').and.callThrough();

        listsEffects.fetchListPerformancePOD$().subscribe(() => {
          done();
        });

        expect(listsTransformerService.transformListPerformanceDTO).toHaveBeenCalledWith(listPerformanceDTOMock);
      });

      it('should dispatch a FetchListPerformancePODSuccess action with the transformed ListPerformance data', (done) => {
        listsEffects.fetchListPerformancePOD$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.FetchListPerformancePODSuccess(listPerformanceMock));
          done();
        });
      });
    });

    describe('when the getListStorePerformance api call returns an error', () => {
      it('should dispatch a FetchListPerformancePODError action containing the error', (done) => {
        spyOn(listsApiService, 'getListStorePerformance').and.returnValue(Observable.throw(errorMock));

        listsEffects.fetchListPerformancePOD$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.FetchListPerformancePODError(errorMock));
          done();
        });
      });
    });
  });

  fdescribe('when a patchList actions is received', () => {
    let actionListPayloadMock = getListsSummaryMock();
    beforeEach(() => {
      actions$.next(new ListActions.PatchList(actionListPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call updateList from the ListsService given the passed in action payload', (done) => {
        spyOn(listsTransformerServiceMock, 'convertCollaborators').and.callFake(() => {
          return actionListPayloadMock;
        });
        const updateListSpy = spyOn(listsApiService, 'updateList').and.callThrough();
        listsEffects.patchList$().subscribe(() => {
          done();
        });
        expect(updateListSpy.calls.count()).toBe(1);
        expect(updateListSpy.calls.argsFor(0)[1]).toEqual(actionListPayloadMock.id);
      });

      it('should dispatch a patchListSuccess action with the returned transformed data', (done) => {
        listsEffects.patchList$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.PatchListSuccess(actionListPayloadMock));
          done();
        });
      });
    });

    describe('when an error is returned from patchListSuccess', () => {
      it('should dispatch a PatchListFailure action with the error', (done) => {
        spyOn(listsApiService, 'updateList').and.returnValue(Observable.throw(errorMock));

        listsEffects.patchList$().subscribe((response) => {
          expect(response).toEqual(new ListActions.PatchListFailure(errorMock));
          done();
        });
      });
    });
  });

  describe('when a FetchOppsForList actions is received', () => {
    let actionPayloadMock: FetchOppsForListPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string()
      };

      actions$.next(new ListActions.FetchOppsForList(actionPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call getOppsDataForList from the ListsService given the passed in action payload', (done) => {
        const getOpportunitiesForListSpy = spyOn(listsApiService, 'getOppsDataForList').and.callThrough();

        listsEffects.fetchOppsforList$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesForListSpy.calls.count()).toBe(1);
        expect(getOpportunitiesForListSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock.listId);
      });

      it('should dispatch a FetchOppsForListSuccess action with the returned Formatted Data', (done) => {
        listsEffects.fetchOppsforList$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.FetchOppsForListSuccess(groupedOppsObj));
          done();
        });
      });
    });

    describe('when an error is returned from getOppsDataForList', () => {
      it('should dispatch a FetchOppsForListFailure action with the error', (done) => {
        spyOn(listsApiService, 'getOppsDataForList').and.returnValue(Observable.throw(errorMock));

        listsEffects.fetchOppsforList$().subscribe((response) => {
          expect(response).toEqual(new ListActions.FetchOppsForListFailure(errorMock));
          done();
        });
      });
    });
  });
});
