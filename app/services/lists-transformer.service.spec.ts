import { inject, TestBed } from '@angular/core/testing';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntityPeopleResponsibilitiesMock,
         getHierarchyEntityDTO,
         mockHierarchyEntityDTOCollection } from '../models/hierarchy-entity.model.mock';
import { getEntitySubAccountDTOMock,
         getEntitySubAccountMultiPremiseTypesDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { GroupedEntities } from '../models/grouped-entities.model';
import { HierarchyEntity, HierarchyEntityDTO } from '../models/hierarchy-entity.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';

describe('Service: ResponsibilitiesTransformerService', () => {
  let responsibilitiesTransformerService: ResponsibilitiesTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ ResponsibilitiesTransformerService ]
  }));

  beforeEach(inject([ ResponsibilitiesTransformerService ],
    (_responsibilitiesTransformerService: ResponsibilitiesTransformerService) => {
      responsibilitiesTransformerService = _responsibilitiesTransformerService;
  }));

  describe('#groupPeopleByGroupedEntities', () => {

    it('should return a collection of formatted Responsibilitiess from a collection of ResponsibilitiesDTOs', () => {
      const expectedgroupedEntities: GroupedEntities = {
        'MARKET DEVELOPMENT MANAGER': [{
          positionId: '123',
          employeeId: '1231231',
          name: 'Joel Cummins',
          positionDescription: 'Director of Personnel',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '10',
          hierarchyType: 'SALES_HIER',
          entityType: EntityType.Person
        }, {
          positionId: '456',
          employeeId: '4564561',
          name: 'Andy Farag',
          positionDescription: '',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '20',
          hierarchyType: 'SALES_HIER',
          entityType: EntityType.Person
        }],
        'GENERAL MANAGER': [{
          positionId: '789',
          employeeId: '7897891',
          name: 'Ryan Stasik',
          positionDescription: '',
          description: 'GENERAL MANAGER',
          type: '30',
          hierarchyType: 'SALES_HIER',
          entityType: EntityType.Person
        }, {
          positionId: '987',
          employeeId: '2225687',
          name: 'Tom Brady',
          positionDescription: '',
          description: 'GENERAL MANAGER',
          type: '14',
          hierarchyType: 'SALES_HIER',
          entityType: EntityType.Person
        }]
      };
      const transformedgroupedEntities =
        responsibilitiesTransformerService.groupPeopleByGroupedEntities(mockHierarchyEntityDTOCollection);
      expect(transformedgroupedEntities).toEqual(expectedgroupedEntities);
    });
  });

  describe('groupPeopleEntitiesByRole', () => {
    it('should return GroupedEntities grouped by entity description given a HierarchyEntity collection', () => {
      const group1Mock = chance.string();
      const group2Mock = chance.string();
      const group3Mock = chance.string();
      const hierarchyEntitiesMock: HierarchyEntity[] = [
        getEntityPeopleResponsibilitiesMock(),
        getEntityPeopleResponsibilitiesMock(),
        getEntityPeopleResponsibilitiesMock(),
        getEntityPeopleResponsibilitiesMock()
      ];

      hierarchyEntitiesMock[0].description = group1Mock;
      hierarchyEntitiesMock[1].description = group2Mock;
      hierarchyEntitiesMock[2].description = group3Mock;
      hierarchyEntitiesMock[3].description = group1Mock;

      const expectedGroupedEntities: GroupedEntities = {
        [group1Mock]: [ hierarchyEntitiesMock[0], hierarchyEntitiesMock[3] ],
        [group2Mock]: [ hierarchyEntitiesMock[1] ],
        [group3Mock]: [ hierarchyEntitiesMock[2] ]
      };

      const actualGroupedEntities: GroupedEntities = responsibilitiesTransformerService.groupPeopleEntitiesByRole(hierarchyEntitiesMock);

      expect(actualGroupedEntities).toEqual(expectedGroupedEntities);
    });
  });

  describe('transformSubAccountsDTO', () => {

    it('should return Grouped HierarchyEntity given EntitySubAccountDTO objects under the given entityType', () => {
      spyOn(responsibilitiesTransformerService, 'transformSubAccountsDTO').and.callThrough();

      const entitySubAccountDTOMock: Array<EntitySubAccountDTO> = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      const entityTypeMock: string = chance.string();

      const groupedSubAccounts: GroupedEntities =
        responsibilitiesTransformerService.transformSubAccountsDTO(entitySubAccountDTOMock, entityTypeMock);

      expect(groupedSubAccounts).toBeDefined();
      expect(groupedSubAccounts[entityTypeMock][0]).toEqual({
        positionId: entitySubAccountDTOMock[0].id,
        name: entitySubAccountDTOMock[0].name,
        entityType: EntityType.SubAccount,
        premiseType: PremiseTypeValue[entitySubAccountDTOMock[0].premiseTypes[0]]
      });
      expect(groupedSubAccounts[entityTypeMock][1]).toEqual({
        positionId: entitySubAccountDTOMock[1].id,
        name: entitySubAccountDTOMock[1].name,
        entityType: EntityType.SubAccount,
        premiseType: PremiseTypeValue[entitySubAccountDTOMock[1].premiseTypes[0]]
      });
    });

    it('should return Grouped HierarchyEntity given EntitySubAccountDTO ' +
      'objects under the given entityType for multiple PremiseTypeValues', () => {
      spyOn(responsibilitiesTransformerService, 'transformSubAccountsDTO').and.callThrough();

      const entitySubAccountDTOMock: Array<EntitySubAccountDTO> = [getEntitySubAccountMultiPremiseTypesDTOMock()];
      const entityTypeMock: string = chance.string();

      const groupedSubAccounts: GroupedEntities =
        responsibilitiesTransformerService.transformSubAccountsDTO(entitySubAccountDTOMock, entityTypeMock);

      expect(groupedSubAccounts).toBeDefined();
      expect(groupedSubAccounts[entityTypeMock][0]).toEqual({
        positionId: entitySubAccountDTOMock[0].id,
        name: entitySubAccountDTOMock[0].name,
        entityType: EntityType.SubAccount,
        premiseType: PremiseTypeValue.All
      });
    });
  });

  describe('groupsAccountsDistributors', () => {

    it('should group a collection of HierarchyEntity objects under the given group name given a collection of EntitiesDTO objects', () => {
      const groupNameMock: string = chance.string();
      const entitiesDTOMock: Array<EntityDTO> = [getEntityDTOMock(), getEntityDTOMock()];

      entitiesDTOMock.forEach((entityDTO: EntityDTO) => {
        entityDTO.type = EntityType.Account;
      });

      const transformedAccountEntities = responsibilitiesTransformerService.groupsAccountsDistributors(entitiesDTOMock, groupNameMock);

      expect(transformedAccountEntities).toEqual({
        [groupNameMock]: [{
          name: entitiesDTOMock[0].name,
          positionId: entitiesDTOMock[0].id,
          entityType: EntityType.Account
        }, {
          name: entitiesDTOMock[1].name,
          positionId: entitiesDTOMock[1].id,
          entityType: EntityType.Account
        }]
      });

      entitiesDTOMock.forEach((entityDTO: EntityDTO) => {
        entityDTO.type = EntityType.Distributor;
      });

      const transformedDistributorEntities = responsibilitiesTransformerService.groupsAccountsDistributors(entitiesDTOMock, groupNameMock);

      expect(transformedDistributorEntities).toEqual({
        [groupNameMock]: [{
          name: entitiesDTOMock[0].name,
          positionId: entitiesDTOMock[0].id,
          entityType: EntityType.Distributor
        }, {
          name: entitiesDTOMock[1].name,
          positionId: entitiesDTOMock[1].id,
          entityType: EntityType.Distributor
        }]
      });
    });
  });

  describe('transformHierarchyEntityDTOCollection', () => {
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
