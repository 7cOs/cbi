import * as Chance from 'chance';

import { getRoleGroupsMock, getRoleGroupPerformanceTotalsMock } from '../../models/role-groups.model.mock';
import { RoleGroupPerformanceTotal, RoleGroups } from '../../models/role-groups.model';
import * as ResponsibilitiesActions from './responsibilities.action';

const chance = new Chance();

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
    let mockUserId: number;

    beforeEach(() => {
      mockRoleGroups = getRoleGroupsMock();
      mockUserId = chance.natural();

      action = new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction({
        positionId: mockUserId,
        responsibilities: mockRoleGroups
      });
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION);
    });

    it('should contain the mock payload', () => {
      expect(action.payload).toEqual({
        positionId: mockUserId,
        responsibilities: mockRoleGroups
      });
    });
  });

  describe('FetchResponsibilitiesPerformanceTotalsSuccess', () => {
    let action: ResponsibilitiesActions.FetchResponsibilitiesPerformanceTotalsSuccess;
    let mockPayload: Array<RoleGroupPerformanceTotal>;

    beforeEach(() => {
      mockPayload = getRoleGroupPerformanceTotalsMock();
      action = new ResponsibilitiesActions.FetchResponsibilitiesPerformanceTotalsSuccess(mockPayload);
    });

    it('should have the correct type', () => {
      expect(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS)
        .toBe('[Responsibilities] FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS');
      expect(action.type).toBe(ResponsibilitiesActions.FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS);
    });

    it('should contain the correct payload', () => {
      expect(action.payload).toEqual(mockPayload);
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
});
