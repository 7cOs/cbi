import { inject, TestBed } from '@angular/core/testing';

import { ListsTransformerService } from './lists-transformer.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { getStoreListsDTOMock } from '../models/lists-store-dto.model.mock';
import { StoreDetailsRow, StoreHeaderDetails } from '../models/lists.model';
import { StoreHeaderInfoDTO } from '../models/lists-store-header-dto.model';
import { getStoreHeaderInfoDTOMock } from '../models/lists-store-header-dto.model.mock';

describe('Service: ListsTransformerService', () => {
  let listsTransformerService: ListsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ ListsTransformerService ]
  }));

  beforeEach(inject([ ListsTransformerService ],
    (_listsTransformerService: ListsTransformerService) => {
      listsTransformerService = _listsTransformerService;
  }));

  describe('transformStoresData', () => {
    it('should transform the stores Data', () => {
      const storesDTOMock: Array<ListStoreDTO> = getStoreListsDTOMock();

      const actualStoreData: StoreDetailsRow[] =
        listsTransformerService.formatStoresData(storesDTOMock);

      actualStoreData.forEach((row: StoreDetailsRow, i: number) => {
        expect(row.address).toBe(storesDTOMock[i].address);
        expect(row.city).toBe(storesDTOMock[i].city);
        expect(row.name).toBe(storesDTOMock[i].name);
        expect(row.number).toBe(storesDTOMock[i].number);
        expect(row.postalCode).toBe(storesDTOMock[i].postalCode);
        expect(row.premiseType).toBe(storesDTOMock[i].premiseType);
        expect(row.state).toBe(storesDTOMock[i].state);
      });
    });
  });

  describe('transformHeaderData', () => {
    it('should transform header Data', () => {
      const listHeaderDTOMock: StoreHeaderInfoDTO = getStoreHeaderInfoDTOMock();

      const actualHeaderData: StoreHeaderDetails =
        listsTransformerService.formatListHeaderData(listHeaderDTOMock);

      expect(actualHeaderData.description).toBe(listHeaderDTOMock.description);
      expect(actualHeaderData.id).toBe(listHeaderDTOMock.id);
      expect(actualHeaderData.name).toBe(listHeaderDTOMock.name);
      expect(actualHeaderData.numberOfAccounts).toBe(listHeaderDTOMock.numberOfAccounts);
      expect(actualHeaderData.ownerFirstName).toBe(listHeaderDTOMock.owner.firstName);
      expect(actualHeaderData.ownerLastName).toBe(listHeaderDTOMock.owner.lastName);
    });
  });
});
