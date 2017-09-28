import { inject, TestBed } from '@angular/core/testing';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityPeopleType, EntityPropertyType, EntityType } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { GroupedEntities } from '../models/grouped-entities.model';
import { mockHierarchyEntityDTOCollection } from '../models/hierarchy-entity.model.mock';
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
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER'],
          entityType: EntityType.Person
        }, {
          positionId: '456',
          employeeId: '4564561',
          name: 'Andy Farag',
          positionDescription: '',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '20',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER'],
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
          peopleType: EntityPeopleType['GENERAL MANAGER'],
          entityType: EntityType.Person
        }, {
          positionId: '987',
          employeeId: '2225687',
          name: 'Tom Brady',
          positionDescription: '',
          description: 'GENERAL MANAGER',
          type: '14',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['GENERAL MANAGER'],
          entityType: EntityType.Person
        }]
      };
      const transformedgroupedEntities =
        responsibilitiesTransformerService.groupPeopleByGroupedEntities(mockHierarchyEntityDTOCollection);
      expect(transformedgroupedEntities).toEqual(expectedgroupedEntities);
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
        positionId: entitySubAccountDTOMock[0].subaccountCode,
        contextPositionId: entitySubAccountDTOMock[0].accountCode,
        name: entitySubAccountDTOMock[0].subaccountDescription,
        propertyType: EntityPropertyType.SubAccount,
        entityType: EntityType.SubAccount
      });
      expect(groupedSubAccounts[entityTypeMock][1]).toEqual({
        positionId: entitySubAccountDTOMock[1].subaccountCode,
        contextPositionId: entitySubAccountDTOMock[1].accountCode,
        name: entitySubAccountDTOMock[1].subaccountDescription,
        propertyType: EntityPropertyType.SubAccount,
        entityType: EntityType.SubAccount
      });
    });
  });

  describe('groupsAccountsDistributors', () => {

    it('should group a collection of HierarchyEntity objects under the given group name given a collection of EntitiesDTO objects', () => {
      const groupNameMock: string = chance.string();
      const entitiesDTOMock: Array<EntityDTO> = [getEntityDTOMock(), getEntityDTOMock()];
      const transformedEntities = responsibilitiesTransformerService.groupsAccountsDistributors(entitiesDTOMock, groupNameMock);

      expect(transformedEntities).toEqual({
        [groupNameMock]: [{
          name: entitiesDTOMock[0].name,
          positionId: entitiesDTOMock[0].id,
          entityType: EntityType.SubAccount,
          propertyType: entitiesDTOMock[0].type
        }, {
          name: entitiesDTOMock[1].name,
          positionId: entitiesDTOMock[1].id,
          entityType: EntityType.SubAccount,
          propertyType: entitiesDTOMock[1].type
        }]
      });
    });
  });
});
