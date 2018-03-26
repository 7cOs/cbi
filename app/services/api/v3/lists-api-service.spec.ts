import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
import { V3ApiHelperService } from './v3-api-helper.service';
import { ListsApiService } from './lists-api.service';
import { ListStoreDTO } from '../../../models/lists-store-dto.model';
import { StoreHeaderInfoDTO } from '../../../models/lists-store-header-dto.model';
import { getStoreListsDTOMock } from '../../../models/lists-store-dto.model.mock';
import { getStoreHeaderInfoDTOMock } from '../../../models/lists-store-header-dto.model.mock';

describe('ListsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let listsApiService: ListsApiService;

  let listIdMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ListsApiService, V3ApiHelperService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    listsApiService = testBed.get(ListsApiService);

    listIdMock = chance.string(chanceStringOptions);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getStorePerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }/stores`;
    });

    it('should call the stores information endpoint and return stores data for the given list ID', () => {
      const storeInfoDTOResponseMock:  Array<ListStoreDTO> = getStoreListsDTOMock();

      listsApiService.getStorePerformance(
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
  describe('getHeaderDetail', () => {
    let expectedRequestUrl: string;
    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }`;
    });

    it('should call the store header information endpoint and return data for the given list', () => {
      const expectedStoreHeaderInfoDTOMock: StoreHeaderInfoDTO = getStoreHeaderInfoDTOMock();

      listsApiService.getHeaderDetail(
        listIdMock
      )
        .subscribe((response: StoreHeaderInfoDTO) => {
          expect(response).toEqual(expectedStoreHeaderInfoDTOMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedStoreHeaderInfoDTOMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });
});
