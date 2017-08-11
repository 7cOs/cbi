import * as Chance from 'chance';

import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
import { getMockRoleGroups } from '../../models/role-groups.model.mock';
import * as ResponsibilitiesActions from './responsibilities.action';
import { RoleGroups } from '../../models/role-groups.model';
let chance = new Chance();

describe('Responsibilities Actions', () => {

  describe('FetchResponsibilitiesAction', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesAction;
    let mockUserID: number;

    beforeEach(() => {
      mockUserID = chance.natural();
      action = new ResponsibilitiesActions.FetchResponsibilitiesAction(mockUserID);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION).toBe('[Responsibilities] FETCH_RESPONSIBILITIES_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(mockUserID);
    });
  });

  describe('FetchResponsibilitiesSuccessAction', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesSuccessAction;
    let mockRoleGroups: RoleGroups;

    beforeEach(() => {
      mockRoleGroups = getMockRoleGroups();
      action = new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(mockRoleGroups);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(mockRoleGroups);
    });
  });

  describe('FetchResponsibilitiesFailureAction', () => {
    const error: Error = new Error(chance.string());
    let action: ResponsibilitiesActions.FetchResponsibilitiesFailureAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(error);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(error);
    });
  });

  describe('FetchResponsibilitiesFailureAction', () => {
    const entityPeopleType = getEntityPeopleResponsibilitiesMock().peopleType;
    let action: ResponsibilitiesActions.GetPeopleByRoleGroupAction;

    beforeEach(() => {
      action = new ResponsibilitiesActions.GetPeopleByRoleGroupAction(entityPeopleType);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION)
        .toBe('[Responsibilities] GET_PEOPLE_BY_ROLE_GROUP_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual(entityPeopleType);
    });
  });

});
