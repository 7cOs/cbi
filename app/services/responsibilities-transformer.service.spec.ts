import { inject, TestBed } from '@angular/core/testing';

import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { mockEntityResponsibilitiesDTOCollection } from '../models/entity-responsibilities-dto.model.mock';
import { ResponsibilitiesTransformerService } from './responsibilities-transformer.service';
import { RoleGroups } from '../models/role-groups.model';

describe('Service: ResponsibilitiesTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ResponsibilitiesTransformerService
    ]
  }));

  describe('#groupPeopleByRoleGroups', () => {
    let responsibilitiesTransformerService: ResponsibilitiesTransformerService;
    beforeEach(inject([ ResponsibilitiesTransformerService ],
      (_responsibilitiesTransformerService: ResponsibilitiesTransformerService) => {
        responsibilitiesTransformerService = _responsibilitiesTransformerService;
    }));

    it('should return a collection of formatted Responsibilitiess from a collection of ResponsibilitiesDTOs', () => {
      spyOn(responsibilitiesTransformerService, 'groupPeopleByRoleGroups').and.callThrough();
      const expectedRoleGroups: RoleGroups = {
        'MARKET DEVELOPMENT MANAGER': [{
          id: 123,
          employeeId: '1231231',
          name: 'Joel Cummins',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '10',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER']
        }, {
          id: 456,
          employeeId: '4564561',
          name: 'Andy Farag',
          description: 'MARKET DEVELOPMENT MANAGER',
          type: '20',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['MARKET DEVELOPMENT MANAGER']
        }],
        'GENERAL MANAGER': [{
          id: 789,
          employeeId: '7897891',
          name: 'Ryan Stasik',
          description: 'GENERAL MANAGER',
          type: '30',
          hierarchyType: 'SALES_HIER',
          peopleType: EntityPeopleType['GENERAL MANAGER']
        }]
      };
      const transformedRoleGroups =
        responsibilitiesTransformerService.groupPeopleByRoleGroups(mockEntityResponsibilitiesDTOCollection);
      expect(transformedRoleGroups).toEqual(expectedRoleGroups);
    });
  });
});
