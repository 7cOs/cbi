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
        MDM: [
          {
            id: 123,
            name: 'Joe',
            typeDisplayName: 'Market Development Manager',
            peopleType: EntityPeopleType.MDM
          },
          {
            id: 456,
            name: 'Jack',
            typeDisplayName: 'Market Development Manager',
            peopleType: EntityPeopleType.MDM
          }
        ],
        Specialist: [
          {
            id: 789,
            name: 'Janet',
            typeDisplayName: 'Specialist',
            peopleType: EntityPeopleType.Specialist
          }
        ]
      };
      const transformedRoleGroups =
        responsibilitiesTransformerService.groupPeopleByRoleGroups(mockEntityResponsibilitiesDTOCollection);
      expect(transformedRoleGroups).toEqual(expectedRoleGroups);
    });
  });
});
