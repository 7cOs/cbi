import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
import { getStoreListsDTOMock } from '../../../models/lists/lists-store-dto.model.mock';
import { getListsSummaryDTOMock } from '../../../models/lists/lists-header-dto.model.mock';
import { ListsApiService } from './lists-api.service';
import { ListStoreDTO } from '../../../models/lists/lists-store-dto.model';
import { ListsSummaryDTO } from '../../../models/lists/lists-header-dto.model';

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
});
