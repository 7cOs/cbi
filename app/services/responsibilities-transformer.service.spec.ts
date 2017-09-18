import { inject, TestBed } from '@angular/core/testing';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { GroupedEntities } from '../models/grouped-entities.model';
import { mockEntityResponsibilitiesDTOCollection } from '../models/entity-responsibilities.model.mock';
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
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '10',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER']
        }, {
          positionId: '456',
          employeeId: '4564561',
          name: 'Andy Farag',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '20',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER']
        }],
        'GENERAL MANAGER': [{
          positionId: '789',
          employeeId: '7897891',
          name: 'Ryan Stasik',
          description: 'GENERAL MANAGER',
          type: '30',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['GENERAL MANAGER']
        }]
      };
      const transformedgroupedEntities =
        responsibilitiesTransformerService.groupPeopleByGroupedEntities(mockEntityResponsibilitiesDTOCollection);
      expect(transformedgroupedEntities).toEqual(expectedgroupedEntities);
    });
  });

  describe('transformSubAccountsDTO', () => {

    it('should return EntityResponsibilities given EntitySubAccountDTO objects', () => {
      spyOn(responsibilitiesTransformerService, 'transformSubAccountsDTO').and.callThrough();

      const entitySubAccountDTOMock: Array<EntitySubAccountDTO> = getEntitySubAccountDTOMock();
      const entityResponsibilities: Array<EntityResponsibilities> =
        responsibilitiesTransformerService.transformSubAccountsDTO(entitySubAccountDTOMock);

      expect(entityResponsibilities).toBeDefined();
      expect(entityResponsibilities.length).toBeTruthy();
      expect(entityResponsibilities[0]).toEqual({
        positionId: entitySubAccountDTOMock[0].subaccountCode,
        contextPositionId: entitySubAccountDTOMock[0].accountCode,
        name: entitySubAccountDTOMock[0].subaccountDescription,
        propertyType: EntityPropertyType.SubAccount
      });
    });
  });

  describe('groupsAccountsDistributors', () => {

    it('should return a unique group of formatted entities from a collection of EntitiesDTO', () => {
      const entitiesDTOMock: Array<EntityDTO> = [getEntityDTOMock(), getEntityDTOMock()];
      const transformedEntities = responsibilitiesTransformerService.groupsAccountsDistributors(entitiesDTOMock);

      expect(transformedEntities).toEqual({
        'all': [{
          propertyType: entitiesDTOMock[0].type,
          positionId: entitiesDTOMock[0].id,
          name: entitiesDTOMock[0].name
        }, {
          propertyType: entitiesDTOMock[1].type,
          positionId: entitiesDTOMock[1].id,
          name: entitiesDTOMock[1].name
        }]
      });
    });
  });
});
