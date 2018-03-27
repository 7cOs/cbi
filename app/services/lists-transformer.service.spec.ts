/*
import { inject, TestBed } from '@angular/core/testing';

import { ListsTransformerService } from './lists-transformer.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { getStoreListsDTOMock } from '../models/lists-store-dto.model.mock';

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
      const storesDTOMock: Array<ListStoreDTO> = [ getStoreListsDTOMock(), getStoreListsDTOMock() ];

      const expectedHierachyEntities: Array<ListStoreDTO> = [{
        address: store.address,
        city: store.city,
        name: store.number,
        number: store.number,
        postalCode: store.postalCode,
        premiseType: store.premiseType,
        state : store.state
      }, {
        address: store.address,
        city: store.city,
        name: store.number,
        number: store.number,
        postalCode: store.postalCode,
        premiseType: store.premiseType,
        state : store.state
      }];

      const actualHierarchyEntities: Array<ListStoreDTO> =
        listsTransformerService.formatStoresData(storesDTOMock);

      expect(actualHierarchyEntities).toEqual(expectedHierachyEntities);
    });
  });

  describe('transformHeaderData', () => {
    it('should return a collection of hierarchy entities given a collection of hierarchy entity DTO\'s', () => {
      const hierarchyEntitiesDTOMock: HierarchyEntityDTO[] = [ getHierarchyEntityDTO(), getHierarchyEntityDTO() ];

      const expectedHierachyEntities: HierarchyEntity[] = [{
        positionId: hierarchyEntitiesDTOMock[0].id,
        employeeId: hierarchyEntitiesDTOMock[0].employeeId,
        name: hierarchyEntitiesDTOMock[0].name,
        description: hierarchyEntitiesDTOMock[0].description,
        positionDescription: '',
        type: hierarchyEntitiesDTOMock[0].type,
        hierarchyType: hierarchyEntitiesDTOMock[0].hierarchyType,
        entityType: EntityType.Person
      }, {
        positionId: hierarchyEntitiesDTOMock[1].id,
        employeeId: hierarchyEntitiesDTOMock[1].employeeId,
        name: hierarchyEntitiesDTOMock[1].name,
        description: hierarchyEntitiesDTOMock[1].description,
        positionDescription: '',
        type: hierarchyEntitiesDTOMock[1].type,
        hierarchyType: hierarchyEntitiesDTOMock[1].hierarchyType,
        entityType: EntityType.Person
      }];

      const actualHierarchyEntities: HierarchyEntity[] =
        responsibilitiesTransformerService.transformHierarchyEntityDTOCollection(hierarchyEntitiesDTOMock);

      expect(actualHierarchyEntities).toEqual(expectedHierachyEntities);
    });
  });
});
*/
