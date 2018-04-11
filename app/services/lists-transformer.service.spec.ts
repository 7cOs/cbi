import { getTestBed, TestBed } from '@angular/core/testing';

import { getListsSummaryDTOMock } from '../models/lists/lists-header-dto.model.mock';
import { getStoreListsDTOMock } from '../models/lists/lists-store-dto.model.mock';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { ListsTransformerService } from './lists-transformer.service';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { StoreDetails } from '../models/lists/lists-store.model';

describe('Service: ListsTransformerService', () => {
  let listsTransformerService: ListsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ListsTransformerService]
  }));

  let testBed: TestBed;

  beforeEach(() => {
    testBed = getTestBed();
    listsTransformerService = testBed.get(ListsTransformerService);
  });

  describe('transformStoresData', () => {
    it('should transform the stores Data', () => {
      const storesDTOMock: Array<ListStoreDTO> = getStoreListsDTOMock();

      const actualStoreData: StoreDetails[] =
        listsTransformerService.formatStoresData(storesDTOMock);

      actualStoreData.forEach((row: StoreDetails, i: number) => {
        expect(row).toEqual({
          address: storesDTOMock[i].address,
          city: storesDTOMock[i].city,
          name: storesDTOMock[i].name,
          unversionedStoreId: storesDTOMock[i].storeSourceCode,
          number: storesDTOMock[i].number,
          postalCode: storesDTOMock[i].postalCode,
          premiseType: storesDTOMock[i].premiseType,
          state: storesDTOMock[i].state,
          segmentCode: storesDTOMock[i].segmentCode,
          distributor: storesDTOMock[i].primaryBeerDistributor.name
        });
      });
    });
  });

  describe('transformHeaderData', () => {
    it('should transform header Data', () => {
      const listHeaderDTOMock: ListsSummaryDTO = getListsSummaryDTOMock();

      const actualHeaderData: ListsSummary =
        listsTransformerService.formatListsSummaryData(listHeaderDTOMock);

      expect(actualHeaderData).toEqual(jasmine.objectContaining({
        description: listHeaderDTOMock.description,
        id: listHeaderDTOMock.id,
        name: listHeaderDTOMock.name,
        numberOfAccounts: listHeaderDTOMock.numberOfAccounts,
        ownerFirstName: listHeaderDTOMock.owner.firstName,
        ownerLastName: listHeaderDTOMock.owner.lastName,
        totalOpportunities: listHeaderDTOMock.totalOpportunities,
        closedOpportunities: listHeaderDTOMock.numberOfClosedOpportunities
      }));
    });
  });
});
