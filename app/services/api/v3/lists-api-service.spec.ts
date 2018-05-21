import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getListBeverageTypeMock } from '../../../enums/list-beverage-type.enum.mock';
import { getListPerformanceDTOMock } from '../../../models/lists/list-performance-dto.model.mock';
import { getListsSummaryDTOMock } from '../../../models/lists/lists-header-dto.model.mock';
import { getStoreListsDTOMock } from '../../../models/lists/lists-store-dto.model.mock';
import { getListPerformanceTypeMock } from '../../../enums/list-performance-type.enum.mock';
import { getListOpportunitiesDTOMock } from '../../../models/lists/lists-opportunities-dto.model.mock';
import { getFormattedNewList } from '../../../models/lists/lists.model.mock';
import { ListsApiService } from './lists-api.service';
import { ListBeverageType } from '../../../enums/list-beverage-type.enum';
import { ListPerformanceDTO } from '../../../models/lists/list-performance-dto.model';
import { ListStoreDTO } from '../../../models/lists/lists-store-dto.model';
import { ListPerformanceType } from '../../../enums/list-performance-type.enum';
import { ListsSummaryDTO } from '../../../models/lists/lists-header-dto.model';
import { ListOpportunityDTO } from '../../../models/lists/lists-opportunities-dto.model';

describe('ListsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let listsApiService: ListsApiService;

  let listIdMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ListsApiService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    listsApiService = testBed.get(ListsApiService);

    listIdMock = chance.string(chanceStringOptions);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getLists', () => {

    it('should call the lists endpoint', () => {
      const expectedRequestUrl: string = `/v3/lists?includeCollaboratorLists=true&includeArchivedLists=true`;
      const expectedResponse: any  = {};
      listsApiService.getLists().subscribe((response: any) => {
        expect(response).toEqual(expectedResponse);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedResponse);
      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });

  describe('createList', () => {
    it('should post a new list to the lists endpoint', () => {
      const body = getFormattedNewList();
      const expectedRequestUrl: string = `/v3/lists`;
      const expectedResponse: any  = {};
      listsApiService.createList(body).subscribe((response: any) => {
        expect(response).toEqual(expectedResponse);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedResponse);
      expect(req.request.method).toBe(ApiRequestType.POST);
      expect(req.request.body).toBe(body);
    });
  });

  describe('addOpportunitiesToList', () => {
    it('should post a list of opportunities to the lists/:id/opportunities endpoint', () => {
      const listId = chance.string();
      const body = [{opportunityId: chance.string()}, {opportunityId: chance.string()}];
      const expectedRequestUrl: string = `/v3/lists/${ listId }/opportunities`;
      const expectedResponse: any  = {};
      listsApiService.addOpportunitiesToList(listId, body).subscribe((response: any) => {
        expect(response).toEqual(expectedResponse);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedResponse);
      expect(req.request.method).toBe(ApiRequestType.POST);
      expect(req.request.body).toBe(body);
    });
  });

  describe('addStoresToList', () => {
    it('should post a list of stores to the lists/:id/stores endpoint', () => {
      const listId = chance.string();
      const body = {storeSourceCode: chance.string()};
      const expectedRequestUrl: string = `/v3/lists/${ listId }/stores`;
      const expectedResponse: any  = {};
      listsApiService.addStoresToList(listId, body).subscribe((response: any) => {
        expect(response).toEqual(expectedResponse);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedResponse);
      expect(req.request.method).toBe(ApiRequestType.POST);
      expect(req.request.body).toBe(body);
    });
  });

  describe('getOppsDataForList', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `v3/lists/${ listIdMock }/opportunities`;
    });

    it('should call the Opportunities endpoint and return opportunities data for the given list ID', () => {
      const oppsForListDTOMock:  Array<ListOpportunityDTO> = getListOpportunitiesDTOMock();

      listsApiService.getOppsDataForList(
        listIdMock
      )
        .subscribe((response: ListOpportunityDTO[]) => {
          expect(response).toEqual(oppsForListDTOMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(oppsForListDTOMock);
      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });

  describe('getStoreListDetails', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }/stores`;
    });

    it('should call the stores list endpoint and return stores data for the given list ID', () => {
      const storeInfoDTOResponseMock:  Array<ListStoreDTO> = getStoreListsDTOMock();

      listsApiService.getStoreListDetails(
        listIdMock
      )
        .subscribe((response: Array<ListStoreDTO>) => {
          expect(response).toEqual(storeInfoDTOResponseMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(storeInfoDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

  });

  describe('getListHeaderDetail', () => {
    let expectedRequestUrl: string;
    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }`;
    });

    it('should call the lists header information endpoint and return data for the given list ID', () => {
      const expectedStoreHeaderInfoDTOMock: ListsSummaryDTO = getListsSummaryDTOMock();

      listsApiService.getListSummary(
        listIdMock
      )
        .subscribe((response: ListsSummaryDTO) => {
          expect(response).toEqual(expectedStoreHeaderInfoDTOMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedStoreHeaderInfoDTOMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });

  describe('getListStorePerformance', () => {
    let storePerformanceTypeMock: ListPerformanceType;
    let beverageTypeMock: ListBeverageType;
    let dateRangeCodeMock: DateRangeTimePeriodValue;
    let expectedRequestUrl: string;

    beforeEach(() => {
      storePerformanceTypeMock = getListPerformanceTypeMock();
      beverageTypeMock = getListBeverageTypeMock();
      dateRangeCodeMock = getDateRangeTimePeriodValueMock();
      expectedRequestUrl = `/v3/lists/${ listIdMock }/storePerformance`
        + `?type=${ storePerformanceTypeMock }`
        + `&beverageType=${ beverageTypeMock }`
        + `&dateRangeCode=${ dateRangeCodeMock }`;
    });

    it('should call the lists store performance endpoint and return list performance dto data with the given parameters', () => {
      const expectedListPerformanceDTO: ListPerformanceDTO = getListPerformanceDTOMock();

      listsApiService.getListStorePerformance(
        listIdMock,
        storePerformanceTypeMock,
        beverageTypeMock,
        dateRangeCodeMock
      )
      .subscribe((response: ListPerformanceDTO) => {
        expect(response).toEqual(expectedListPerformanceDTO);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedListPerformanceDTO);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });
});
