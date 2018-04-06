import { inject, TestBed } from '@angular/core/testing';

import { getStoreListsDTOMock } from '../models/lists-store-dto.model.mock';
import { getListHeaderInfoDTOMock } from '../models/lists-header-dto.model.mock';
import { ListsTransformerService } from './lists-transformer.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { StoreDetailsRow, ListHeaderDetails } from '../models/lists.model';
import { ListHeaderInfoDTO } from '../models/lists-header-dto.model';

describe('Service: ListsTransformerService', () => {
  let listsTransformerService: ListsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ListsTransformerService]
  }));

  beforeEach(inject([ListsTransformerService],
    (_listsTransformerService: ListsTransformerService) => {
      listsTransformerService = _listsTransformerService;
    }));

  describe('transformStoresData', () => {
    it('should transform the stores Data', () => {
      const storesDTOMock: Array<ListStoreDTO> = getStoreListsDTOMock();

      const actualStoreData: StoreDetailsRow[] =
        listsTransformerService.formatStoresData(storesDTOMock);

      actualStoreData.forEach((row: StoreDetailsRow, i: number) => {
        expect(row).toEqual({
          address: storesDTOMock[i].address,
          city: storesDTOMock[i].city,
          name: storesDTOMock[i].name,
          sevenDigitId: storesDTOMock[i].storeSourceCode,
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
      const listHeaderDTOMock: ListHeaderInfoDTO = getListHeaderInfoDTOMock();

      const actualHeaderData: ListHeaderDetails =
        listsTransformerService.formatListHeaderData(listHeaderDTOMock);

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
