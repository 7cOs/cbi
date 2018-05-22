import * as Chance from 'chance';
import { Action } from '@ngrx/store';
import { getTestBed, TestBed } from '@angular/core/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';

import { CopyToListToastType } from '../../enums/lists/copy-to-list-toast-type.enum';
import { FormattedNewList } from '../../models/lists/formatted-new-list.model';
import { FetchHeaderDetailsPayload,
         FetchOppsForListPayload,
         FetchListPerformancePayload,
         FetchStoreDetailsPayload, LeaveListPayload, CopyStoresToListPayload, CopyOppsToListPayload } from '../actions/lists.action';
import { getDateRangeTimePeriodValueMock } from '../../enums/date-range-time-period.enum.mock';
import { getFormattedNewListMock } from '../../models/lists/formatted-new-list.model.mock';
import { getListBeverageTypeMock } from '../../enums/list-beverage-type.enum.mock';
import { getListOpportunitiesMock } from '../../models/lists/lists-opportunities.model.mock';
import { getListPerformanceDTOMock } from '../../models/lists/list-performance-dto.model.mock';
import { getListPerformanceMock } from '../../models/lists/list-performance.model.mock';
import { getListPerformanceTypeMock } from '../../enums/list-performance-type.enum.mock';
import { getListsSummaryMock } from '../../models/lists/lists-header.model.mock';
import { getOpportunitiesByStoreMock } from '../../models/lists/opportunities-by-store.model.mock';
import { getStoreListsMock } from '../../models/lists/lists-store.model.mock';
import * as ListActions from '../../state/actions/lists.action';
import { ListManageActionToastType } from '../../enums/lists/list-manage-action-toast-type.enum';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../../models/lists/list-performance-dto.model';
import { ListsEffects } from './lists.effect';
import { ListsApiService } from '../../services/api/v3/lists-api.service';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { ListOpportunityDTO } from '../../models/lists/lists-opportunities-dto.model';
import { ListsTransformerService } from '../../services/lists-transformer.service';
import { ListStoreDTO } from '../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../models/lists/lists-header-dto.model';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

const chance = new Chance();

describe('Lists Effects', () => {
  let testBed: TestBed;
  let listsEffects: ListsEffects;
  let listsApiService: ListsApiService;
  let toastService: any;
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
  let patchListPayloadMock: ListsSummaryDTO;
  let formattedListMock: FormattedNewList;

  const toastServiceMock = {
    showCopyToListToast: jasmine.createSpy('showCopyToListToast'),
    showListDetailManageActionToast: jasmine.createSpy('showListDetailManageActionToast')
  };

  const listsApiServiceMock = {
    addStoresToList(listId: string, stores: {storeSourceCode: string}): Observable<object> {
      return Observable.of({});
    },
    addOpportunitiesToList(listId: string, opps: [{opportunityId: string}]): Observable<object> {
      return Observable.of({});
    },
    deleteList(listId: string): Observable<object> {
      return Observable.of({});
    },
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
    updateList(formattedMock: FormattedNewList, listId: string): Observable<ListsSummaryDTO> {
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
    getLeaveListPayload(employeeId: string, listSummary: ListsSummary): FormattedNewList {
      return formattedListMock;
    },
    groupOppsByStore(allOpps: Array<ListsOpportunities>): OpportunitiesByStore {
      return groupedOppsObj;
    },
    convertCollaborators(list: ListsSummary): any {
      return formattedListMock;
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
          provide: 'toastService',
          useValue: toastServiceMock
        },
        {
          provide: ListsTransformerService,
          useValue: listsTransformerServiceMock
        },
        {
          provide: 'toastService',
          useValue: toastServiceMock
        }
      ]
    });

    testBed = getTestBed();
    listsEffects = testBed.get(ListsEffects);
    listsApiService = testBed.get(ListsApiService);
    toastService = testBed.get('toastService');
    listsTransformerService = testBed.get(ListsTransformerService);
    actions$ = new ReplaySubject(1);

    errorMock = new Error(chance.string());
    listPerformanceDTOMock = getListPerformanceDTOMock();
    listPerformanceMock = getListPerformanceMock();
    formattedListMock = getFormattedNewListMock();
  });

  afterEach(() => {
    toastServiceMock.showListDetailManageActionToast.calls.reset();
  });

  describe('when a FetchStoreDetails actions is received', () => {
    let actionPayloadMock: FetchStoreDetailsPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string()
      };

      actions$.next(new ListActions.FetchStoreDetails(actionPayloadMock));
    });

    afterEach(() => {
      toastServiceMock.showCopyToListToast.calls.reset();
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

  describe('when an action of type COPY_STORES_TO_LIST is received', () => {
    let actionPayloadMock: CopyStoresToListPayload;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string(),
        id: chance.string()
      };

      actions$.next(new ListActions.CopyStoresToList(actionPayloadMock));
    });

    it('should reach out to the listsApiService and call addStoresToList given the passed in action payload', (done) => {
      spyOn(listsApiService, 'addStoresToList').and.callThrough();

      listsEffects.copyStoresToList$().subscribe(() => {
        done();
      });

      expect(listsApiService.addStoresToList).toHaveBeenCalledWith(actionPayloadMock.listId, {storeSourceCode: actionPayloadMock.id});
    });

    describe('when the addStoresToList api call is successful', () => {
      it('should show an copyStoresToList success toast and dispatch an copyStoresToListSuccess action', (done) => {
        listsEffects.copyStoresToList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.CopyStoresToListSuccess);
          done();
        });

        expect(toastService.showCopyToListToast).toHaveBeenCalledWith(CopyToListToastType.CopyStores);
      });
    });

    describe('when the addStoresToList api call fails', () => {
      it('should show an copyStoresToList error toast and dispatch an copyStoresToListError action', (done) => {
        spyOn(listsApiService, 'addStoresToList').and.returnValue(Observable.throw(errorMock));

        listsEffects.copyStoresToList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.CopyStoresToListError);
          done();
        });

        expect(toastService.showCopyToListToast).toHaveBeenCalledWith(CopyToListToastType.CopyStoresError);
      });
    });
  });

  describe('when an action of type COPY_OPPS_TO_LIST is received', () => {
    let actionPayloadMock: CopyOppsToListPayload;
    let idMock = [{opportunityId: chance.string()}, {opportunityId: chance.string()}] ;

    beforeEach(() => {
      actionPayloadMock = {
        listId: chance.string(),
        ids: idMock
      };

      actions$.next(new ListActions.CopyOppsToList(actionPayloadMock));
    });

    it('should reach out to the listsApiService and call addOpportunitiesToList given the passed in action payload', (done) => {
      spyOn(listsApiService, 'addOpportunitiesToList').and.callThrough();

      listsEffects.copyOppsToList$().subscribe(() => {
        done();
      });

      expect(listsApiService.addOpportunitiesToList).toHaveBeenCalledWith(actionPayloadMock.listId, actionPayloadMock.ids);
    });

    describe('when the addOpportunitiesToList api call is successful', () => {
      it('should show an copyOppsToList success toast and dispatch an copyOppsToListSuccess action', (done) => {
        listsEffects.copyOppsToList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.CopyOppsToListSuccess);
          done();
        });

        expect(toastService.showCopyToListToast).toHaveBeenCalledWith(CopyToListToastType.CopyOpps);
      });
    });

    describe('when the addOpportunitiesToList api call fails', () => {
      it('should show an copyOppsToList error toast and dispatch an copyOppsToListError action', (done) => {
        spyOn(listsApiService, 'addOpportunitiesToList').and.returnValue(Observable.throw(errorMock));

        listsEffects.copyOppsToList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.CopyOppsToListError);
          done();
        });

        expect(toastService.showCopyToListToast).toHaveBeenCalledWith(CopyToListToastType.CopyOppsError);
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

  describe('when a patchList actions is received', () => {
    let actionListPayloadMock = getListsSummaryMock();
    beforeEach(() => {
      actions$.next(new ListActions.PatchList(actionListPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call updateList from the ListsService given the passed in action payload', (done) => {
        const updateListSpy = spyOn(listsApiService, 'updateList').and.returnValue(Observable.of(actionListPayloadMock));
        listsEffects.patchList$().subscribe(() => {
          done();
        });
        expect(updateListSpy.calls.count()).toBe(1);
        expect(updateListSpy.calls.argsFor(0)[1]).toEqual(actionListPayloadMock.id);
      });

      it('should dispatch a patchListSuccess action with the returned transformed data', (done) => {
        listsEffects.patchList$().subscribe((action: Action) => {
          expect(action).toEqual(new ListActions.PatchListSuccess(headerDetailMock));
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

  describe('when an action of type ARCHIVE_LIST is recevied', () => {
    let actionPayloadMock: ListsSummary;

    beforeEach(() => {
      actionPayloadMock = getListsSummaryMock();

      actions$.next(new ListActions.ArchiveList(actionPayloadMock));
    });

    it('should reach out to the listsTransformerService and call convertCollaborators with the action payload', (done) => {
      spyOn(listsTransformerService, 'convertCollaborators');

      listsEffects.archiveList$().subscribe(() => {
        done();
      });

      expect(listsTransformerService.convertCollaborators).toHaveBeenCalledWith(actionPayloadMock);
    });

    it('should reach out to the listsApiService and call updateList with the FormattedNewList having archived set to true and'
    + ' the list id from the action payload', (done) => {
      const expectedFormattedList: FormattedNewList = Object.assign({}, formattedListMock, {
        archived: true
      });

      spyOn(listsApiService, 'updateList').and.callThrough();

      listsEffects.archiveList$().subscribe(() => {
        done();
      });

      expect(listsApiService.updateList).toHaveBeenCalledWith(expectedFormattedList, actionPayloadMock.id);
    });

    describe('when the updateList api call is successful', () => {
      it('should show an archive success toast and dispatch an ArchiveListSuccess action', (done) => {
        listsEffects.archiveList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.ArchiveListSuccess);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.Archive);
      });
    });

    describe('when the updateList api call fails', () => {
      it('should show an archive error toast and dispatch an ArchiveListError action', (done) => {
        spyOn(listsApiService, 'updateList').and.returnValue(Observable.throw(errorMock));

        listsEffects.archiveList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.ArchiveListError);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.ArchiveError);
      });
    });
  });

  describe('when an action of type DELETE_LIST is recevied', () => {
    let actionPayloadMock: string;

    beforeEach(() => {
      actionPayloadMock = chance.string();

      actions$.next(new ListActions.DeleteList(actionPayloadMock));
    });

    it('should reach out to the listsApiService and call deleteList with the payload', (done) => {
      spyOn(listsApiService, 'deleteList').and.callThrough();

      listsEffects.deleteList$().subscribe(() => {
        done();
      });

      expect(listsApiService.deleteList).toHaveBeenCalledWith(actionPayloadMock);
    });

    describe('when the deleteList api call is successful', () => {
      it('should show a delete success toast and dispatch a DeleteListSuccess action', (done) => {
        listsEffects.deleteList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.DeleteListSuccess);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.Delete);
      });
    });

    describe('when the deleteList api call fails', () => {
      it('should show a delete error toast and dispatch an DeleteListError action', (done) => {
        spyOn(listsApiService, 'deleteList').and.returnValue(Observable.throw(errorMock));

        listsEffects.deleteList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.DeleteListError);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.DeleteError);
      });
    });
  });

  describe('when an action of type LEAVE_LIST is recevied', () => {
    let actionPayloadMock: LeaveListPayload;

    beforeEach(() => {
      actionPayloadMock = {
        currentUserEmployeeId: chance.string(),
        listSummary: getListsSummaryMock()
      };

      actions$.next(new ListActions.LeaveList(actionPayloadMock));
    });

    it('should reach out to the listsTransformerService and call getLeaveListPayload with the action payload', (done) => {
      spyOn(listsTransformerService, 'getLeaveListPayload');

      listsEffects.leaveList$().subscribe(() => {
        done();
      });

      expect(listsTransformerService.getLeaveListPayload).toHaveBeenCalledWith(
        actionPayloadMock.currentUserEmployeeId,
        actionPayloadMock.listSummary
      );
    });

    it('should reach out to the listsApiService and call updateList with the leave list payload and'
    + ' the list id from the action payload', (done) => {
      actionPayloadMock.currentUserEmployeeId = actionPayloadMock.listSummary.collaborators[0].employeeId;

      const expectedUpdateListPayload: FormattedNewList = Object.assign({}, formattedListMock, {
        collaboratorEmployeeIds: formattedListMock.collaboratorEmployeeIds.filter((employeeId: string) => {
          return employeeId !== actionPayloadMock.currentUserEmployeeId;
        })
      });

      spyOn(listsApiService, 'updateList').and.callThrough();

      listsEffects.leaveList$().subscribe(() => {
        done();
      });

      expect(listsApiService.updateList).toHaveBeenCalledWith(expectedUpdateListPayload, actionPayloadMock.listSummary.id);
    });

    describe('when the updateList api call is successful', () => {
      it('should show a leave list success toast and dispatch an LeaveListSuccess action', (done) => {
        listsEffects.leaveList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.LeaveListSuccess);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.Leave);
      });
    });

    describe('when the updateList api call fails', () => {
      it('should show a leave list error toast and dispatch a LeaveListError action', (done) => {
        spyOn(listsApiService, 'updateList').and.returnValue(Observable.throw(errorMock));

        listsEffects.leaveList$().subscribe((response: Action) => {
          expect(response).toEqual(new ListActions.LeaveListError);
          done();
        });

        expect(toastService.showListDetailManageActionToast).toHaveBeenCalledWith(ListManageActionToastType.LeaveError);
      });
    });
  });
});
